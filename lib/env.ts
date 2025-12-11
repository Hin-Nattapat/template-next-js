// lib/env.ts
import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
});

export type TClientEnv = z.infer<typeof clientEnvSchema>;

const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

if (!parsed.success) {
  console.error(
    "❌ Invalid client environment variables:",
    parsed.error.flatten().fieldErrors,
  );
  throw new Error("Invalid client environment variables");
}

export const env: TClientEnv = parsed.data;
