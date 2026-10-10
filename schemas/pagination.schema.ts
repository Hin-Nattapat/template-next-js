import { z } from "zod";

export const paginationSchema = z.object({
  page: z.number(),
  size: z.number(),
  count: z.number().optional(),
  last_page: z.number(),
});

// pageResponseSchema wraps any entity schema into the common envelope.
export const pageResponseSchema = <T extends z.ZodTypeAny>(entity: T) =>
  z.object({
    page_information: paginationSchema,
    entities: z.array(entity),
  });
