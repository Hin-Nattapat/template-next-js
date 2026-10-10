import { expect, test } from "bun:test";

import { compareValues } from "./table";

test("nullish values sort before everything else", () => {
  expect(compareValues(null, undefined)).toBe(0);
  expect(compareValues(null, 1)).toBeLessThan(0);
  expect(compareValues(1, undefined)).toBeGreaterThan(0);
});

test("dates compare by time", () => {
  expect(compareValues(new Date(2020, 0, 1), new Date(2021, 0, 1))).toBeLessThan(0);
});

test("numbers compare numerically, not as text", () => {
  expect(compareValues(10, 9)).toBeGreaterThan(0);
});

test("strings compare as text", () => {
  expect(compareValues("a", "b")).toBeLessThan(0);
  expect(compareValues("b", "b")).toBe(0);
});
