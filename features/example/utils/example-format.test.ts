import { expect, test } from "bun:test";

import type { TExample } from "../types";
import { formatExampleLabel, sortExamplesByName } from "./example-format";

const makeExample = (name: string): TExample => ({
  id: name,
  name,
  description: `about ${name}`,
  createdAt: "2026-10-04T00:00:00Z",
});

test("the label joins the name and the description", () => {
  expect(formatExampleLabel(makeExample("Alpha"))).toBe("Alpha — about Alpha");
});

test("examples are sorted by name without touching the input", () => {
  const input = [makeExample("Charlie"), makeExample("Alpha"), makeExample("Bravo")];

  const sorted = sortExamplesByName(input);

  expect(sorted.map(e => e.name)).toEqual(["Alpha", "Bravo", "Charlie"]);
  expect(input.map(e => e.name)).toEqual(["Charlie", "Alpha", "Bravo"]);
});
