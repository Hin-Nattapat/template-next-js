import type { z } from "zod";

import { ApiError } from "./api-error";
import { env } from "./env";

type TQueryValue = string | number | boolean | null | undefined;

export type TRequestOptions = {
  query?: Record<string, TQueryValue>;
  headers?: HeadersInit;
  signal?: AbortSignal;
  // Next.js fetch caching options — only apply on the server.
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
};

export type TBodyOptions<TBody> = TRequestOptions & {
  body?: TBody;
};

function buildUrl(path: string, query?: TRequestOptions["query"]): string {
  const url = new URL(
    path.startsWith("http") ? path : `${env.NEXT_PUBLIC_API_URL}${path}`,
  );

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function request<TResponse>(
  method: string,
  path: string,
  options: TBodyOptions<unknown> = {},
  schema?: z.ZodType<TResponse>,
): Promise<TResponse> {
  const { body, query, headers, signal, cache, next } = options;
  const url = buildUrl(path, query);

  const init: RequestInit & { next?: TRequestOptions["next"] } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    signal,
    cache,
    next,
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init);

  if (!res.ok) {
    const errorBody = await safeJson(res);
    throw new ApiError(res.status, res.statusText || "Request failed", errorBody);
  }

  if (res.status === 204) {
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
