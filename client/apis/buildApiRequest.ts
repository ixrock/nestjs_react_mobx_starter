import { getApiToken } from "./apiToken.storage";

export const API_BASE = "/api/v1";

export interface BuildApiParams {
  basePath: string;
  apiBase?: string; // default: "/api/v1"
  method?: "GET" | "POST" | "PUT" | "DELETE";
}

export interface RequestApiParams {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  data?: BodyInit;
}

export type ApiBuildHelper<Response> = ReturnType<typeof buildApiRequest<Response>>;

export function buildApiRequest<Response>({ apiBase = API_BASE, basePath = "", method = "GET" }: BuildApiParams) {
  const apiPath = `${apiBase}${basePath}`;
  let abortController: AbortController;

  return {
    async request(params: RequestApiParams = {}): Promise<Response> {
      abortController = new AbortController();

      const response = await fetch(apiPath, {
        signal: abortController.signal,
        method: params.method ?? method,
        body: params.data,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getApiToken()}`,
          ...(params.headers ?? {})
        }
      });

      if (response.status >= 400 && response.status < 600) {
        const error: ApiError = await response.json();
        throw new ApiError(error.statusCode, error.message);
      }

      return response.json();
    },

    cancel() {
      abortController?.abort("Request cancelled");
    }
  };
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
