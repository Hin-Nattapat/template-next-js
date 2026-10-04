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

| What               | Path                                                | Naming                                  |
| ------------------ | --------------------------------------------------- | --------------------------------------- |
| Route page         | `app/(group)/<route>/page.tsx`                      | thin re-export from feature             |
| Feature page       | `features/<x>/components/<x>-page.tsx`              | `const XPage`                           |
| Feature component  | `features/<x>/components/<x>-card.tsx`              | one per file; bucket per §2.1 when many |
| Feature hook       | `features/<x>/hooks/use-<x>.ts`                     | `useX`, returns `TUseXReturn`           |
| Service            | `features/<x>/services/<x>.service.ts`              | named function exports                  |
| Service schema     | `features/<x>/services/<x>.schema.ts`               | when zod schemas grow                   |
| Feature types      | `features/<x>/types.ts`                             | entities, inputs                        |
| Feature util       | `features/<x>/utils/<x>-{format,form,constants}.ts` | pure helpers (§2.2)                     |
| Zustand store      | `stores/<x>.store.ts`                               | `useXStore`, state type `TXState`       |
| Global hook        | `hooks/use-<x>.ts`                                  | only if cross-feature                   |
| Global type        | `types/global.ts`                                   | `IOption`, `IPaginatedResponse<T>`      |
| shadcn primitive   | `components/ui/`                                    | do not modify heavily                   |
| App-wide component | `components/common/`                                | wrap shadcn here when customising       |
| RHF-bound input    | `components/form-controls/`                         | uses `useFormContext`                   |
| API client         | `lib/api-client.ts`                                 | use everywhere, never raw `fetch`       |

Promote types up the hierarchy only when actually shared. Service-local types stay in the service file.

### 2.1 Sub-foldering `components/`

A flat `features/<x>/components/` is fine up to ~8 files. Past that, group by **UI role** into these standard sub-folders — file names stay descriptive (the folder is a second axis, not a replacement for good names):

| Sub-folder  | Holds                                                                                                                                                            |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages/`    | one component per route — `<x>-page.tsx`, `new-<x>-page.tsx`, `edit-<x>-page.tsx`                                                                                |
| `sections/` | composed page sections that aren't a form or table — filters, toolbars, empty states, and the steps of a multi-step flow (e.g. import uploader + preview + tabs) |
| `forms/`    | a form and its parts — `<x>-form.tsx`, `<x>-preview.tsx`, a field group                                                                                          |
| `tables/`   | a list/table view and its parts — `<x>-table.tsx`, `<x>-row-actions.tsx`, a cell/pill                                                                            |
| `dialogs/`  | modal / dialog components                                                                                                                                        |
| `shared/`   | a component reused by ≥2 of the above within this feature                                                                                                        |

Place a file by its **primary UI role**. A multi-step flow (e.g. import) is _distributed_ across these buckets — its page → `pages/`, its steps → `sections/` — never given its own folder; the vocabulary stays fixed. Add a sub-folder only once it earns ≥2 files; don't pre-create empty buckets. `hooks/`, `services/`, `utils/`, `types.ts` stay flat at the feature root.

### 2.2 `utils/` file roles

A feature's pure (no-React) helpers live in `utils/` under a fixed, common file set — never inline in a component, never a vague `helpers.ts`:

| File               | Holds                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------- |
| `<x>-format.ts`    | pure display formatters — value → display string (money, number, date, label)         |
| `<x>-form.ts`      | form ↔ API transforms (`toFormValues` / `toApiPayload`) and form-derived pure helpers |
| `<x>-constants.ts` | string enums (§7.4) and static option / lookup constant sets                          |

A formatter → `-format.ts`; a form transform → `-form.ts`; an enum or const set → `-constants.ts`. A cross-feature helper (e.g. a generic money formatter) goes in `lib/` (`lib/format.ts`), not a feature `utils/`. If a util fits none of these, it's mis-scoped — rethink it.

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

1. **Generic UI primitive (card, tooltip, accordion, switch, badge, …)? Check shadcn FIRST — never hand-roll one shadcn already ships.** This is a shadcn project (`components.json` is configured), and most primitives exist there even if not yet installed locally. How to see what's available (including not-yet-installed):
   - `bunx shadcn@latest add` — no args: interactive list of every component you can add.
   - Browse <https://ui.shadcn.com/docs/components> — the **`radix/*`** registry is the one this project uses.
   - Pull one in: `bunx shadcn@latest add <name>` — adds `components/ui/<name>.tsx` and installs its radix dep.

   Then **wrap it as an `App*`** (§3.6) and consume the wrapper. Only hand-write a primitive when shadcn genuinely doesn't have it.

2. Look in `components/common/` and `components/ui/` — is there one to reuse?
3. Look in sibling `features/*/components/` — is there one to **promote** into `components/common/`?
4. Only if all fail, write it inside the feature.

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

**Splitting a sub-component — and when NOT to.** Extract a child component only when at least one holds: (a) it's reused, (b) its JSX exceeds ~15 lines _and_ carries its own logic, or (c) it's an independent, nameable concept. A one-line declarative field (`<FormNumberInput … />`) is **not** a component — wrapping it is over-fragmentation. When it's _logic_ (not markup) bloating a component, extract a **feature hook** (`hooks/use-<x>-form.ts`) that holds the state/derived/effects/actions — not more components.

### 3.6 Shared primitives — App\* over shadcn

When `components/common/<x>/app-<x>.tsx` exists, **use it everywhere** — never import the underlying `components/ui/<x>` primitive directly from feature code. The wrapper is the seam for app-wide style additions; touching it once changes every call site.

Today the canonical wrappers are:

- `AppButton` (`components/common/buttons/app-button.tsx`) wraps shadcn `Button`
- `AppInput` (`components/common/inputs/app-input.tsx`) wraps shadcn `Input`
- `AppSelect` (`components/common/inputs/app-select.tsx`) wraps shadcn `Select` (with `IOption[]` API)
- `AppCombobox` (`components/common/inputs/app-combobox.tsx`) wraps shadcn `Command` + `Popover`
- `AppModal` (`components/common/dialogs/app-modal.tsx`) wraps shadcn `Dialog` (controlled `open`/`onOpenChange`, typed `title`/`description`/`children`/`footer` props)
- `AppTable` (`components/common/tables/app-table.tsx`) generic sortable/empty/loading table over shadcn `Table` — sortable headers render as real buttons (keyboard sortable); per-column `headerTooltip` adds a focusable ⓘ explainer
- `AppCard` (`components/common/cards/app-card.tsx`) wraps shadcn `Card` with `title`/`titleClassName`/`description`/`descriptionClassName`/`actions` slots — `title` renders the uppercase micro-label as a real `<h2>` (screen-reader navigable), `actions` sits right-aligned on the title row; `AppStatCard` (same folder) is the labelled-stat card on top of it
- `AppTooltip` (`components/common/overlays/app-tooltip.tsx`) wraps shadcn `Tooltip` (self-contained provider)
- `AppSwitch` (`components/common/inputs/app-switch.tsx`) labelled switch row — label wired to the switch by id (names it for AT, click-to-toggle)
- `AppSlider` (`components/common/inputs/app-slider.tsx`) labelled slider with optional `valueText` — names the thumb via `aria-label` (htmlFor can't target a Radix slider)
- `AppBadge` (`components/common/badges/app-badge.tsx`) the status pill (state / type / category labels) — tone classes come from the caller via `className`
- `AppFormLabel`, `AppDialogRoot`, … add as we promote primitives

**Rule of thumb:** if you're about to import from `components/ui/` in feature code, check `components/common/` first. If an App* wrapper exists, use it. If you need a new wrapper, add it under `components/common/` and consume the App* form from then on.

**Never drop to a raw HTML primitive** — `<button>`, `<input>`, `<select>`, `<table>`, `<dialog>`, etc. — in app/feature code (or inside an App\* component). Always go through the `App*` wrapper (`AppButton` / `AppInput` / `AppSelect` / `AppTable` / …), which itself sits on a shadcn primitive. Need a bare or unusual style (e.g. an inline icon trigger)? **Add a variant to the `ui/` cva** — e.g. `buttonVariants` gained `variant="unstyled"` + `size="fit"` for exactly that — never reach for a raw `<button>`. If neither a wrapper nor a shadcn component exists, create one (§3.3); don't inline a raw primitive as a shortcut.

#### AppButton API

| Form                                                                                | Use when                                                                                                                                                            |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<AppButton label="Save" />`                                                        | plain text                                                                                                                                                          |
| `<AppButton icon={Plus} label="Add" />`                                             | leading icon + text                                                                                                                                                 |
| `<AppButton icon={RefreshCw} iconClassName="animate-spin" label="Refreshing…" />`   | animated icon                                                                                                                                                       |
| `<AppButton asChild><Link href="/x">Go</Link></AppButton>`                          | `asChild` composition with another component                                                                                                                        |
| `<AppButton variant="ghost" size="icon" aria-label="Remove"><Trash2 /></AppButton>` | icon-only (label via `aria-label`)                                                                                                                                  |
| `<AppButton demoGated label="Save" />`                                              | mutating action: inert in demo mode (`aria-disabled` + "Disabled in demo" tooltip, click suppressed) — use on every button that writes data, including form submits |

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
import AppButton from "@/components/common/buttons/app-button";

import type { TThing } from "../types";

interface IProps {
  thing: TThing;
  onSelect?: (id: string) => void;
}

const ThingCard = (props: IProps) => {
  const { thing, onSelect } = props;

  return (
    <AppButton variant="ghost" label={thing.name} onClick={() => onSelect?.(thing.id)} />
  );
};

export default ThingCard;
```

For server components, mark the function `async` and call services directly. For client components, add `"use client"` at the top and consume hooks.

## 5. API client

`lib/api-client.ts` is the only allowed network entry point.

- Uses **relative `/api/*` URLs only** — the BFF proxy at `app/api/[...proxy]/route.ts` forwards them to `INTERNAL_API_URL` (server-only, validated by `lib/env.ts`); the browser bundle never sees the backend URL
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

- `toFormValues(response)` — server response → form's input shape (e.g. unwrap nullable strings to `""`, narrow the server type to the form's accepted subset).
- `toApiPayload(values, …deps)` — form values → request body (e.g. derive computed fields from other inputs; fill defaults from a selected related entity).

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
- Use the bound controls in `components/form-controls/` (FormInput, FormNumberInput, FormSelect, FormCombobox, FormInputArea) — they read `useFormContext` automatically
- Every control is wrapped in `<FormControl>` — it injects `id` / `aria-invalid` / `aria-describedby` (plus `aria-required` from the `required` prop) so labels and error messages wire to the input. A new form-control MUST keep that wrapper, or labels silently detach and the error ring never fires.
- Reuse the same Zod schema from `features/<x>/services/<x>.schema.ts` for both form validation and API response validation

## 7. State

- **TanStack Query** for server state. Reads go through `useQuery`, writes through `useMutation` with `onSuccess` invalidation of the affected key prefix — never `useEffect` + `useState` for fetch state, never manual refetch. Query keys come from a hierarchical factory in `features/<x>/services/<x>.keys.ts` (see `examples.keys.ts`).
- **Zustand** for client state. One store per concern (`cart.store.ts`, `auth.store.ts`).
- Export the hook as `useXStore`, type the state as `TXState`.
- Select narrow slices in components: `const items = useCartStore(s => s.items)`.
- **Global dialog**: `useDialog()` from `hooks/use-dialog.ts` — `alert`, `info`, `success`, `warning`, `error`, `confirm`, `confirmDelete`. Returns promises for confirm variants.
- **Toast**: `import { toast } from "sonner"`.

## 7.1 Derived data — the React Compiler memoizes

This template enables the React Compiler (`reactCompiler: true` in `next.config.ts`), which keeps derived arrays and objects referentially stable. Write derived values plainly: `const itemOptions = items.filter(...).map(...)`.

- Reach for `useMemo` / `useCallback` only for precise control — typically a value used as an `useEffect` dependency, so the effect doesn't fire every render.
- Never call `form.watch()`; read field values with `useWatch`. `watch` is incompatible with memoization and makes the compiler skip the component.
- In a project that turns the compiler off, wrap derived arrays and objects in `useMemo` even when cheap — children and libraries compare by identity.

If a constant doesn't depend on render state at all (e.g., `const TYPE_OPTIONS = [...]`), declare it at module scope rather than inside the component.

## 7.2 Render-time conditionals — extract before they nest

Heavy conditional logic in JSX (more than two ternaries deep, an IIFE-style `(() => { ... })()` block, or a chain of `&&`-guarded sub-expressions that span more than ~6 lines) is hard to scan and harder to debug. Extract before it grows.

- ❌ `<Btn>{isEdit ? (pending ? "Saving…" : "Save changes") : (pending ? "Recording…" : "Record")}</Btn>`
- ✅ A small pure function in the same file (or in `features/<x>/utils/`) called once: `<Btn>{submitLabel(isEdit, pending)}</Btn>`
- ❌ `const preview = (() => { ... 8 lines of derivation ... })();` followed by `{preview && <Box>...</Box>}`
- ✅ `const preview = toPreview(values)` (a pure function, in the file or `features/<x>/utils/`) followed by the same JSX guard.

The underlying rule: **JSX should read like presentation, not like logic.** Ternaries and `&&` are fine for one-line decisions; anything bigger goes into a named const or a pure function.

## 7.3 useEffect discipline

`useEffect` is for **synchronising with the outside world** (server state mutating into form state, subscribing to a non-React store, ResizeObservers, focus management, etc.). It is **not** a generic "re-run when X changes" hook. If your effect's body would be cleaner as a derived value or as an event handler, write it that way instead.

**Don't reach for `useEffect` for any of these — they have better tools:**

- ❌ Computing a value from props/state → a plain `const x = ...` (the React Compiler memoizes it).
- ❌ Reacting to a user click / change → put the logic in the event handler (`onClick`, `onChange`, RHF's `setValue` inside a `Select` callback, etc.).
- ❌ Resetting child state when a prop changes → lift state up, or use the `key` prop to remount.
- ❌ Toasts / navigation triggered by a successful mutation → put it in the mutation's `onSuccess`, not in an effect that watches `isSuccess`.

**Do reach for `useEffect` when:**

- ✅ A query result needs to land into form state once it loads (`form.reset(toFormValues(data))` after `useQuery` resolves — RHF defaults can't be async).
- ✅ Subscribing to a `window` event, a Zustand store outside the component, or an external system; remember the cleanup function.
- ✅ Imperative DOM work after layout (focusing an input, scroll-to-top on route change).
- ✅ One-shot setup that genuinely cannot live at render time.

When you do use `useEffect`, write the dependency array honestly (no lint suppressions), and add a one-line comment explaining _why_ an effect is the right tool — it should be obvious to the next reader that the alternatives don't fit.

## 7.4 No bare string-literal unions — use a TypeScript string enum

Anywhere you'd otherwise write a hand-typed string-literal union for a
finite set of states (`"list" | "grid"`, `"asc" | "desc"`,
`"light" | "dark"`, etc.), declare a TypeScript **string enum** in the
feature's `<x>-constants.ts` (§2.2) and reference its
members at every call site. Never type the literal string directly
inside components, comparisons, or hook generics.

```ts
// features/projects/utils/project-constants.ts
export enum ViewMode {
  List = "list",
  Grid = "grid",
}

// component
const [mode, setMode] = useState<ViewMode>(ViewMode.List);
if (mode === ViewMode.Grid) { ... }
```

- ❌ `useState<"list" | "grid">("list")`
- ❌ `if (mode === "list") { ... }` — magic string scattered across files
- ✅ `useState<ViewMode>(ViewMode.List)` + `if (mode === ViewMode.List)`
- ❌ `options={[{ value: "google", label: "Google" }, …]}` — option `value`s are bare strings
- ✅ `[{ value: AuthProvider.Google, label: "Google" }, …]` — every option `value` is an enum member; the enum is the single source of the value set, the array only pairs each value with a label

A finite value set that's shared across features (e.g. `status`, `role`, auth `provider`) gets **one** enum in the domain's home module (`features/<domain>/types.ts`), imported everywhere — never re-declared per feature.

Why:

- Members are first-class identifiers — IDE jump-to-definition, rename,
  and find-references all work out of the box.
- Typos surface immediately (`ViewMode.Lsit` is a compile error; the
  bare `"lsit"` would silently typecheck against `string` until runtime).
- Comparison sites read like enums in any other language — no need to
  re-derive intent from a quoted literal.

Notes:

- Use **string-valued** enums (`Amount = "amount"`) only. Numeric enums
  drift between Go/JSON and JS, so avoid them.
- String enums don't generate a reverse-mapping, so tree-shaking still
  works.

## 7.5 Component body order

Declare a component's body in fixed sections, in this order — **never interleaved** (don't drop a `useState` between two `useMemo`s, or a handler between two hooks):

1. **props + locals** — destructure props; trivial constants (`isEdit`, `today`).
2. **hooks** — every hook call, grouped, in this sub-order: `useRef` → `useRouter` (navigation) → `useForm` → data/query + other custom hooks (`useX`). Exception: when one hook seeds another (e.g. a query whose data feeds `useForm`'s `defaultValues`), the producer comes first — dependency wins over this default order.
3. **state** — `useState`.
4. **derived** — `useMemo` / computed values (§7.1).
5. **effects** — `useEffect` (§7.3).
6. **actions** — event handlers, `handleSubmit`.
7. **guards** — early returns (loading / empty / error).
8. **return** — JSX.

When sections 3–6 accumulate many entries, that's the signal to lift sections 2–6 into a feature hook (`hooks/use-<x>-form.ts`) that returns a tidy view object — the component is then just its hook(s) → guards → JSX (§3.5). The same section order applies _inside_ that hook (minus the JSX return).

## 7.6 Prop values stay flat — extract JSX trees and object literals

A JSX prop should receive a _reference_, not an inline construction. Two smells, both fixed the same way — pull the value out above the `return` (or into the `.map()` callback, or its own component). **If a prop value spans more than one line in the JSX, it belongs in a `const` or a component.**

**Inline element trees.** A prop whose value is JSX deeper than a single element with one or two children → give it its own component (preferred) or a local `const node`. A lone wrapper element inline is fine; a tree is not.

- ❌ `title={<span className="inline-flex …"><span className="…badge…"><Layers/></span>Add item</span>}`
- ✅ `title={<AppModalTitle icon={Layers} title="Add item" />}` — the tree lives in its own component; the prop is one tag.

**Inline object / array literals.** Never build an object or array literal inline in a prop — especially behind a ternary. Construct it as a named `const` first. Inline literals read as noise and hand the child a fresh reference every render (see §7.1).

- ❌ `item={p ? { id: p.id, name: p.name, status: p.status } : undefined}`
- ✅ `const selectedItem = p ? { id: p.id, … } : undefined;` then `item={selectedItem}`.

Props are for wiring, not for building.

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
- ❌ Code comments explaining `what` the code does, section-divider/ceremony comments, or stale comments that no longer match the code — comment `why` when non-obvious, keep it concise, and delete a comment before it can lie
- ❌ Comments narrating an **obvious** `why` — if the intent is already readable from the values and the immediate context, the comment is noise. A `className="rounded-none border-0 bg-transparent"` on a table that sits inside a card needs no `{/* Frameless: the card provides the surface */}` narration. The bar for a comment is _non-obvious_ why only: an invariant the types can't express, a workaround (+ its removal condition), or a decision that contradicts what a reader would expect.
- ❌ Hand-spacing JSX with `{" "}`, nesting `<Fragment>`s to interleave text with inline `<span>`s, or bare floating text / string concatenation — compose text as a single `{`…`}` template literal (in a pure helper when there's logic); use layout (flex/`gap`) for real spacing
- ❌ Inline `options={[…]}` (or any finite literal set) with bare strings — hoist to a module-level `const` and back the values with a string enum (§7.1 + §7.4)
- ❌ Re-exporting types via stub files just to keep imports tidy
- ❌ JSX fragment shorthand `<>…</>` — use `<Fragment>…</Fragment>` (imported from `react`): survives codemods/auto-imports, greps cleanly, and allows `key=` on lists without a rewrite

> The dedicated sections are the source of truth — don't restate their rules here: **§5.1** request/response transforms, **§7.1** derived data, **§7.2** render-time conditionals, **§7.3** `useEffect`, **§7.4** string enums, **§7.5** component body order.

## 10. Commits

Conventional Commits, simplified prefixes:

`init` · `feat` · `fix` · `refactor` · `chore` · `docs` · `style` · `test`

- Imperative present tense (`add`, `fix`, `implement`)
- One logical change per commit
- Subject ≤ 90 chars; details in body if needed

## 11. References

- **Living example feature:** [`features/example/`](../features/example) — full pattern (types, schema, service, hook, components)
- **Setup, scripts, env vars, replace-feature workflow:** [`README.md`](../README.md)
