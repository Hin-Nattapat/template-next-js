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

## 3. Component composition philosophy

The point of layering is that **pages stay clean and components stay small**. A page (or any file) that is mostly a long `<div>` of Tailwind classes is a smell — break it into named sections that read like a table of contents.

### 3.1 Page files = handlers + composition only

A route file (`app/(group)/<route>/page.tsx`) is a one-line re-export of a feature page. The feature page (`features/<x>/components/<x>-page.tsx`) may contain only:

- top-level **section composition** (`<XHero />`, `<XFilters />`, `<XList />`, `<XActions />`)
- **handler/action functions** (`onSubmit`, `onSelect`, `onCreate`) that wire feature hooks to child components
- minimal glue — destructure values from one or two hooks and forward them as props

It must **not** contain:

- long Tailwind `<div>` walls → extract a section component
- inline business logic (API calls, derivations, validation) → push into a feature hook or service
- repeated markup blocks → extract a reusable component

### 3.2 Split by concept, name like a table of contents

Inside `features/<x>/components/`, split a page into **concept sections**. A reader should know what a component does from its name alone — no need to open the file.

Naming examples (replace `x` with the feature name):

- `<x>-hero.tsx`, `<x>-summary.tsx`, `<x>-filters.tsx`, `<x>-toolbar.tsx`
- `<x>-list.tsx` (container) + `<x>-list-item.tsx` (row), `<x>-empty-state.tsx`
- `<x>-detail.tsx`, `<x>-actions.tsx`, `<x>-form.tsx`

Layout-only wrappers (no business meaning) belong in `components/common/` if app-wide, or in `features/<x>/components/` with a layout suffix (`<x>-section.tsx`, `<x>-card-grid.tsx`).

### 3.3 Reuse before you write

Before writing any new component:

1. Look in `components/common/` and `components/ui/` — is there one to reuse?
2. Look in sibling `features/*/components/` — is there one to **promote** into `components/common/`?
3. Only if both fail, write it inside the feature.

The third copy of any markup must be an extraction. Don't wait for the fifth.

### 3.4 Flexibility via props + className, not flag soup

Reusable components must:

- declare a small, well-typed `IProps` interface (no `any`, no spread of arbitrary HTML attributes unless wrapping a primitive)
- accept `className?: string` and merge with `cn()` from `@/lib/utils` so consumers can adjust spacing/colour without forking
- accept render slots (`children`, `actions`, `header`, `footer`) for shape variation — **composition beats boolean flags**

`isPrimary`, `hasIcon`, `withFooter`, `variant="big"` are smells. Each new flag doubles the branches the component must handle. Prefer slots and `className`.

```tsx
interface IProps {
  title: string;
  className?: string;
  actions?: React.ReactNode;
}

const SectionHeader = (props: IProps) => {
  const { title, className, actions } = props;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {actions}
    </div>
  );
};

export default SectionHeader;
```

### 3.5 When to refactor

Refactor as part of the task — not a follow-up PR. Triggers:

- File > ~150 lines, or JSX block > ~80 lines.
- The component name no longer describes what the JSX renders.
- A `<div>` carries > ~6 Tailwind classes that recur elsewhere — extract.
- Two unrelated `useState`/`useEffect` pairs in one component — split into hooks.
- A prop list grows past ~5 booleans — redesign with slots/composition.

### 3.6 Shared primitives — App* over shadcn

When `components/common/<x>/app-<x>.tsx` exists, **use it everywhere** — never import the underlying `components/ui/<x>` primitive directly from feature code. The wrapper is the seam for app-wide style additions; touching it once changes every call site.

Today the canonical wrappers are:

- `AppButton` (`components/common/buttons/app-button.tsx`) wraps shadcn `Button`
- `AppInput` (`components/common/inputs/app-input.tsx`) wraps shadcn `Input`
- `AppSelect` (`components/common/inputs/app-select.tsx`) wraps shadcn `Select` (with `IOption[]` API)
- `AppCombobox` (`components/common/inputs/app-combobox.tsx`) wraps shadcn `Command` + `Popover`
- `AppModal` (`components/common/dialogs/app-modal.tsx`) wraps shadcn `Dialog` (controlled `open`/`onOpenChange`, typed `title`/`description`/`children`/`footer` props)
- `AppTable` (`components/common/tables/app-table.tsx`) generic sortable/empty/loading table over shadcn `Table`
- `AppFormLabel`, `AppDialogRoot`, … add as we promote primitives

**Rule of thumb:** if you're about to import from `components/ui/` in feature code, check `components/common/` first. If an App* wrapper exists, use it. If you need a new wrapper, add it under `components/common/` and consume the App* form from then on.

#### AppButton API

| Form | Use when |
| --- | --- |
| `<AppButton label="Save" />` | plain text |
| `<AppButton icon={Plus} label="Add" />` | leading icon + text |
| `<AppButton icon={RefreshCw} iconClassName="animate-spin" label="Refreshing…" />` | animated icon |
| `<AppButton asChild><Link href="/x">Go</Link></AppButton>` | `asChild` composition with another component |
| `<AppButton variant="ghost" size="icon" aria-label="Remove"><Trash2 /></AppButton>` | icon-only (label via `aria-label`) |

Pass-throughs (`variant`, `size`, `asChild`, `className`, `disabled`, `type`, `onClick`, …) flow straight to shadcn `Button`.

#### Why label/icon over children?

- ❌ `<AppButton><Plus className="mr-1 h-4 w-4" />Add</AppButton>` — every caller re-decides icon size + spacing, drifts over time.
- ✅ `<AppButton icon={Plus} label="Add" />` — typed, mechanically consistent, half the JSX.
- Keep `children` for the cases where you legitimately need composition (`asChild`, conditional sub-trees, custom layouts).

#### Adding a new style

1. Need a new visual variant globally? Edit `components/ui/button.tsx::buttonVariants` (the cva config) — `<AppButton variant="…">` immediately exposes it.
2. Need an app-only behaviour (icon spacing, loading slot, etc.)? Edit `components/common/buttons/app-button.tsx`.
3. Don't fork shadcn primitives in `components/ui/*` for app-specific tweaks — wrap.

## 4. Component template

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

## 5. API client

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

## 5.1 Request / response transforms — `features/<x>/utils/`, not inline

When the wire shape doesn't quite match the form / UI shape, write a small named function in `features/<x>/utils/<x>-form.ts` (or similar) and call it at the boundary. Never inline the shape gymnastics in handlers, components, or services.

Symmetric pair convention:

- `toFormValues(response)` — server response → form's input shape (e.g., collapse `WITHDRAW` → `DEPOSIT`, unwrap nullable strings to `undefined`).
- `toApiPayload(values, …deps)` — form values → request body (e.g., for DEPOSIT, override `asset_id` to the cash asset, drop `cash_asset_id`/`price`, lock currency/`fx_rate`).

What you avoid by extracting:

- ❌ Inline ternary spreads in submit handlers — `values.type === "X" ? { ...values, foo: bar } : values`. Hard to scan, hard to test, prone to drift between create and edit paths.
- ❌ Per-type field branches in services — services should accept the already-normalised payload.

What you get:

- ✅ One pure function per direction. Easily unit-testable (no React, no fetch).
- ✅ `handleSubmit` reads as a sequence: `validate → toApiPayload → mutate`.
- ✅ Edit + create flows stay aligned because they share the same transform.

## 6. Forms

- `react-hook-form` + `zodResolver(schema)` from `@hookform/resolvers/zod`
- Wrap inputs in `<Form {...form}>` from `components/ui/form`
- Use the bound controls in `components/form-controls/` (FormInput, FormSelect, FormInputArea) — they read `useFormContext` automatically
- Reuse the same Zod schema from `features/<x>/services/<x>.schema.ts` for both form validation and API response validation

## 7. State

- **Zustand** for client state. One store per concern (`cart.store.ts`, `auth.store.ts`).
- Export the hook as `useXStore`, type the state as `TXState`.
- Select narrow slices in components: `const items = useCartStore(s => s.items)`.
- **Global dialog**: `useDialog()` from `hooks/use-dialog.ts` — `alert`, `info`, `success`, `warning`, `error`, `confirm`, `confirmDelete`. Returns promises for confirm variants.
- **Toast**: `import { toast } from "sonner"`.

## 7.1 Derived data — `useMemo` or extract

Anything you derive from a query result, props, or another hook (filter, map, find, sort, group) must be either a module-level `const` (if the inputs never change) or wrapped in `useMemo` keyed on its inputs.

- ❌ `<Select options={items.filter(...).map(...)} />` — recreates the array every render and forces downstream memo bailouts.
- ✅ `const itemOptions = useMemo(() => items.filter(...).map(...), [items])` then `<Select options={itemOptions} />`.
- Use `useMemo` even when the computation is cheap, because the *array identity* is the load-bearing thing — child components / TanStack Query / form libraries reference-compare it.

If a constant doesn't depend on render state at all (e.g., `const TYPE_OPTIONS = [...]`), declare it at module scope rather than inside the component.

## 7.2 Render-time conditionals — extract before they nest

Heavy conditional logic in JSX (more than two ternaries deep, an IIFE-style `(() => { ... })()` block, or a chain of `&&`-guarded sub-expressions that span more than ~6 lines) is hard to scan and harder to debug. Extract before it grows.

- ❌ `<Btn>{isEdit ? (pending ? "Saving…" : "Save changes") : (pending ? "Recording…" : "Record")}</Btn>`
- ✅ A small pure function in the same file (or in `features/<x>/utils/`) called once: `<Btn>{submitLabel(isEdit, pending)}</Btn>`
- ❌ `const preview = (() => { ... 8 lines of derivation ... })();` followed by `{preview && <Box>...</Box>}`
- ✅ `const preview = useMemo(() => { ... }, [deps])` followed by the same JSX guard. (Or, if the derivation reads no React state, hoist to a module-level pure function and call it at render.)

The underlying rule: **JSX should read like presentation, not like logic.** Ternaries and `&&` are fine for one-line decisions; anything bigger goes into a named const, useMemo, or a pure function.

## 7.3 useEffect discipline

`useEffect` is for **synchronising with the outside world** (server state mutating into form state, subscribing to a non-React store, ResizeObservers, focus management, etc.). It is **not** a generic "re-run when X changes" hook. If your effect's body would be cleaner as a derived value or as an event handler, write it that way instead.

**Don't reach for `useEffect` for any of these — they have better tools:**

- ❌ Computing a value from props/state → `const x = ...` or `useMemo(() => ..., [...])`.
- ❌ Reacting to a user click / change → put the logic in the event handler (`onClick`, `onChange`, RHF's `setValue` inside a `Select` callback, etc.).
- ❌ Resetting child state when a prop changes → lift state up, or use the `key` prop to remount.
- ❌ Toasts / navigation triggered by a successful mutation → put it in the mutation's `onSuccess`, not in an effect that watches `isSuccess`.

**Do reach for `useEffect` when:**

- ✅ A query result needs to land into form state once it loads (`form.reset(toFormValues(data))` after `useQuery` resolves — RHF defaults can't be async).
- ✅ Subscribing to a `window` event, a Zustand store outside the component, or an external system; remember the cleanup function.
- ✅ Imperative DOM work after layout (focusing an input, scroll-to-top on route change).
- ✅ One-shot setup that genuinely cannot live at render time.

When you do use `useEffect`, write the dependency array honestly (no lint suppressions), and add a one-line comment explaining *why* an effect is the right tool — it should be obvious to the next reader that the alternatives don't fit.

## 7.4 No bare string-literal unions — use a TypeScript string enum

Anywhere you'd otherwise write a hand-typed string-literal union for a
finite set of states (`"amount" | "quantity"`, `"native" | "base"`,
`"asc" | "desc"`, etc.), declare a TypeScript **string enum** in the
feature's `utils/` (or `types.ts` if cross-component) and reference its
members at every call site. Never type the literal string directly
inside components, comparisons, or hook generics.

```ts
// features/transactions/utils/transaction-form.ts
export enum TxnMode {
  Amount = "amount",
  Quantity = "quantity",
}

// component
const [mode, setMode] = useState<TxnMode>(TxnMode.Amount);
if (mode === TxnMode.Quantity) { ... }
```

- ❌ `useState<"amount" | "quantity">("amount")`
- ❌ `if (mode === "amount") { ... }` — magic string scattered across files
- ✅ `useState<TxnMode>(TxnMode.Amount)` + `if (mode === TxnMode.Amount)`

Why:

- Members are first-class identifiers — IDE jump-to-definition, rename,
  and find-references all work out of the box.
- Typos surface immediately (`TxnMode.Amout` is a compile error; the
  bare `"amout"` would silently typecheck against `string` until runtime).
- Comparison sites read like enums in any other language — no need to
  re-derive intent from a quoted literal.

Notes:

- Use **string-valued** enums (`Amount = "amount"`) only. Numeric enums
  drift between Go/JSON and JS, so avoid them.
- String enums don't generate a reverse-mapping, so tree-shaking still
  works.
- A small amount of legacy code uses the older `const X = { ... } as const`
  pattern (e.g., `TXN_MODE`). It can stay as-is; migrate to a `enum X`
  when you next touch that file.

## 8. Styling

- Tailwind v4 utilities first. Use `cn()` from `@/lib/utils` for conditional classes.
- Theme tokens are CSS variables (`--background`, `--primary`, `--destructive`, ...). Use the matching Tailwind classes (`bg-background`, `text-foreground`).
- Dark mode is wired via `next-themes` in `components/common/theme-provider.tsx`. Toggle by setting `class="dark"` on `<html>` (or via the provider's API).
- Do not add custom utility classes that duplicate Tailwind. Custom CSS only for things Tailwind cannot express.

## 9. Anti-patterns (do not do)

- ❌ `export default function Component({ x }: IProps)` — use the const + destructure-in-body pattern
- ❌ Two components in one file
- ❌ Defining a component inside another component
- ❌ Direct `fetch(...)` — go through `apiClient`
- ❌ Logic, data fetching, or state in `app/.../page.tsx` — push it into a feature hook
- ❌ Page or feature-page files containing long Tailwind `<div>` walls — split into named section components
- ❌ Components without a `className?: string` prop — kills layout flexibility for callers
- ❌ Boolean prop flags (`isPrimary`, `withIcon`, `hasFooter`) — use composition slots (`children`, `actions`, `header`)
- ❌ Copy-pasting markup a third time — extract a reusable component instead
- ❌ Object-export services (`export const thingsService = { ... }`) — use named function exports
- ❌ Editing shadcn primitives in `components/ui/` for app-specific tweaks — wrap them in `components/common/` instead
- ❌ Importing shadcn `Button` (or any other primitive that has an `App*` wrapper) directly from feature code — use the wrapper (e.g. `AppButton`); see §3.6
- ❌ `<AppButton>plain text</AppButton>` or `<AppButton><Icon />text</AppButton>` — use the typed `label` / `icon` / `iconClassName` props; reserve `children` for `asChild` + composition cases (§3.6)
- ❌ Dumping service-specific types into `types/global.ts`
- ❌ Using `any`. Prefer `unknown` + a type guard, or define the proper type.
- ❌ Console comments explaining `what` the code does — only comment `why` when non-obvious
- ❌ Re-exporting types via stub files just to keep imports tidy
- ❌ Inline `data.filter(...).map(...)` (or any derived array) passed to a child component or hook — wrap in `useMemo` or extract a module-level const (see §7.1)
- ❌ Nested ternaries, `(() => {...})()` IIFEs, or 6+ line `&&` chains inside JSX — extract a `useMemo` or a small pure function (see §7.2)
- ❌ `useEffect` to compute derived values, sync child state to a prop, or react to user events — use a const / `useMemo` / event handler instead (see §7.3)
- ❌ Inline `values.type === "X" ? { ...values, ... } : values` in a submit handler — extract a `toApiPayload` (or per-direction transform) into `features/<x>/utils/` (see §5.1)
- ❌ JSX fragment shorthand `<>…</>` — use `<Fragment>…</Fragment>` (imported from `react`). Reasons: explicit `Fragment` survives codemods/auto-imports, plays nicer with grep/IDE refactors, and consistently allows `key=` on lists without rewriting later.
- ❌ Bare string-literal unions (`"a" | "b"`) for finite state sets — declare a TypeScript string enum and reference its members; see §7.4.

## 10. Commits

Conventional Commits, simplified prefixes:

`init` · `feat` · `fix` · `refactor` · `chore` · `docs` · `style` · `test`

- Imperative present tense (`add`, `fix`, `implement`)
- One logical change per commit
- Subject ≤ 90 chars; details in body if needed

## 11. References

- **Living example feature:** [`features/example/`](../features/example) — full pattern (types, schema, service, hook, components)
- **Setup, scripts, env vars, replace-feature workflow:** [`README.md`](../README.md)
