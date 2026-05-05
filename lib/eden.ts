import { treaty } from "@elysiajs/eden";

import type { TApp } from "@/types/api";

import { env } from "./env";

export const api = treaty<TApp>(env.NEXT_PUBLIC_API_URL);
