"use client";

import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";

import { examplesKeys } from "../services/examples.keys";
import { createExample, getExampleById, getExamples } from "../services/examples.service";
import type { TCreateExampleInput, TExample } from "../types";
import { sortExamplesByName } from "../utils/example-format";

export type TUseExamplesReturn = UseQueryResult<TExample[], Error>;
export type TUseExampleReturn = UseQueryResult<TExample, Error>;
export type TUseCreateExampleReturn = UseMutationResult<
  TExample,
  Error,
  TCreateExampleInput
>;

export function useExamples(): TUseExamplesReturn {
  return useQuery({
    queryKey: examplesKeys.list(),
    queryFn: () => getExamples(),
    select: response => sortExamplesByName(response.items),
  });
}

export function useExample(id: string): TUseExampleReturn {
  return useQuery({
    queryKey: examplesKeys.detail(id),
    queryFn: () => getExampleById(id),
    enabled: !!id,
  });
}

export function useCreateExample(): TUseCreateExampleReturn {
  const queryClient = useQueryClient();

  const handleCreated = () =>
    queryClient.invalidateQueries({ queryKey: examplesKeys.lists() });

  return useMutation({
    mutationFn: createExample,
    onSuccess: handleCreated,
  });
}
