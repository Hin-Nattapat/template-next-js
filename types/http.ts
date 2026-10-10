export type TQueryValue = string | number | boolean | null | undefined;

export type TRequestOptions = {
  query?: Record<string, TQueryValue>;
  headers?: HeadersInit;
  signal?: AbortSignal;
};

export type TBodyOptions<TBody> = TRequestOptions & {
  body?: TBody;
};
