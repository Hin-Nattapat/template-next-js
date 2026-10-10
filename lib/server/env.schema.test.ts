import { expect, test } from "bun:test";

import { parseServerEnv } from "./env.schema";

const valid = { INTERNAL_API_URL: "http://localhost:8080" };

test("a valid environment is returned with the default NODE_ENV", () => {
  expect(parseServerEnv(valid)).toEqual({ ...valid, NODE_ENV: "development" });
});

test("a set NODE_ENV is kept", () => {
  expect(parseServerEnv({ ...valid, NODE_ENV: "production" }).NODE_ENV).toBe(
    "production",
  );
});

test("an unknown NODE_ENV throws", () => {
  expect(() => parseServerEnv({ ...valid, NODE_ENV: "staging" })).toThrow();
});

test("a missing API URL throws", () => {
  expect(() => parseServerEnv({ ...valid, INTERNAL_API_URL: undefined })).toThrow();
});

test("an API URL without a scheme throws", () => {
  expect(() => parseServerEnv({ ...valid, INTERNAL_API_URL: "localhost" })).toThrow();
});
