export const examplesKeys = {
  all: ["examples"] as const,
  lists: () => [...examplesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...examplesKeys.lists(), filters] as const,
  details: () => [...examplesKeys.all, "detail"] as const,
  detail: (id: string) => [...examplesKeys.details(), id] as const,
};
