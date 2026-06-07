// lib/env.ts
//
// INTERNAL_API_URL is server-only — read by the BFF proxy at
// app/api/[...proxy]/route.ts. The browser bundle never sees it.
// Browsers always reach the BE via relative URLs through that proxy.
import { z } from "zod";

const serverEnvSchema = z.object({
  INTERNAL_API_URL: z.url(),
});

export type TServerEnv = z.infer<typeof serverEnvSchema>;

const parsed = serverEnvSchema.safeParse({
  INTERNAL_API_URL: process.env.INTERNAL_API_URL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid server environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid server environment variables");
}

export const env: TServerEnv = parsed.data;
