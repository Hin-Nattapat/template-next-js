# Next.js style

Personal frontend style for every Next.js app (App Router, React 19, TypeScript strict, Tailwind v4, shadcn). It was merged from the rule sheets of klang-web, oobi-web, brew-hub-web and this template, then settled one decision at a time on 2026-10-04.

- **Linter first.** Anything ESLint, Prettier or `tsc` can check lives in config, not here. §17 lists what tooling already covers.
- **New and touched code only.** Never sweep untouched files to match this guide. When you edit a component, bring that component in line.
- **The plan wins for task-specific choices.** This file holds the defaults that apply to every project.
- `.claude/CLAUDE.md` is the agent rule sheet for this template; this file is the human-readable reference behind it.

---

## 1. Principles

**Simple over clever.** If a reviewer has to decode it, simplify it.

**Two concrete cases before an abstraction.** No shared component, hook, prop or option exists until a second real caller needs it. Extract duplicated markup at the third copy at the latest.

**Server Components by default.** Add `"use client"` only for hooks, event handlers, browser APIs or Zustand.

**Hand-write the frontend.** Mockups from design tools are visual reference only; never paste their markup in wholesale.

---

## 2. Layout

### Folder map

```
app/                         routes only: thin page files, layouts, route groups
  (public)/ (app)/ ...       route groups
  api/[...proxy]/route.ts    BFF proxy to the backend
  error.tsx loading.tsx not-found.tsx
features/<x>/
  components/                <x>-page.tsx + sections (sub-foldered past ~8 files)
  hooks/                     use-<x>.ts
  services/                  <x>.service.ts, <x>.schema.ts, <x>.keys.ts
  utils/                     <x>-format.ts, <x>-form.ts, <x>-constants.ts
  types.ts
components/
  ui/                        shadcn primitives: don't modify for app tweaks
  common/                    App* wrappers and app-wide components
  form-controls/             RHF-bound inputs (useFormContext)
hooks/                       cross-feature hooks only
stores/                      Zustand: <x>.store.ts, app-wide state only
i18n/                        locale, provider, messages/<x>.ts
lib/                         api-client.ts, api-error.ts, env.ts, format.ts, utils.ts
types/global.ts              truly shared types (IOption, IPaginatedResponse<T>)
```

### Placement

| What          | Path                                   | Naming                               |
| ------------- | -------------------------------------- | ------------------------------------ |
| Feature page  | `features/<x>/components/<x>-page.tsx` | `const XPage`                        |
| Feature hook  | `features/<x>/hooks/use-<x>.ts`        | `useX` → `TUseXReturn`               |
| Service       | `features/<x>/services/<x>.service.ts` | named function exports               |
| Schema        | `features/<x>/services/<x>.schema.ts`  | once schemas grow                    |
| Query keys    | `features/<x>/services/<x>.keys.ts`    | `<x>Keys` factory                    |
| Feature types | `features/<x>/types.ts`                | entities, inputs                     |
| Messages      | `i18n/messages/<x>.ts`                 | `xMessages = defineMessages(en, th)` |
| Store         | `stores/<x>.store.ts`                  | `useXStore`, `TXState`               |

**Promote types up only when they are actually shared.** Service-local types stay in the service file; never dump them into `types/global.ts`.

### Route files are thin

```tsx
// app/(app)/insights/page.tsx
import InsightsPage from "@/features/insights/components/insights-page";

const Page = () => <InsightsPage />;

export default Page;
```

No logic, fetching or state in `app/**/page.tsx`. Dynamic routes are the one exception to body-destructuring: they `await params` and pass the values down.

### Sub-folders and utils

- Past ~8 files, sub-folder `features/<x>/components/` by UI role: `pages/`, `sections/`, `forms/`, `tables/`, `dialogs/`, `shared/` (used by two or more of the others). Create a sub-folder only once it has two files. A multi-step flow spreads across the buckets; it never gets its own folder. `hooks/`, `services/`, `utils/` and `types.ts` stay flat.
- `utils/` has fixed file roles: `<x>-format.ts` turns a value into display text, `<x>-form.ts` holds form↔API transforms, and `<x>-constants.ts` holds enums and static option sets. Never a vague `helpers.ts`; a util that fits none of these is in the wrong place.
- Generic formatters (money, number, percent, date) live in `lib/format.ts`. Check it before writing another `Intl` wrapper.

### New features

Copy `features/example/` and rename it. Build in this order: `types.ts` → `<x>.schema.ts` → `<x>.service.ts` → `<x>.keys.ts` → `hooks/use-<x>.ts` → components → route.

---

## 3. Components

### Shape

**One component per file.** Never define a component inside another.

**Declare as a const arrow, default-export at the bottom:**

```tsx
// ✅
const ThingCard = (props: IProps) => {
  const { thing, onSelect } = props;
  return <AppButton variant="ghost" label={thing.name} onClick={() => onSelect(thing.id)} />;
};

export default ThingCard;

// ❌
export default function ThingCard({ thing }: IProps) { … }
```

Hooks and services are the opposite: named `export function` declarations.

**Server components are `async` and call services directly. Client components consume hooks:**

```tsx
const ExamplesPage = async () => {
  const data = await getExamples();
  return <ExamplesList items={data.items} />;
};
export default ExamplesPage;
```

### Body order

Sections are never interleaved:

1. props + trivial locals
2. hooks: `useRef` → `useRouter` → `useForm` → query/custom hooks (a hook that seeds another goes first)
3. `useState`
4. derived values
5. `useEffect`
6. handlers
7. guards (early returns for loading, empty, error)
8. `return` JSX

```tsx
const TxnForm = (props: IProps) => {
  const { txn } = props;                                // 1
  const isEdit = !!txn;

  const router = useRouter();                           // 2
  const form = useForm<TFormValues>({ … });
  const { data: assets, isLoading } = useAssets();

  const [mode, setMode] = useState(TxnMode.Amount);     // 3

  const assetOptions = assets?.map(toOption) ?? [];     // 4

  useEffect(() => { … }, [ … ]);                         // 5 with a one-line why

  const handleSubmit = form.handleSubmit(values => …);  // 6

  if (isLoading) {                                      // 7
    return <AppSkeleton />;
  }

  return ( … );                                         // 8
};
```

When sections 3–6 pile up, lift sections 2–6 into a feature hook (`use-<x>-form.ts`) that returns a view object. The component becomes hook(s) → guards → JSX.

### Pages and splitting

**A feature page holds composition only:** sections, handlers that wire hooks to children, and minimal glue. No long Tailwind `<div>` walls, inline business logic or repeated markup.

**Split a page into sections named like a table of contents:** `<x>-hero`, `-summary`, `-filters`, `-toolbar`, `-list` + `-list-item`, `-empty-state`, `-detail`, `-actions`, `-form`.

**Refactor when any of these happen,** as part of the task, not a follow-up:

- the file passes ~150 lines, or a JSX block passes ~80
- the component name no longer describes what it renders
- a `<div>` carries more than ~6 classes that recur elsewhere
- two unrelated `useState`/`useEffect` pairs live together (split them into hooks)
- a component has more than ~5 boolean props (redesign it with slots)

**Don't over-split.** Extract a child only when it is reused, or its JSX passes ~15 lines _and_ it has its own logic, or it is an independent concept you can name. A one-line declarative field is not a component. When logic is the bloat, extract a hook, not more components.

**Reuse before writing:**

1. shadcn (`bunx shadcn@latest add <name>`)
2. `components/common/`
3. promote from a sibling feature

Write new only when all three fail.

### App\* wrappers, never raw primitives

- Feature code uses `App*` wrappers from `components/common/`. It never imports `components/ui/*` when a wrapper exists.
- Never drop to raw `<button>`, `<input>`, `<select>`, `<table>` or `<dialog>`, not even inside an `App*` component.
- Need an odd style? Add a cva variant in `ui/` (`variant="unstyled"`, `size="fit"`).
- Don't edit `components/ui/` for app-only tweaks. A new global variant goes in the cva config; app-only behaviour goes in `components/common/.../app-x.tsx`.

**Buttons take typed `icon` and `label` props,** not children with an icon. Keep `children` for `asChild` and real composition.

```tsx
<AppButton icon={Plus} label="Add" />                                          // ✅
<AppButton><Plus className="mr-1 h-4 w-4" />Add</AppButton>                     // ❌
<AppButton variant="ghost" size="icon" aria-label="Remove"><Trash2 /></AppButton> // icon-only
```

**A control that navigates is a real link:** `<AppButton asChild><Link href="…" /></AppButton>`. Never `onClick={() => router.push(…)}`, which breaks middle-click, copy link, prefetch and the role.

### JSX

**`<Fragment>`, never `<>…</>`.** It reads clearly, survives greps and codemods, and takes `key=` without a rewrite.

**No hand-spacing in text.** No `{" "}`, no nested Fragments to interleave text, no floating string concatenation. Build the text as one template literal (in a pure helper if it has logic) and use flex/`gap` for real spacing.

**Extract conditionals before they nest.** No ternary deeper than two levels, no IIFE in render, no `&&` chain longer than ~6 lines.

```tsx
// ❌
{
  isEdit ? (pending ? "Saving…" : "Save changes") : pending ? "Recording…" : "Record";
}
// ✅
{
  submitLabel(isEdit, pending);
}
```

**A JSX callback is one readable expression.** Anything with transforms, branching or several steps becomes a named handler:

```tsx
// ❌
onChange={value => setBudgets(current => current.map((b, i) => (i === month ? value : b)))}
// ✅
onChange={value => setBudget(month, value)}
```

**Prop values stay flat.** An inline JSX tree deeper than one element, or an inline object or array literal (especially behind a ternary), moves to a `const` or a component. A prop value that spans lines belongs in a const.

```tsx
// ❌
asset={a ? { symbol: a.symbol, currency: a.currency } : undefined}
// ✅
const holdingAsset = a ? { symbol: a.symbol, currency: a.currency } : undefined;
…
asset={holdingAsset}
```

### Control flow

**Always brace an early return.** `curly: all` enforces it.

```ts
// ✅
if (!ok) {
  return;
}
// ❌
if (!ok) return;
```

**Truthiness uses `!!x` / `!x` or a plain truthy check.** Never `Boolean(x)` and never `x !== ""`. `.filter(Boolean)` is fine: there `Boolean` is a callback, not a conversion.

---

## 4. Props

**Destructure inside the body, never in the signature:**

```tsx
// ✅
const ProductCard = (props: IProps) => {
  const { product, onAddToCart } = props;
  …
};
// ❌
const ProductCard = ({ product, onAddToCart }: IProps) => { … };
```

**Name the props interface `IProps`** in a single-component file. Exported or reused props get `I<Name>Props`.

**Reusable components accept `className?: string`** and merge it with `cn()`:

```tsx
interface IProps {
  title: string;
  className?: string;
  actions?: ReactNode;
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
```

**Slots over flags.** Use `children`, `actions`, `header` and `footer`. Ad-hoc flags such as `isPrimary`, `hasIcon`, `withFooter`, `showActions` or `variant="compact"` are smells: each one doubles the branches. A shadcn cva `variant`/`size` that picks a _kind_ of control is fine.

**Keep `IProps` small and typed:** no `any`, and no spreading arbitrary HTML attributes unless the component wraps a primitive.

---

## 5. State and data

### Server state: TanStack Query

Reads use `useQuery`; writes use `useMutation` and invalidate the affected key prefix. Never `useEffect` + `useState` for fetch state, and never refetch by hand.

```ts
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

Query keys come from a hierarchical factory:

```ts
export const examplesKeys = {
  all: ["examples"] as const,
  lists: () => [...examplesKeys.all, "list"] as const,
  list: (filters: Record<string, unknown> = {}) =>
    [...examplesKeys.lists(), filters] as const,
  details: () => [...examplesKeys.all, "detail"] as const,
  detail: (id: string) => [...examplesKeys.details(), id] as const,
};
```

- Toasts and navigation after a mutation go in its `onSuccess`, not in an effect that watches `isSuccess`.
- Server Components may call services directly. Client components call hooks, and hooks call services. A hook never calls `apiClient` directly.

### Client state: Zustand, app-wide only

- One store per concern in `stores/<x>.store.ts`, with a `useXStore` hook and a `TXState` type.
- Components select narrow slices: `useCartStore(s => s.items)`, never the whole store.
- Keep stores small, with actions inside and no complex side effects. Don't create a store before a real consumer exists.
- Persist with `persist` + `partialize` when needed.
- **Never mirror query results into a store.**
- Page-scoped edit state stays in `useState` inside a feature hook. When a subtree needs it, share it through a feature-scoped Context: an `XProvider` plus a `useXContext()` that throws outside the provider, typed `ReturnType<typeof useX>`. Leaf pickers stay prop-driven.

Dialogs go through `useDialog()` from `hooks/use-dialog.ts`, and toasts through `toast` from `sonner`.

### Memoization: the React Compiler does it

The template enables the React Compiler (`reactCompiler: true`), so new code writes derived values plainly:

```tsx
const assetOptions = assets.map(toOption); // the compiler keeps the identity stable
```

Reach for `useMemo`/`useCallback` only for precise control. The common case is a value used as an effect dependency, so the effect doesn't fire on every render. In projects without the compiler, wrap derived arrays and objects in `useMemo` even when they are cheap: children and libraries compare by identity.

Constants that don't depend on render go at module scope.

---

## 6. Hooks and effects

**`useEffect` only syncs with the outside world.** Don't use it:

- to compute a value: use a const;
- to react to a click or change: use the handler;
- to reset child state on a prop change: lift the state or use `key`;
- for mutation side effects: use `onSuccess`.

Legitimate effects:

- landing a query result in form state once (`form.reset(toFormValues(data))`, because RHF defaults can't be async);
- subscribing to `window` or an external store, with cleanup;
- imperative DOM work such as focus or scroll;
- one-shot setup.

**Every effect has an honest dependency array** (no lint suppressions) and a one-line comment saying why an effect is the right tool.

**Before writing a hook, check that the logic belongs in one.** Derived values stay inline; event reactions go in handlers. A hook is for reusable feature logic, or for a component body that outgrew §3.

- Name hooks `useX` in `use-x.ts`, with the return type `TUseXReturn`.
- Hooks return an object, not an array (unless they are useState-like).
- A hook goes in root `hooks/` only when it is truly cross-feature.

---

## 7. Forms

- Use `react-hook-form` + `zodResolver(schema)`, wrap the form in `<Form {...form}>`, and use the bound controls in `components/form-controls/` (they read `useFormContext`).
- Wrap every control in `<FormControl>`; it injects `id`, `aria-invalid`, `aria-describedby` and `aria-required`. Required fields pass `required`. A control without the wrapper silently loses its label and error.
- **Read field values with `useWatch`, never `form.watch()`.** `watch` mutates behind a stable reference, which breaks memoization, both manual and the compiler's. The compiler skips any component that uses it.
- One Zod schema serves both the form and the API. It lives next to the service. Types come from `z.infer`, and schemas are checked against domain types with `satisfies z.ZodType<T>`:

  ```ts
  export const createExampleInputSchema = z.object({
    name: z.string().min(1, "Enter a name"),
  }) satisfies z.ZodType<TCreateExampleInput>;
  ```

- Wire↔form transforms are a symmetric pair of pure functions in `utils/<x>-form.ts`: `toFormValues(response)` and `toApiPayload(values, …deps)`. `handleSubmit` reads: validate → `toApiPayload` → mutate. No inline ternary spreads in handlers.
- **Validation messages are human sentences** ("Enter an amount above 0"), not schema-speak. Every rule that can fire visibly carries its own message.
- **Error display lives inside the form components,** not at call sites. `FormMessage` always reserves its line, so an appearing error never pushes the form down.

---

## 8. API

**`lib/api-client.ts` is the only network entry point.** Never call `fetch` in feature code.

**The browser calls only relative `/api/*` URLs.** The BFF proxy `app/api/[...proxy]/route.ts` forwards them to the server-only `INTERNAL_API_URL`, so the backend URL never reaches the bundle.

**Environment variables are validated with Zod in `lib/env.ts`.** A public `NEXT_PUBLIC_*` variable needs its own client schema.

**Services export named functions, never an object.** Each passes a Zod schema to `apiClient`:

```ts
export function getThingById(id: string) {
  return apiClient.get(`/things/${id}`, undefined, thingSchema);
}
// ❌ export const thingsService = { … }
```

- When a service grows many shapes, move them into a sibling `<x>.schema.ts` and re-export the `T*` types through `z.infer`.
- Pass Next fetch options (`cache`, `next.revalidate`, `next.tags`) through `apiClient` for RSC caching.
- `apiClient` throws `ApiError(status, message, body)` on non-2xx. Catch it at the boundary (a hook, server component or server action), handle the statuses you expect, and rethrow the rest:

  ```ts
  try {
    await createExample(input);
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      toast.error(m.alreadyExists);
      return;
    }
    throw err;
  }
  ```

- The Zod response schema mirrors the backend's Go DTO by hand; there is no codegen. Note it whenever a new endpoint is consumed.
- `apiClient` is the default for a Go backend. An Elysia backend may use its Eden Treaty client instead.

---

## 9. Styling

- **Tailwind utilities first,** with `cn()` (clsx + tailwind-merge) for conditional classes. No custom utility classes that duplicate Tailwind, and no inline styles.
- **Colours come from semantic tokens** (`bg-background`, `text-foreground`, `text-destructive`). Never hard-code palette values such as `text-gray-600` or `bg-blue-500`.
- **Dark mode** uses `next-themes` with `attribute="class"`. Declare the variant with `:where()` so `dark:` adds no specificity: `@custom-variant dark (&:where(.dark, .dark *))`.
- **Control shape comes from tokens,** never from `className` at the call site. Height, radius, border and focus mark are the surface's job. `variant`/`size` pick the kind of control; the surface picks its shape.
- **tailwind-merge overrides a whole group.**
  - A `flex flex-col` card used as a row needs an explicit `flex-row`.
  - Overriding `h-11 sm:h-9` with a bare `h-7` leaves `sm:h-9` standing. Override with a pair, or not at all.
- **Register custom text-size tokens** (e.g. `text-h6`) in tailwind-merge's `font-size` group in `lib/utils.ts`. Otherwise `cn()` reads them as colours and drops them.
- **The tag says what it is; the class says how big it is.** Choose the heading level for document structure and the size utility for looks. Never pick `<h6>` because you want 16px, and always pair a heading with its size class.
- **Width belongs to the parent.** Prefer a flex-column container over `w-full` on a button.
- **Motion** is ease-out, 150–250ms, with no bounce. Under `prefers-reduced-motion`, keep fades and drop zoom and slide.
- Use a consistent spacing scale (`p-4`, `gap-6`).

---

## 10. Responsive and accessibility

### Responsive

- **Design desktop and mobile in the same pass,** never desktop first with a mobile patch later.
- **The app shell owns page padding and content width.** Page and feature containers add no page-level `px-*`, `py-*`, `max-w-*` or `mx-auto`.
- **Tables scroll horizontally and never clip** (don't defeat it with `overflow-hidden`). Data-heavy tables hide low-value columns below `sm`/`md`.
- **Below `sm`,** multi-column form grids stack to one column, and toolbars and filter rows `flex-wrap`.
- **Touch targets are at least ~44px.** The floor lives on the primitives (`min-h-11 sm:min-h-9` in `buttonVariants`, inputs, select triggers), not at call sites.
- **Verify UI with real screenshots** at mobile and desktop widths, not with overflow or `scrollWidth` metrics.

### Accessibility

- Every interactive control is named: a visible label wired with `htmlFor`/`id`, or `aria-label` on icon-only buttons.
- Headings are real heading elements; a card or section title is never a styled `<span>`.
- Colour never carries state alone. Pair it with text or an icon.
- Meet AA contrast through the theme tokens, and measure it rather than assume it.
- Gate non-essential animation behind `motion-safe:`, or give it a `motion-reduce:` fallback.
- Every focusable element shows focus, including hand-built ones such as a link card.

---

## 11. i18n and copy

### Messages

The template ships the i18n module from day one, because adding it to a grown app means rewriting every page. Every user-visible string is a message in `i18n/messages/<x>.ts`:

```ts
export const accountsMessages = defineMessages(
  { title: "Accounts", total: (currency: string) => `Total · ${currency}` }, // en
  { title: "บัญชี", total: (currency: string) => `รวม · ${currency}` }, // th
);

const m = useMessages(accountsMessages); // client: m.title, m.total("THB")
const m = await getMessages(accountsMessages); // server component
```

- The `th` object must match the `en` shape, so a missing key fails `tsc`.
- Interpolation is a plain TS function, not a format string.
- **Keep one messages file per feature.** The provider loads only `common` and `nav`; feature bundles load with their routes, so code splitting holds.
- The locale lives in a cookie (`th` by default); there is no locale in the URL.
- **Need locale URLs for SEO** (`/en/...` on a public site)? Use `next-intl` for that project instead.

### Copy

- Write Thai as Thai, drafted directly, not translated from English. Avoid passive `ถูก…` and English-shaped clauses.
- One concept, one word, on every page. A new concept gets a glossary row before it reaches a second page.
- No em dashes (—) in UI copy. A lone `—` as an empty-value placeholder in a cell is fine.

---

## 12. Naming

| What                        | Rule                           | Example                                                                                        |
| --------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------- |
| Files and folders           | kebab-case                     | `product-card.tsx`, `use-products.ts`, `cart.store.ts`                                         |
| Components                  | PascalCase identifier          | `const ProductCard`                                                                            |
| Role suffixes               | by file role                   | `<x>.service.ts`, `<x>.schema.ts`, `<x>.keys.ts`, `<x>.store.ts`, `use-<x>.ts`, `<x>-page.tsx` |
| Object and prop shapes      | `interface I*`                 | `IProps`, `IOption`, `IPaginatedResponse<T>`                                                   |
| Unions, entities, responses | `type T*`                      | `TThing`, `TThingsResponse` (via `z.infer`)                                                    |
| Derived types               | by role                        | `TUseXReturn`, `TXState`, `TXResponse`, `TCreateXInput`                                        |
| Variables                   | camelCase                      | `assetOptions`                                                                                 |
| Module constants            | UPPER_SNAKE_CASE               | `DEFAULT_PAGE_SIZE`, `TYPE_OPTIONS`                                                            |
| Booleans                    | `isX` / `hasX`                 | `isLoading`, `isEdit`                                                                          |
| Handlers in a component     | `handleX`                      | `handleRowClick`                                                                               |
| Callback props              | `onX`, named for the app event | `onSelect`, `onPlayMovie` (not a generic `onClick`)                                            |
| Formatters and transforms   | `formatX`, `toX`, verb labels  | `formatPlanVerdict`, `toApiPayload`, `submitLabel`                                             |

### Finite value sets are string enums

```ts
// features/transactions/utils/transaction-constants.ts
export enum TxnMode {
  Amount = "amount",
  Quantity = "quantity",
}

useState<TxnMode>(TxnMode.Amount); // ✅
useState<"amount" | "quantity">("amount"); // ❌ literal union
setMode("amount"); // ❌ won't compile, which is the point
```

- An enum is PascalCase with string values and lives in the feature's `<x>-constants.ts`. A set shared across features lives in the domain's `types.ts`.
- Never use numeric enums, bare literal unions, magic strings in comparisons, or literal option `value`s.
- An enum is nominal, so the compiler rejects a raw string where the enum is expected. A const object's type would accept `"amount"` and let magic strings back in.
- Keep `erasableSyntaxOnly` off in `tsconfig`. It bans enums for Node's type stripping, which this stack doesn't use (Next compiles with SWC, tests run on Bun).

---

## 13. TypeScript

- `tsconfig` is strict: `strict`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`, `allowJs: false`, `isolatedModules`, path alias `@/*`.
- No `any`. Use `unknown` plus a type guard, or define the type.
- Type-only imports use `import type`, or an inline `type` specifier.
- Don't re-export types through stub files just to tidy imports.
- Remove unused variables and arguments, or prefix them with `_`.

---

## 14. Comments

**The default is no comment.** Write one only for a _why_ the code can't say: an invariant the types can't express, a workaround plus its removal condition, or a decision a reader wouldn't expect.

```tsx
// ❌ narrates what the classes already say
{
  /* Frameless: the card provides the surface */
}

// ✅
// Tool-clean palette scoped to admin; customer keeps the brand pink.
```

- **One or two lines is a hard ceiling.** Reasoning that needs a paragraph goes in a doc, with at most a pointer in the code.
- **Every `useEffect` gets one line saying why** an effect is the right tool.
- **No history or process:** no task or PR numbers, no "was X before", no commented-out code, no `TODO` without an issue link.
- **No dividers or ceremony comments,** and no `console.log`.
- **When you touch a component,** delete the comments in it that break these rules.
- **The cap applies to code comments only.** Commit messages and docs are exempt.

---

## 15. Testing

- `bun test`, with test files colocated next to what they test as `<x>.test.ts` / `<x>.test.tsx`.
- Test names are plain sentences: `test("editing takes the saved transaction back out of the holding", …)`.
- Keep logic in pure functions (transforms, formatters, constants) so it tests without React or fetch.
- Before reporting done, run `bun lint`, `bunx tsc --noEmit` and `bun test`.

---

## 16. Tooling

| Tool                | Setup                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Prettier            | `printWidth 90`, `tabWidth 2`, semicolons, double quotes, `trailingComma: "all"`, `arrowParens: "avoid"`, `endOfLine: "lf"`, `prettier-plugin-tailwindcss`                                                                                                                                                                                                                                                |
| ESLint (flat)       | `eslint-config-next` core-web-vitals + typescript, `eslint-config-prettier`, `react-hooks` recommended, `simple-import-sort`, `unused-imports`, `no-console`/`no-debugger`, `consistent-type-imports`, `tailwindcss/classnames-order`. Plus `curly: ["error", "all"]` (after the prettier config) and `no-restricted-syntax` on `CallExpression[callee.name='Boolean']`. Keep `no-implicit-coercion` off. |
| React Compiler      | `reactCompiler: true` in `next.config.ts` + `babel-plugin-react-compiler`                                                                                                                                                                                                                                                                                                                                 |
| lefthook pre-commit | ESLint `--fix` and Prettier on `{staged_files}` with `stage_fixed: true`; `gitleaks git --pre-commit --staged --redact`                                                                                                                                                                                                                                                                                   |
| lefthook pre-push   | `bun test`                                                                                                                                                                                                                                                                                                                                                                                                |
| shadcn              | `new-york`, `rsc: true`, `baseColor: neutral`, CSS variables, `lucide` icons; add components with `bunx shadcn@latest add <name>`                                                                                                                                                                                                                                                                         |

- Import icons directly from `lucide-react`; there's no central icon registry.
- Use `next/image` for images and the Metadata API for SEO.
- In a monorepo, one `lefthook.yml` at the git root dispatches per app with `root:`. git allows only one `core.hooksPath`, so husky and lefthook side by side silently disable each other. husky's `prepare` also fails when `package.json` sits below the git root.

---

## 17. What tooling already covers

| Concern                                      | Tool                                                          |
| -------------------------------------------- | ------------------------------------------------------------- |
| `any`                                        | `@typescript-eslint/no-explicit-any`                          |
| Type-only imports                            | `@typescript-eslint/consistent-type-imports`                  |
| Unused imports and variables                 | `unused-imports/*`                                            |
| Import order                                 | `simple-import-sort`                                          |
| Hook rules and dependency arrays             | `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`   |
| Tailwind class order                         | `tailwindcss/classnames-order`, `prettier-plugin-tailwindcss` |
| `console.log`, `debugger`                    | `no-console`, `no-debugger`                                   |
| Braceless `if`                               | `curly: all`                                                  |
| `Boolean(x)` conversions                     | `no-restricted-syntax`                                        |
| Strictness, indexed access, implicit returns | `tsc`                                                         |
| Formatting                                   | Prettier                                                      |
| Secrets in commits                           | gitleaks                                                      |

---

## 18. Commits and pull requests

**Commit messages:** Conventional Commits with `init · feat · fix · refactor · chore · docs · style · test`. Write the subject in the imperative, at most 90 characters, and put details in the body.

**While working,** commit as often as you like.

**Before push and PR, consolidate to 4–6 commits, never more than 8.**

- Group by concern: docs apart from code; code in dependency order (types/schema/service → hooks → components → route).
- Each commit builds and passes lint and tests on its own.
- Fold every review fix into the commit it belongs to.

**Before opening the PR:**

- Run `bun lint`, `bunx tsc --noEmit` and `bun test`.
- Rebase onto the current remote base, and push with `--force-with-lease`.
- Stage by explicit path, never `git add -A`.
- Never open a PR against another feature branch.

---

## 19. Stack

Next.js 16 (App Router), React 19, TypeScript strict, Bun, Tailwind v4, shadcn (new-york), TanStack Query 5, Zustand 5, react-hook-form + Zod 4, next-themes, sonner, lucide-react, React Compiler, lefthook.

---

## Appendix: why these choices

These decisions were settled when the source projects disagreed or said nothing. brew-hub-web (2025-12) is the first-generation style; klang, oobi and this template replaced it, so its rules lost wherever they conflict.

| Decision                             | Why                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| String enums                         | Nominal typing makes the compiler enforce "no magic strings". TS 5.8's `erasableSyntaxOnly` concerns Node type stripping, which this stack doesn't use.                                                                                                                                                                                                                                                                                                                |
| Always brace early returns           | It matches Go, shows the structure when scanning, and keeps diffs clean. oobi hit prettier wrapping a braceless `return null;` onto its own line.                                                                                                                                                                                                                                                                                                                      |
| `!!x` over `Boolean(x)`              | A user correction (2026-10-03). `.filter(Boolean)` stays as an idiom.                                                                                                                                                                                                                                                                                                                                                                                                  |
| lefthook over husky                  | husky broke in klang's monorepo, and hook managers can't be mixed. Web projects tend to become Go + Next monorepos.                                                                                                                                                                                                                                                                                                                                                    |
| React Compiler over always-`useMemo` | The `useMemo` rule existed for identity, which the compiler provides. React Compiler v1.0 shipped 2025-10-07, and Next 16 made it a stable option. The old rule was copied down the brew-hub lineage without being re-checked.                                                                                                                                                                                                                                         |
| `useWatch` over `watch()`            | react.dev lists `watch` as incompatible with memoization (interior mutability).                                                                                                                                                                                                                                                                                                                                                                                        |
| `handleX` / `onX`                    | It is react.dev's convention, and already 94% of existing handlers.                                                                                                                                                                                                                                                                                                                                                                                                    |
| Homegrown i18n over a library        | Library extras (locale routing, ICU plurals, translator tooling) aren't needed. Its th/en shape check is the only compile-time missing-key check; i18next would need the same type written by hand. 188 lines on stable primitives have no bundler coupling to break: Paraglide's guide broke on Next 16, typesafe-i18n on TS 7. Performance: both locales ship, ~5 KB gzip extra on the heaviest klang route (measured on source), and a lookup is a property access. |
| i18n in the template from day one    | klang added it later and had to retrofit every page.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `.test.ts` over `.test.js`           | Tests get type-checked; `allowJs: false` leaves `.js` tests outside `tsc`.                                                                                                                                                                                                                                                                                                                                                                                             |

## Appendix: where the template doesn't match this guide yet

| Gap                                                                                                                           | Fix                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| husky + lint-staged (`"prepare": "husky"`)                                                                                    | Replace with lefthook: staged ESLint/Prettier, gitleaks, and `bun test` on pre-push            |
| No `test` script and no tests                                                                                                 | Add `"test": "bun test"` and a first test for `features/example/utils`                         |
| React Compiler off                                                                                                            | `reactCompiler: true` + `babel-plugin-react-compiler`, then confirm with build and tests       |
| No i18n module                                                                                                                | Copy klang's `i18n/`, add `getMessages` for Server Components, and decide single-language mode |
| ESLint lacks `curly: all` and the `Boolean(` restriction                                                                      | Add both after the prettier config                                                             |
| ESLint blocks are still named `brew-hub-*`                                                                                    | Rename them                                                                                    |
| `.claude/agents/` and `.claude/prompts/` are the stale BrewHub kit (Eden Treaty, `useEffect` fetching, PascalCase file names) | Delete them, or replace them with thin wrappers that defer to the rule sheet, as oobi-web did  |
| `.claude/CLAUDE.md` §7.1 says always `useMemo`                                                                                | Update it to the compiler rule                                                                 |
| README examples use a raw `<button>`, `if (!ok) return;` and `Boolean(id)`                                                    | Fix the examples                                                                               |
| No `lib/format.ts`                                                                                                            | Add the generic `Intl` formatters                                                              |
