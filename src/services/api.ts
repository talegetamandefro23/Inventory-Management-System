/**
 * Base API Client
 *
 * This module provides a configurable HTTP client that can be swapped
 * with a real backend by changing the BASE_URL and adding auth headers.
 *
 * To connect to a real API:
 * 1. Set API_BASE_URL environment variable
 * 2. Update fetchClient to include auth tokens
 * 3. Remove mock data from src/data/ and use API responses
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function fetchClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, params } = options;

  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    if (qs) url += `?${qs}`;
  }

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(
      errorBody.message || `Request failed: ${response.statusText}`,
      response.status
    );
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    fetchClient<T>(endpoint, { params }),

  post: <T>(endpoint: string, body: unknown) =>
    fetchClient<T>(endpoint, { method: "POST", body }),

  put: <T>(endpoint: string, body: unknown) =>
    fetchClient<T>(endpoint, { method: "PUT", body }),

  patch: <T>(endpoint: string, body: unknown) =>
    fetchClient<T>(endpoint, { method: "PATCH", body }),

  delete: <T>(endpoint: string) =>
    fetchClient<T>(endpoint, { method: "DELETE" }),
};

export { ApiError };
export type { RequestOptions };
