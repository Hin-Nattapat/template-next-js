# template-next-js

Opinionated Next.js 16 template tuned for fast feature delivery.

The naming and architecture rules an AI agent (or new contributor) must follow live in [`.claude/CLAUDE.md`](./.claude/CLAUDE.md). This README covers the human-facing parts: setup, scripts, stack details, and worked examples.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york) + lucide-react
- **State (client)**: Zustand
- **State (server)**: TanStack Query (`@tanstack/react-query`) — `QueryClientProvider` lives in `app/providers.tsx`
- **Forms**: react-hook-form + Zod (`@hookform/resolvers`)
- **API**: Native `fetch` wrapper with Zod runtime validation (`lib/api-client.ts`); hooks call `apiClient` through TanStack Query
- **Theming**: `next-themes` (light / dark / system)
- **i18n**: homegrown, type-checked th/en messages (`i18n/`)
- **Notifications**: sonner toast + a promise-based dialog system
- **Tooling**: ESLint flat config, Prettier (with Tailwind plugin), lefthook, gitleaks, React Compiler
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
| `bun lint`      | `eslint . --fix`, then Prettier |
| `bun format`    | `prettier --write .`            |
| `bun test`      | Run the colocated `*.test.ts`   |

`lefthook` runs ESLint, Prettier and [gitleaks](https://github.com/gitleaks/gitleaks) on staged files at commit time, and `bun test` before push. Install gitleaks once (`brew install gitleaks`); `bun install` installs the hooks.

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
  services/             # xxx.service.ts, xxx.schema.ts (zod), xxx.keys.ts
  utils/                # xxx-format.ts, xxx-form.ts, xxx-constants.ts
  types.ts              # entity types

components/
  ui/                   # shadcn primitives (do not modify heavily)
  common/               # app-wide reusable components, theme provider, dialog root
  form-controls/        # RHF-bound inputs (FormInput, FormSelect, FormInputArea)

i18n/                   # locale, provider, messages/<x>.ts (th default, en)
stores/                 # Zustand stores (xxx.store.ts → useXxxStore)
hooks/                  # global hooks (use-dialog, ...)
lib/                    # api-client, api-error, env, format, utils
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

- Uses relative `/api/*` URLs only — the BFF proxy at `app/api/[...proxy]/route.ts` forwards them to `INTERNAL_API_URL` (server-only, validated by `lib/env.ts`), so the browser never speaks to the backend directly
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

Wrap services in feature hooks. Components call hooks, not services directly. All server state goes through TanStack Query — no `useEffect` + `useState` for fetch state.

Define stable, hierarchical query keys in a `<x>.keys.ts` file alongside the service:

```ts
// features/example/services/examples.keys.ts
export const examplesKeys = {
  all: ["examples"] as const,
  lists: () => [...examplesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...examplesKeys.lists(), filters] as const,
  details: () => [...examplesKeys.all, "detail"] as const,
  detail: (id: string) => [...examplesKeys.details(), id] as const,
};
```

Then wrap each service call in a `useQuery` (reads) or `useMutation` (writes):

```ts
// features/example/hooks/use-examples.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { examplesKeys } from "../services/examples.keys";
import { createExample, getExampleById, getExamples } from "../services/examples.service";
import type { TCreateExampleInput } from "../types";

export function useExamples() {
  return useQuery({
    queryKey: examplesKeys.list(),
    queryFn: () => getExamples(),
  });
}

export function useExample(id: string) {
  return useQuery({
    queryKey: examplesKeys.detail(id),
    queryFn: () => getExampleById(id),
    enabled: !!id,
  });
}

export function useCreateExample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateExampleInput) => createExample(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: examplesKeys.lists() });
    },
  });
}
```

Components consume the hook directly; loading/error/data come from TanStack:

```ts
const { data, isLoading, isError } = useExamples();
const { mutate: createExample, isPending } = useCreateExample();
```

After a mutation, invalidate the affected key prefix in `onSuccess` — TanStack will refetch any active queries that depend on it. Don't refetch manually.

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

import AppButton from "@/components/common/buttons/app-button";
import FormInput from "@/components/form-controls/form-input";
import { Form } from "@/components/ui/form";
import { useCreateExample } from "@/features/example/hooks/use-examples";
import { createExampleInputSchema } from "@/features/example/services/examples.schema";

type TFormValues = z.infer<typeof createExampleInputSchema>;

const ExampleForm = () => {
  const form = useForm<TFormValues>({
    resolver: zodResolver(createExampleInputSchema),
    defaultValues: { name: "", description: "" },
  });

  const { mutate: createExample, isPending } = useCreateExample();

  const handleSubmit = form.handleSubmit(values => createExample(values));

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInput required name="name" label="Name" />
        <FormInput required name="description" label="Description" />
        <AppButton type="submit" label="Save" disabled={isPending} />
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
    if (!ok) {
      return;
    }
    // proceed with deletion
  };

  const handleSuccess = () => {
    dialog.success({ title: "Done", message: "Saved successfully" });
  };
};
```

Variants: `alert`, `info`, `success`, `warning`, `error`, `confirm`, `confirmDelete`. The dialog root is mounted once in `app/layout.tsx` via `<AppDialogRoot />`.

## i18n

Every user-visible string is a message in `i18n/messages/<x>.ts`, defined once per locale with `defineMessages(en, th)`; the `th` object must match the `en` shape or `tsc` fails.

```tsx
const m = useMessages(exampleMessages); // client component
const m = await getMessages(homeMessages); // server component
```

The locale lives in the `locale` cookie (`th` by default) and is switched with `<LanguageToggle />`. `I18nProvider` loads only `common` and `nav`; feature bundles load with their routes. There is no locale in the URL; a public site that needs `/en/...` URLs for SEO should use `next-intl` instead.

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

| Variable           | Description                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `INTERNAL_API_URL` | Backend base URL. Server-only — read by the BFF proxy at `app/api/[...proxy]/route.ts`; the browser bundle never sees it. |

Validated at boot in `lib/env.ts` with Zod (`serverEnvSchema`). Add new server-only variables to that schema; a public (`NEXT_PUBLIC_*`) variable would need its own client schema — none exist today.
