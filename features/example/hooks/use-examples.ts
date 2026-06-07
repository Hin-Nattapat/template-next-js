"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { examplesKeys } from "../services/examples.keys";
import { createExample, getExampleById, getExamples } from "../services/examples.service";
import type { TCreateExampleInput } from "../types";

export function useExamples() {
  return useQuery({
    queryKey: examplesKeys.list(),
    queryFn: () => getExamples(),
  });
}

export function useExample(id: string) {
  return useQuery({
    queryKey: examplesKeys.detail(id),
    queryFn: () => getExampleById(id),
    enabled: Boolean(id),
  });
}

export function useCreateExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateExampleInput) => createExample(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examplesKeys.lists() });
    },
  });
}
