import { z } from "zod";

export enum SortDir {
  Asc = "asc",
  Desc = "desc",
}

export interface IPagination {
  page: number;
  size: number;
  count?: number;
  last_page: number;
}

export interface IPageResponse<T> {
  page_information: IPagination;
  entities: T[];
}

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
