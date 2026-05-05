// Zod schemas for the example feature.
// Schemas live next to the service so they can be reused (forms, server actions, tests)
// without polluting the service file with shape definitions.
import { z } from "zod";

import type { TCreateExampleInput, TExample } from "../types";

export const exampleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<TExample>;

export const createExampleInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
}) satisfies z.ZodType<TCreateExampleInput>;

export const examplesResponseSchema = z.object({
  items: z.array(exampleSchema),
  total: z.number(),
});

export type TExamplesResponse = z.infer<typeof examplesResponseSchema>;
