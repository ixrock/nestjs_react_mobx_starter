import { EventEmitter } from "events";
import { getApiToken } from "./apiToken.storage";

export const API_BASE = "/api/v1";
export const apiEvents = new EventEmitter<ApiEventsMap>();

export interface ApiEventsMap {
  data: any[]; // get every valid api response data in this event
  apiError: [ApiError]; // catch all api errors
  authError: [ApiError]; // auth-errors only (401, 403)
  jsonParseError: [SyntaxError];
}

export interface BuildApiParams {
  basePath: string;
  apiBase?: string; // default: "/api/v1"
  method?: "GET" | "POST" | "PUT" | "DELETE";
}

export interface RequestApiParams<RequestPayload = BodyInit | ApiJsonObject> {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  data?: RequestPayload;
}

export type ApiJsonObject = object | string | number | boolean | null | undefined;

export function buildApiRequest<Response, RequestPayload = {}>(
  {
    method: defaultMethod = "GET",
    apiBase = API_BASE,
    basePath = ""
  }: BuildApiParams) {
  const apiPath = `${apiBase}${basePath}`;
  let abortController: AbortController;

  return {
    async request({ method = defaultMethod, headers, data }: RequestApiParams<RequestPayload> = {}): Promise<Response> {
      abortController = new AbortController();

      const response = await fetch(apiPath, {
        signal: abortController.signal,
        method,
        body: isJsonData(data) ? JSON.stringify(data) : data as BodyInit,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getApiToken()}`,
          ...(headers ?? {})
        }
      });

      // handle errors by status code before fetching body response stream
      const isError = response.status >= 400 && response.status < 600;
      const errorCode = isError ? response.status : 0;

      if (errorCode) {
        const error: ApiError = await response.json();
        const apiError = new ApiError(errorCode, error.message);
        if (errorCode === 401 || errorCode === 403) {
          apiEvents.emit("authError", apiError);
        }
        apiEvents.emit("apiError", apiError);
        throw apiError;
      }

      // handle data response and possible parsing errors
      try {
        const data = await response.clone().json();
        apiEvents.emit("data", data);
        return data;
      } catch (err: unknown) {
        apiEvents.emit("jsonParseError", err as SyntaxError);
        throw {
          message: `Failed to parse JSON body: ${err}`,
          statusCode: response.status,
          response: await response.text()
        };
      }
    },

    cancel() {
      abortController?.abort("Request cancelled");
    }
  };
}

export function isJsonData(data: unknown): data is ApiJsonObject {
  const isObject = typeof data == "object" && data !== null;
  const isPlainObject = isObject && String(data) === "[object Object]";
  return isObject && isPlainObject;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export class ApiError extends Error {
  constructor(public statusCode: number, public message: string) {
    super(message);
    Error.captureStackTrace(this, new.target);
  }
}
