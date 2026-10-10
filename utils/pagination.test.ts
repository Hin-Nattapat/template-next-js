import { expect, test } from "bun:test";

import { pageWindow } from "./pagination";

test("a small last page lists every page with no ellipsis", () => {
  expect(pageWindow(1, 1)).toEqual([1]);
  expect(pageWindow(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
});

test("the first pages show an ellipsis only before the last page", () => {
  expect(pageWindow(1, 20)).toEqual([1, 2, -1, 20]);
  expect(pageWindow(2, 20)).toEqual([1, 2, 3, -1, 20]);
});

test("a middle page shows an ellipsis on both sides", () => {
  expect(pageWindow(10, 20)).toEqual([1, -1, 9, 10, 11, -1, 20]);
});

test("the last pages show an ellipsis only after the first page", () => {
  expect(pageWindow(19, 20)).toEqual([1, -1, 18, 19, 20]);
  expect(pageWindow(20, 20)).toEqual([1, -1, 19, 20]);
});
