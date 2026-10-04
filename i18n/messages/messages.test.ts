import { expect, test } from "bun:test";

import { commonMessages } from "./common";
import { exampleMessages } from "./example";
import { homeMessages } from "./home";
import { navMessages } from "./nav";

const bundles = { commonMessages, exampleMessages, homeMessages, navMessages };

test("every bundle has the same keys in Thai and English", () => {
  for (const bundle of Object.values(bundles)) {
    expect(Object.keys(bundle.th).sort()).toEqual(Object.keys(bundle.en).sort());
  }
});

test("interpolated messages are plain functions per locale", () => {
  expect(exampleMessages.en.option(2)).toBe("Option 2");
  expect(exampleMessages.th.option(2)).toBe("ตัวเลือก 2");
});
