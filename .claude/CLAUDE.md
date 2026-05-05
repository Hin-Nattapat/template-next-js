# CLAUDE.md

Rules for AI agents working in this codebase. Read in full before any code change.
Setup, scripts, stack details: see [`README.md`](../README.md).

## 1. Critical rules (non-negotiable)

1. **kebab-case** for every file and folder name. PascalCase is only for component identifiers inside files.
2. **One component per file.** No inline sub-components, no helper components defined inside another component.
3. **Component declaration:** `const Component = (props: IProps) => { ... }` then `export default Component` at the bottom. Never `export default function`.
4. **Destructure props inside the function body**, never in the parameter signature.
5. **Type prefixes:** `interface I*` for object/prop shapes, `type T*` for unions, generics, entities, response types.
6. **Layer separation:** UI in `components/`, logic in feature hooks, network calls in services. Route files stay thin (one-line re-export of a feature component).

## 2. Where things go

| What               | Path                                   | Naming                             |
| ------------------ | -------------------------------------- | ---------------------------------- |
| Route page         | `app/(group)/<route>/page.tsx`         | thin re-export from feature        |
| Feature page       | `features/<x>/components/<x>-page.tsx` | `const XPage`                      |
| Feature component  | `features/<x>/components/<x>-card.tsx` | one component per file             |
| Feature hook       | `features/<x>/hooks/use-<x>.ts`        | `useX`, returns `TUseXReturn`      |
| Service            | `features/<x>/services/<x>.service.ts` | named function exports             |
| Service schema     | `features/<x>/services/<x>.schema.ts`  | when zod schemas grow              |
| Feature types      | `features/<x>/types.ts`                | entities, inputs                   |
| Feature util       | `features/<x>/utils/<x>-format.ts`     | pure helpers                       |
| Zustand store      | `stores/<x>.store.ts`                  | `useXStore`, state type `TXState`  |
| Global hook        | `hooks/use-<x>.ts`                     | only if cross-feature              |
| Global type        | `types/global.ts`                      | `IOption`, `IPaginatedResponse<T>` |
| shadcn primitive   | `components/ui/`                       | do not modify heavily              |
| App-wide component | `components/common/`                   | wrap shadcn here when customising  |
| RHF-bound input    | `components/form-controls/`            | uses `useFormContext`              |
| API client         | `lib/api-client.ts`                    | use everywhere, never raw `fetch`  |

Promote types up the hierarchy only when actually shared. Service-local types stay in the service file.

## 3. Component template

```tsx
import type { TThing } from "../types";

interface IProps {
  thing: TThing;
  onSelect?: (id: string) => void;
}

const ThingCard = (props: IProps) => {
  const { thing, onSelect } = props;

  return <button onClick={() => onSelect?.(thing.id)}>{thing.name}</button>;
};

export default ThingCard;
```

For server components, mark the function `async` and call services directly. For client components, add `"use client"` at the top and consume hooks.

## 4. API client

`lib/api-client.ts` is the only allowed network entry point.

- Throws `ApiError(status, message, body)` from `lib/api-error.ts` on non-2xx
- Validates response with optional Zod schema (3rd arg)
- Forwards Next.js fetch options: `cache`, `next.revalidate`, `next.tags` (RSC caching)

Services expose **named functions**, not an object:

```ts
import { apiClient } from "@/lib/api-client";

import { thingSchema, thingsResponseSchema, type TThingsResponse } from "./things.schema";

export function getThings(): Promise<TThingsResponse> {
  return apiClient.get("/things", undefined, thingsResponseSchema);
}

export function getThingById(id: string) {
  return apiClient.get(`/things/${id}`, undefined, thingSchema);
}
```

When a service has many shapes or its schemas need to be reused (forms, server actions), split them into a sibling `xxx.schema.ts`. Re-export `T*` types from the schema via `z.infer<typeof schema>`.

## 5. Forms

- `react-hook-form` + `zodResolver(schema)` from `@hookform/resolvers/zod`
- Wrap inputs in `<Form {...form}>` from `components/ui/form`
- Use the bound controls in `components/form-controls/` (FormInput, FormSelect, FormInputArea) — they read `useFormContext` automatically
- Reuse the same Zod schema from `features/<x>/services/<x>.schema.ts` for both form validation and API response validation

## 6. State

- **Zustand** for client state. One store per concern (`cart.store.ts`, `auth.store.ts`).
- Export the hook as `useXStore`, type the state as `TXState`.
- Select narrow slices in components: `const items = useCartStore(s => s.items)`.
- **Global dialog**: `useDialog()` from `hooks/use-dialog.ts` — `alert`, `info`, `success`, `warning`, `error`, `confirm`, `confirmDelete`. Returns promises for confirm variants.
- **Toast**: `import { toast } from "sonner"`.

## 7. Styling

- Tailwind v4 utilities first. Use `cn()` from `@/lib/utils` for conditional classes.
- Theme tokens are CSS variables (`--background`, `--primary`, `--destructive`, ...). Use the matching Tailwind classes (`bg-background`, `text-foreground`).
- Dark mode is wired via `next-themes` in `components/common/theme-provider.tsx`. Toggle by setting `class="dark"` on `<html>` (or via the provider's API).
- Do not add custom utility classes that duplicate Tailwind. Custom CSS only for things Tailwind cannot express.

## 8. Anti-patterns (do not do)

- ❌ `export default function Component({ x }: IProps)` — use the const + destructure-in-body pattern
- ❌ Two components in one file
- ❌ Defining a component inside another component
- ❌ Direct `fetch(...)` — go through `apiClient`
- ❌ Logic, data fetching, or state in `app/.../page.tsx` — push it into a feature hook
- ❌ Object-export services (`export const thingsService = { ... }`) — use named function exports
- ❌ Editing shadcn primitives in `components/ui/` — wrap them in `components/common/` instead
- ❌ Dumping service-specific types into `types/global.ts`
- ❌ Using `any`. Prefer `unknown` + a type guard, or define the proper type.
- ❌ Console comments explaining `what` the code does — only comment `why` when non-obvious
- ❌ Re-exporting types via stub files just to keep imports tidy

## 9. Commits

Conventional Commits, simplified prefixes:

`init` · `feat` · `fix` · `refactor` · `chore` · `docs` · `style` · `test`

- Imperative present tense (`add`, `fix`, `implement`)
- One logical change per commit
- Subject ≤ 90 chars; details in body if needed

## 10. References

- **Living example feature:** [`features/example/`](../features/example) — full pattern (types, schema, service, hook, components)
- **Setup, scripts, env vars, replace-feature workflow:** [`README.md`](../README.md)
