import { expect, test } from "bun:test";

import { formatDate, formatMoney, formatNumber, formatPercent } from "./format";

test("money is formatted with the given currency", () => {
  expect(formatMoney(1234.5, "USD")).toBe("$1,234.50");
});

test("numbers use grouping separators", () => {
  expect(formatNumber(1234567)).toBe("1,234,567");
});

test("a ratio is shown as a percent with the requested decimals", () => {
  expect(formatPercent(0.256)).toBe("26%");
  expect(formatPercent(0.256, 1)).toBe("25.6%");
});

test("a date string is shown in the medium style", () => {
  expect(
    formatDate("2026-10-04T12:00:00Z", { dateStyle: "medium", timeZone: "UTC" }),
  ).toBe("Oct 4, 2026");
});
