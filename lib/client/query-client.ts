import "client-only";

import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

import {
  MAX_QUERY_RETRIES,
  MUTATION_RETRIES,
  QUERY_STALE_MS,
} from "./query-client.constants";

export function createQueryClient(onError?: (error: unknown) => void): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_MS,
        refetchOnWindowFocus: false,
        retry: MAX_QUERY_RETRIES,
      },
      mutations: {
        retry: MUTATION_RETRIES,
      },
    },
  });
}
