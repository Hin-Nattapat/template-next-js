import "client-only";

import type { z } from "zod";

import { HttpStatus } from "@/types/http.constants";

import { ApiError } from "../api-error";

export type TQueryValue = string | number | boolean | null | undefined;

export type TRequestOptions = {
  query?: Record<string, TQueryValue>;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export type TBodyOptions<TBody> = TRequestOptions & {
  body?: TBody;
};

function buildUrl(path: string, query?: TRequestOptions["query"]): string {
  // Always use relative URLs. The browser resolves against the FE origin,
  // which routes /api/* through the BFF proxy at app/api/[...proxy]/route.ts.
  // The proxy forwards to the BE so the browser never speaks to it directly.
  const search = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) {
        continue;
      }
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}

async function request<TResponse>(
  method: string,
  path: string,
  options: TBodyOptions<unknown> = {},
  schema?: z.ZodType<TResponse>,
): Promise<TResponse> {
  const { body, query, headers, signal } = options;
  const url = buildUrl(path, query);

  // FormData bodies need the browser to set Content-Type with the
  // multipart boundary; explicitly setting application/json there would
  // prevent that. Plain object bodies still serialize as JSON.
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const init: RequestInit = {
    method,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    signal,
    credentials: "same-origin",
  };

  if (body !== undefined) {
    init.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    const errorBody = await safeJson(res);
    throw new ApiError(res.status, res.statusText || "Request failed", errorBody);
  }

  if (res.status === HttpStatus.NoContent) {
    return undefined as TResponse;
  }

  const data = await res.json();
  return schema ? schema.parse(data) : (data as TResponse);
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export const apiClient = {
  get<TResponse>(
    path: string,
    options?: TRequestOptions,
    schema?: z.ZodType<TResponse>,
  ): Promise<TResponse> {
    return request<TResponse>("GET", path, options, schema);
  },
  post<TResponse, TBody = unknown>(
    path: string,
    options?: TBodyOptions<TBody>,
    schema?: z.ZodType<TResponse>,
  ): Promise<TResponse> {
    return request<TResponse>("POST", path, options, schema);
  },
  patch<TResponse, TBody = unknown>(
    path: string,
    options?: TBodyOptions<TBody>,
    schema?: z.ZodType<TResponse>,
  ): Promise<TResponse> {
    return request<TResponse>("PATCH", path, options, schema);
  },
  put<TResponse, TBody = unknown>(
    path: string,
    options?: TBodyOptions<TBody>,
    schema?: z.ZodType<TResponse>,
  ): Promise<TResponse> {
    return request<TResponse>("PUT", path, options, schema);
  },
  delete<TResponse>(
    path: string,
    options?: TRequestOptions,
    schema?: z.ZodType<TResponse>,
  ): Promise<TResponse> {
    return request<TResponse>("DELETE", path, options, schema);
  },
};
