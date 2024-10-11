import { getApiToken } from "./apiToken.storage";

export const API_BASE = "/api/v1";

export type ApiJsonObject = object | string | number | boolean | null | undefined;

export interface BuildApiParams {
  basePath: string;
  apiBase?: string; // default: "/api/v1"
  method?: "GET" | "POST" | "PUT" | "DELETE";
}

export interface RequestApiParams {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  data?: BodyInit | ApiJsonObject;
}

export type ApiBuildHelper<Response> = ReturnType<typeof buildApiRequest<Response>>;

export function buildApiRequest<Response>(
  {
    method: defaultMethod = "GET",
    apiBase = API_BASE,
    basePath = ""
  }: BuildApiParams) {
  const apiPath = `${apiBase}${basePath}`;
  let abortController: AbortController;

  return {
    async request({ method = defaultMethod, headers, data }: RequestApiParams = {}): Promise<Response> {
      abortController = new AbortController();

      const response = await fetch(apiPath, {
        signal: abortController.signal,
        method,
        body: isJsonData(data) ? JSON.stringify(data) : data,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getApiToken()}`,
          ...(headers ?? {})
        }
      });

      const isError = response.status >= 400 && response.status < 600;
      const errorCode = isError ? response.status : 0;

      if (errorCode) {
        const error: ApiError = await response.json();
        throw new ApiError(errorCode, error.message);
      }

      return response.json();
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
    super(`API Error (${statusCode}): ` + message);
    Error.captureStackTrace(this, new.target);
  }
}
