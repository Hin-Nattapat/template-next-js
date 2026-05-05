// Example hook — colocates state + data fetching for this feature.
"use client";

import { useEffect, useState } from "react";

import { getExamples } from "../services/examples.service";
import type { TExample } from "../types";

export type TUseExamplesReturn = {
  examples: TExample[];
  isLoading: boolean;
  error: string | null;
};

export function useExamples(): TUseExamplesReturn {
  const [examples, setExamples] = useState<TExample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getExamples()
      .then(res => {
        if (!cancelled) setExamples(res.items);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { examples, isLoading, error };
}
