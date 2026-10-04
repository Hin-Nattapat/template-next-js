import { expect, test } from "bun:test";

import { Locale, localeTag, resolveLocale, serializeLocaleCookie } from "./locale";

test("an unknown or missing locale falls back to Thai", () => {
  expect(resolveLocale(undefined)).toBe(Locale.Th);
  expect(resolveLocale("")).toBe(Locale.Th);
  expect(resolveLocale("jp")).toBe(Locale.Th);
  expect(resolveLocale("en")).toBe(Locale.En);
});

test("the locale cookie is site-wide and lasts one year", () => {
  expect(serializeLocaleCookie(Locale.En)).toBe(
    "locale=en; Path=/; Max-Age=31536000; SameSite=Lax",
  );
});

test("Thai dates use Gregorian years with Latin numerals", () => {
  expect(localeTag(Locale.Th)).toBe("th-TH-u-ca-gregory-nu-latn");
});
