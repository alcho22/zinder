/**
 * Thin HTTP client wrapper.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ BACKEND DEVELOPER — START HERE                                            │
 * │                                                                           │
 * │ The whole frontend talks to the backend through the functions in         │
 * │ `src/services/*.ts`. Today those functions return MOCK data (see          │
 * │ `USE_MOCK` below and `src/services/mock/`). To connect the real backend:  │
 * │                                                                           │
 * │  1. Set VITE_USE_MOCK=false in a `.env` file (see `.env.example`).        │
 * │  2. Set VITE_API_BASE_URL to your API root (e.g. https://api.zinder.com). │
 * │  3. Implement endpoints to match the calls in each service file. Each     │
 * │     mock function has a matching `http.*` call commented above it showing │
 * │     the expected method + path + payload.                                 │
 * │                                                                           │
 * │ Auth: we send `Authorization: Bearer <token>`. The token is stored in     │
 * │ localStorage under `zinder.token` after login (see services/auth.ts).     │
 * └─────────────────────────────────────────────────────────────────────────┘
 */

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

export const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK as string | undefined) !== 'false';

const TOKEN_KEY = 'zinder.token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** Set to false for endpoints that don't need auth. */
  auth?: boolean;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query, auth = true } = opts;

  const url = new URL(
    API_BASE_URL.replace(/\/$/, '') + path,
    window.location.origin,
  );
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers
    .get('content-type')
    ?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (data && typeof data === 'object' && 'message' in data
        ? (data as { message: string }).message
        : null) ?? `Request failed (${res.status})`;
    throw new ApiError(res.status, message, data);
  }

  return data as T;
}

export const http = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
};

/** Small helper to simulate network latency in mock mode. */
export function mockDelay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
