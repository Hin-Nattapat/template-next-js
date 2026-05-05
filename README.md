# template-next-js

Opinionated Next.js 16 template tuned for fast feature delivery.

The naming and architecture rules an AI agent (or new contributor) must follow live in [`.claude/CLAUDE.md`](./.claude/CLAUDE.md). This README covers the human-facing parts: setup, scripts, stack details, and worked examples.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york) + lucide-react
- **State**: Zustand
- **Forms**: react-hook-form + Zod (`@hookform/resolvers`)
- **API**: Native `fetch` wrapper with Zod runtime validation (`lib/api-client.ts`)
- **Theming**: `next-themes` (light / dark / system)
- **Notifications**: sonner toast + a promise-based dialog system
- **Tooling**: ESLint flat config, Prettier (with Tailwind plugin), Husky, lint-staged
- **Runtime**: Bun (Node 20+ also works)

## Getting started

```bash
bun install
cp .env.example .env.local
bun dev
```

Then open <http://localhost:3000>. The home page links to `/example`, a working showcase of the form, dialog, and toast patterns.

## Scripts

| Command         | What it does                    |
| --------------- | ------------------------------- |
| `bun dev`       | Start dev server with Turbopack |
| `bun run build` | Production build                |
| `bun start`     | Serve production build          |
| `bun lint`      | `eslint . --fix`                |
| `bun format`    | `prettier --write .`            |

`husky` + `lint-staged` run ESLint and Prettier on staged files at commit time.

## Project structure

```
app/                    # routes (thin — render feature components)
  (public)/             # route group: public pages
    page.tsx
    example/page.tsx
  layout.tsx
  error.tsx             # error boundary
  loading.tsx           # suspense fallback
  not-found.tsx         # 404
  globals.css           # Tailwind v4 theme tokens

features/<feature>/     # all feature logic lives here
  components/           # one component per file (xxx-page.tsx is the entry point)
  hooks/                # use-xxx.ts
  services/             # xxx.service.ts + xxx.schema.ts (zod schemas)
  utils/                # pure helpers
  types.ts              # entity types

components/
  ui/                   # shadcn primitives (do not modify heavily)
  common/               # app-wide reusable components, theme provider, dialog root
  form-controls/        # RHF-bound inputs (FormInput, FormSelect, FormInputArea)

stores/                 # Zustand stores (xxx.store.ts → useXxxStore)
hooks/                  # global hooks (use-dialog, ...)
lib/                    # api-client, api-error, env, utils
types/                  # global types (global.ts, dialog.ts)
```

## Conventions cheat sheet

Full rules in [`.claude/CLAUDE.md`](./.claude/CLAUDE.md). Highlights:

- **kebab-case** for every file and folder name.
- **PascalCase** only for component identifiers inside files.
- One component per file. No inline sub-components.
- `const Component = (props: IProps) => { const { x } = props; ... }; export default Component`
- `interface I*` for object/prop shapes; `type T*` for unions, generics, entities, response types.
- Hooks return `TUseXxxReturn`. Stores expose `useXxxStore` with a `TXxxState` type.
- Logic lives in feature hooks. Routes stay thin (one-line re-export).

## API client

`lib/api-client.ts` is a thin `fetch` wrapper. **All HTTP traffic must go through it** — do not call `fetch` directly in feature code.

It:

- Prefixes paths with `NEXT_PUBLIC_API_URL` (validated by `lib/env.ts`)
- Sets JSON headers and parses JSON responses
- Throws `ApiError(status, message, body)` from `lib/api-error.ts` on non-2xx
- Validates the response with an optional Zod schema (3rd arg)
- Forwards Next.js fetch options (`cache`, `next.revalidate`, `next.tags`) so Server Components get free caching/revalidation

### Defining a service

Schemas live next to the service so they can be reused for form validation. See `features/example/services/`:

```ts
// features/example/services/examples.schema.ts
import { z } from "zod";

import type { TCreateExampleInput, TExample } from "../types";

export const exampleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  createdAt: z.string(),
}) satisfies z.ZodType<TExample>;

export const createExampleInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
}) satisfies z.ZodType<TCreateExampleInput>;

export const examplesResponseSchema = z.object({
  items: z.array(exampleSchema),
  total: z.number(),
});

export type TExamplesResponse = z.infer<typeof examplesResponseSchema>;
```

```ts
// features/example/services/examples.service.ts
import { apiClient } from "@/lib/api-client";

import type { TCreateExampleInput, TExample } from "../types";
import {
  exampleSchema,
  examplesResponseSchema,
  type TExamplesResponse,
} from "./examples.schema";

export function getExamples(): Promise<TExamplesResponse> {
  return apiClient.get("/examples", undefined, examplesResponseSchema);
}

export function getExampleById(id: string): Promise<TExample> {
  return apiClient.get(`/examples/${id}`, undefined, exampleSchema);
}

export function createExample(input: TCreateExampleInput): Promise<TExample> {
  return apiClient.post("/examples", { body: input }, exampleSchema);
}
```

### Server Component usage

```tsx
import { getExamples } from "@/features/example/services/examples.service";

const ExamplesPage = async () => {
  const data = await getExamples();
  return <ExamplesList items={data.items} />;
};

export default ExamplesPage;
```

Pass Next.js fetch options for caching:

```ts
return apiClient.get(
  "/examples",
  { next: { revalidate: 60, tags: ["examples"] } },
  examplesResponseSchema,
);
```

### Client Component usage

Wrap services in feature hooks. Components call hooks, not services directly.

```ts
"use client";

import { useEffect, useState } from "react";

import { getExamples } from "../services/examples.service";
import type { TExample } from "../types";

export type TUseExamplesReturn = {
  examples: TExample[];
  isLoading: boolean;
  error: string | null;
};

export function useExamples(): TUseExamplesReturn {
  const [examples, setExamples] = useState<TExample[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getExamples()
      .then(res => !cancelled && setExamples(res.items))
      .catch(
        err => !cancelled && setError(err instanceof Error ? err.message : "Unknown"),
      )
      .finally(() => !cancelled && setIsLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { examples, isLoading, error };
}
```

For richer client-side caching, deduping, and mutations, layer TanStack Query on top — services stay unchanged.

### Error handling

`apiClient` throws `ApiError` on any non-2xx response. Catch at the boundary (hook, server component, server action):

```ts
import { ApiError } from "@/lib/api-error";

try {
  await createExample(input);
} catch (err) {
  if (err instanceof ApiError && err.status === 409) {
    toast.error("Already exists");
    return;
  }
  throw err;
}
```

## Forms

`react-hook-form` + Zod resolver. The bound controls in `components/form-controls/` consume `useFormContext`, so wrap the form in `<Form {...form}>`:

```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FormInput from "@/components/form-controls/form-input";
import { Form } from "@/components/ui/form";
import { createExampleInputSchema } from "@/features/example/services/examples.schema";

type TFormValues = z.infer<typeof createExampleInputSchema>;

const ExampleForm = () => {
  const form = useForm<TFormValues>({
    resolver: zodResolver(createExampleInputSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit = form.handleSubmit(values => {
    // call service here
    console.log(values);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormInput required name="name" label="Name" />
        <FormInput required name="description" label="Description" />
        <button type="submit">Save</button>
      </form>
    </Form>
  );
};

export default ExampleForm;
```

The same `createExampleInputSchema` is shared between the form (validation) and the service (request body validation).

## Notifications

```ts
import { toast } from "sonner";

toast.success("Saved");
toast.error("Something went wrong");
```

## Dialog system

Promise-based, accessed via `useDialog()`:

```ts
"use client";

import { useDialog } from "@/hooks/use-dialog";

const Component = () => {
  const dialog = useDialog();

  const handleDelete = async () => {
    const ok = await dialog.confirmDelete();
    if (!ok) return;
    // proceed with deletion
  };

  const handleSuccess = () => {
    dialog.success({ title: "Done", message: "Saved successfully" });
  };
};
```

Variants: `alert`, `info`, `success`, `warning`, `error`, `confirm`, `confirmDelete`. The dialog root is mounted once in `app/layout.tsx` via `<AppDialogRoot />`.

## Theming

`next-themes` is wired in `components/common/theme-provider.tsx` with `attribute="class"`, `defaultTheme="system"`. Toggle the theme by calling `useTheme()` from `next-themes` in any client component.

CSS variables are defined in `app/globals.css` (light root + `.dark` overrides). Use the matching Tailwind classes (`bg-background`, `text-foreground`, `text-destructive`, etc.) — never hard-code colors.

## Replacing the example feature

The `features/example/` folder is a working scaffold demonstrating the full pattern. When you start a new feature:

1. Copy `features/example/` to `features/<your-feature>/`.
2. Rename files and identifiers (`example` → `your-feature`, `Example` → `YourFeature`).
3. Add the route at `app/(public)/<your-feature>/page.tsx` (one-line re-export).
4. Delete the original `features/example/` once you no longer need it as a reference.

## Environment variables

| Variable              | Description                   |
| --------------------- | ----------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API. |

Validated at boot in `lib/env.ts` with Zod. Add new public variables to that schema; add server-only variables to a separate `serverEnvSchema`.
