import { apiClient } from "@/lib/api-client";

import type { TCreateExampleInput, TExample } from "../types";
import {
  exampleSchema,
  examplesResponseSchema,
  type TExamplesResponse,
} from "./examples.schema";

export function getExamples(): Promise<TExamplesResponse> {
  return apiClient.get("/examples", undefined, examplesResponseSchema);
}

export function getExampleById(id: string): Promise<TExample> {
  return apiClient.get(`/examples/${id}`, undefined, exampleSchema);
}

export function createExample(input: TCreateExampleInput): Promise<TExample> {
  return apiClient.post("/examples", { body: input }, exampleSchema);
}
