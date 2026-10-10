import { expect, test } from "bun:test";

import { formatNumber, sanitizeNumber } from "./number-input";

test("sanitize strips commas and non-digit characters", () => {
  expect(sanitizeNumber("1,234abc", false, 2)).toBe("1234");
  expect(sanitizeNumber("", false, 2)).toBe("");
});

test("sanitize keeps one decimal point and caps the decimal places", () => {
  expect(sanitizeNumber("1.2.3", false, 2)).toBe("1.23");
  expect(sanitizeNumber("1.23456", false, 2)).toBe("1.23");
  expect(sanitizeNumber("1.5", false, 0)).toBe("15");
});

test("sanitize keeps a leading minus only when negatives are allowed", () => {
  expect(sanitizeNumber("-12", true, 0)).toBe("-12");
  expect(sanitizeNumber("-12", false, 0)).toBe("12");
});

test("format adds thousand separators to the integer part", () => {
  expect(formatNumber("1234567")).toBe("1,234,567");
  expect(formatNumber("-1234")).toBe("-1,234");
});

test("format keeps a trailing dot and fractional zeros while typing", () => {
  expect(formatNumber("1234.")).toBe("1,234.");
  expect(formatNumber("1234.50")).toBe("1,234.50");
});

test("format leaves empty and lone-minus values alone", () => {
  expect(formatNumber("")).toBe("");
  expect(formatNumber("-")).toBe("-");
});
