import { type IViewStateInput, type TViewState, ViewStateKind } from "@/types/view-state";

export function toViewState<T>(input: IViewStateInput<T>): TViewState<T> {
  const { queries, build, isEmpty } = input;

  const error = queries.map(query => query.error).find(candidate => !!candidate);
  if (error) {
    const retry = () => {
      queries.forEach(query => {
        query.refetch();
      });
    };
    return { kind: ViewStateKind.Error, error, retry };
  }

  if (queries.some(query => query.isLoading)) {
    return { kind: ViewStateKind.Loading };
  }

  const data = build();
  if (data === null) {
    return { kind: ViewStateKind.NotFound };
  }

  if (isEmpty?.(data)) {
    return { kind: ViewStateKind.Empty };
  }

  return { kind: ViewStateKind.Ready, data };
}
