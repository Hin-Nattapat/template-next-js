// Example service layer — wraps the Eden Treaty client for this feature.
// Replace `api.examples` with the actual route on your backend once `TApp` is wired up.
import { api } from "@/lib/eden";

import type { TCreateExampleInput, TExample } from "../types";

export type TExamplesResponse = {
  items: TExample[];
  total: number;
};

type TExampleApi = {
  examples: {
    get: () => Promise<{ data: TExamplesResponse }>;
    post: (input: TCreateExampleInput) => Promise<{ data: TExample }>;
  } & ((params: { id: string }) => {
    get: () => Promise<{ data: TExample }>;
  });
};

const exampleApi = api as unknown as TExampleApi;

export async function getExamples(): Promise<TExamplesResponse> {
  const { data } = await exampleApi.examples.get();
  return data;
}

export async function getExampleById(id: string): Promise<TExample> {
  const { data } = await exampleApi.examples({ id }).get();
  return data;
}

export async function createExample(input: TCreateExampleInput): Promise<TExample> {
  const { data } = await exampleApi.examples.post(input);
  return data;
}
