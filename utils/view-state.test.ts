import { describe, expect, test } from "bun:test";

import { type IViewStateQuery, ViewStateKind } from "@/types/view-state";

import { toViewState } from "./view-state";

function makeQuery(overrides: Partial<IViewStateQuery> = {}): IViewStateQuery {
  return { isLoading: false, error: null, refetch: () => undefined, ...overrides };
}

describe("toViewState", () => {
  test("a loading query gives loading", () => {
    const view = toViewState({
      queries: [makeQuery({ isLoading: true })],
      build: () => 1,
    });
    expect(view.kind).toBe(ViewStateKind.Loading);
  });

  test("an error beats a query that is still loading", () => {
    const view = toViewState({
      queries: [makeQuery({ error: new Error("x") }), makeQuery({ isLoading: true })],
      build: () => 1,
    });
    expect(view.kind).toBe(ViewStateKind.Error);
  });

  test("a failed background refetch with data present is still an error", () => {
    const view = toViewState({
      queries: [makeQuery({ error: new Error("refetch failed") })],
      build: () => [1, 2, 3],
    });
    expect(view.kind).toBe(ViewStateKind.Error);
  });

  test("loading beats not found", () => {
    const view = toViewState({
      queries: [makeQuery({ isLoading: true })],
      build: () => null,
    });
    expect(view.kind).toBe(ViewStateKind.Loading);
  });

  test("a build that returns null gives not found", () => {
    const view = toViewState({ queries: [makeQuery()], build: () => null });
    expect(view.kind).toBe(ViewStateKind.NotFound);
  });

  test("an empty result gives empty", () => {
    const view = toViewState({
      queries: [makeQuery()],
      build: () => [] as number[],
      isEmpty: data => data.length === 0,
    });
    expect(view.kind).toBe(ViewStateKind.Empty);
  });

  test("anything else is ready with the data", () => {
    const view = toViewState({
      queries: [makeQuery()],
      build: () => [1],
      isEmpty: data => data.length === 0,
    });
    expect(view).toEqual({ kind: ViewStateKind.Ready, data: [1] });
  });

  test("retry refetches every query once", () => {
    const calls: string[] = [];
    const view = toViewState({
      queries: [
        makeQuery({ error: new Error("x"), refetch: () => calls.push("first") }),
        makeQuery({ refetch: () => calls.push("second") }),
      ],
      build: () => 1,
    });
    if (view.kind === ViewStateKind.Error) {
      view.retry();
    }
    expect(calls).toEqual(["first", "second"]);
  });
});
