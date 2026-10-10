import "server-only";

import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  INTERNAL_API_URL: z.url(),
});

export type TServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(raw: Record<string, string | undefined>): TServerEnv {
  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: raw.NODE_ENV,
    INTERNAL_API_URL: raw.INTERNAL_API_URL,
  });

  if (!parsed.success) {
    const fields = [...new Set(parsed.error.issues.map(issue => issue.path.join(".")))];
    console.error("Invalid server environment variables:", fields.join(", "));
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
}
