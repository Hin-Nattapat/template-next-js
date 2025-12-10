import { treaty } from "@elysiajs/eden";

import type { TApp } from "@/types/api";

export const api = treaty<TApp>(process.env.NEXT_PUBLIC_API_URL!);
