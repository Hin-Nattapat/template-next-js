export enum ViewStateKind {
  Loading = "loading",
  Error = "error",
  Empty = "empty",
  NotFound = "not_found",
  Ready = "ready",
}

export type TViewState<T> =
  | { kind: ViewStateKind.Loading }
  | { kind: ViewStateKind.Error; error: Error; retry: () => void }
  | { kind: ViewStateKind.Empty }
  | { kind: ViewStateKind.NotFound }
  | { kind: ViewStateKind.Ready; data: T };

export interface IViewStateQuery {
  isLoading: boolean;
  error: Error | null;
  refetch: () => unknown;
}

export interface IViewStateInput<T> {
  queries: IViewStateQuery[];
  build: () => T | null;
  isEmpty?: (data: T) => boolean;
}
