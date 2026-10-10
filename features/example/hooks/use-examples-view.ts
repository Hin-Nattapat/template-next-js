"use client";

import type { TViewState } from "@/types/view-state";
import { toViewState } from "@/utils/view-state";

import type { TExample } from "../types";
import { useExamples } from "./use-examples";

export function useExamplesView(): TViewState<TExample[]> {
  const examplesQuery = useExamples();

  const build = () => examplesQuery.data ?? null;

  return toViewState({ queries: [examplesQuery], build });
}
