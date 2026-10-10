# Architecture

How the template's pieces work and why they are shaped this way. The rules for writing code in them are in [`STYLE.md`](STYLE.md). `features/example/` is the reference implementation of every pattern below; read it before copying a snippet.

---

## Request path

```
browser ──/api/*──▶ app/api/[...proxy]/route.ts ──▶ INTERNAL_API_URL (backend)
   ▲                         (BFF proxy, server-only)
   │
client component ─▶ feature hook (TanStack Query) ─▶ service ─▶ lib/client/api-client.ts
```

Data is fetched in the browser only: `api-client` calls relative `/api/*` paths and is guarded by `client-only`. A server component that needs backend data would call the backend from `lib/server/` instead.

- **The BFF proxy** forwards every relative `/api/*` call to `INTERNAL_API_URL`. That URL is server-only, so the browser never learns where the backend lives and there is no CORS to configure.
- **`lib/` is split by side.** `lib/server/` and `lib/client/` guard their files with `server-only` / `client-only`, so an import from the wrong side fails the build; `lib/` itself holds the wrappers both sides share (`api-error`). Pure helpers (`format`, `view-state`, `number-input`, `pagination`) live in `utils/`, shared types and fixed values in `types/` (`http.constants`, `pagination`), and shared schemas in `schemas/`. Never copy a module into both `lib/` folders. STYLE.md §2 has the full placement rule, including what `components/common/` may keep in a component file.
- **`lib/server/`** holds every server-only module. Each file starts with `import "server-only"`, so a client import fails the build; unit tests stub it through `bunfig.toml` → `test-setup.ts`.
- **`lib/server/env.ts`** validates the server env vars with Zod (`lib/server/env.schema.ts`, whose `parseServerEnv` is unit-tested). `instrumentation.ts` imports it when the Node runtime boots, so a bad env stops the server instead of failing on the first request. A public `NEXT_PUBLIC_*` variable would need its own client schema; none exist today.
- **`lib/client/api-client.ts`** is a thin `fetch` wrapper. It sets JSON headers, parses the response, and validates it with the Zod schema passed as the third argument. It uses relative URLs only, so it runs in the browser.
- **`lib/client/query-client.ts`** exports `createQueryClient()`; its numbers (stale time, retries) live in `lib/client/query-client.constants.ts`. It takes an optional `onError` for a global handler on every query and mutation, such as a redirect on 401.
- **`lib/api-error.ts`** defines `ApiError(status, message, body)`, which `apiClient` throws on any non-2xx response.

## Server state

`app/layout.tsx` is a Server Component: html/body, fonts, metadata and the locale cookie, nothing else. Every client-side provider and app-wide UI root (`ThemeProvider` → `QueryClientProvider` → `I18nProvider`, then `Toaster` and `AppDialogRoot`) lives in `app/providers.tsx`, the single `"use client"` boundary the layout renders; a new provider goes there. The `QueryClient` is created in `useState` through `createQueryClient()` so each browser gets one stable instance. Feature hooks wrap services in `useQuery` and `useMutation`, keyed by the hierarchical factory in `<x>.keys.ts`. Invalidating a prefix such as `examplesKeys.lists()` refetches every active query under it, which is why mutations invalidate instead of refetching by hand.

## Page view state

A page that loads data is always in one of five states, and one place decides which. `types/view-state.ts` defines the shape:

```ts
enum ViewStateKind {
  Loading = "loading",
  Error = "error",
  Empty = "empty",
  NotFound = "not_found",
  Ready = "ready",
}

type TViewState<T> =
  | { kind: ViewStateKind.Loading }
  | { kind: ViewStateKind.Error; error: Error; retry: () => void }
  | { kind: ViewStateKind.Empty }
  | { kind: ViewStateKind.NotFound }
  | { kind: ViewStateKind.Ready; data: T };
```

`toViewState({ queries, build, isEmpty })` in `utils/view-state.ts` turns a feature's queries into that shape. The first match wins: any query errored (a failed background refetch with data still present counts) gives Error, and `retry` refetches every query; any query loading gives Loading; `build()` returning `null` gives NotFound; `isEmpty(data)` gives Empty; otherwise Ready with the data.

A feature builds the view in `features/<x>/hooks/use-<x>-view.ts` (`useExamplesView` in the example). That hook is where the page's queries, the lookup tables and the derived values live, so the page component is hooks followed by JSX. `AppViewState` (`components/common/states/app-view-state.tsx`) renders it with a `switch` on `view.kind`. Its slots are `loading`, `empty`, `notFound` and `error` (the default is `AppLoadError`: a "could not load" message and a retry button); `children` is a function of the ready data. A slot that is missing for a state that occurs renders nothing. `AppStateMessage` is the shared box for empty and not-found messages.

Why: without it, every page summarises its state with a different pile of booleans and each feature writes its own error and empty boxes, so the same rule (what wins when one query fails and another is loading) lives in several places and can disagree. Now one function decides, and the `switch` over `ViewStateKind` is exhaustive, so adding a state fails `tsc` in every page until it is handled.

## Dialogs and toasts

`useDialog()` (`hooks/use-dialog.ts`) is promise-based: `confirm` and `confirmDelete` resolve to the user's choice, and `alert`, `info`, `success`, `warning` and `error` show a message. It drives a Zustand store (`stores/dialog.store.ts`) rendered by `<AppDialogRoot />`, which is mounted once in `app/providers.tsx`. Toasts come from `sonner`.

## i18n

- `i18n/locale.ts` defines the locales (`th` by default, `en`) and the site-wide `locale` cookie that stores the choice for a year. There is no locale in the URL.
- `app/layout.tsx` reads the cookie on the server and passes it through `Providers` to `I18nProvider`, so the first render is already in the right language.
- `I18nProvider` carries only the `common` and `nav` bundles. Feature bundles are imported by the components that use them, so they load with their routes.
- `useMessages(bundle)` picks the current locale in client components; `getMessages(bundle)` (`i18n/get-messages.ts`) reads the cookie in server components.
- `defineMessages(en, th)` types the `th` object against the `en` one, so a missing or extra key fails `tsc`.

## Theming

`next-themes` is set up in `app/providers.tsx` through `components/common/theme-provider.tsx` (`attribute="class"`, `defaultTheme="system"`). `useTheme()` switches it from any client component. The colour tokens are CSS variables in `app/globals.css`: light values on `:root`, dark overrides on `.dark`, exposed to Tailwind as `bg-background`, `text-foreground` and so on.

## React Compiler

`next.config.ts` sets `reactCompiler: true` (with `babel-plugin-react-compiler`). The compiler memoizes components and hooks at build time, which is why STYLE.md drops the always-`useMemo` rule. It skips any component that breaks the Rules of React or uses an incompatible API such as `form.watch()`.
