import { mock } from "bun:test";

// `server-only` and `client-only` throw outside their Next build; unit tests import both sides directly.
mock.module("server-only", () => ({}));
mock.module("client-only", () => ({}));
