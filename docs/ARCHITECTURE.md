# Architecture

How the template's pieces work and why they are shaped this way. The rules for writing code in them are in [`STYLE.md`](STYLE.md). `features/example/` is the reference implementation of every pattern below; read it before copying a snippet.

---

## Request path

```
browser ──/api/*──▶ app/api/[...proxy]/route.ts ──▶ INTERNAL_API_URL (backend)
   ▲                         (BFF proxy, server-only)
   │
client component ─▶ feature hook (TanStack Query) ─▶ service ─▶ lib/api-client.ts
server component ─────────────────────────────────▶ service ─▶ lib/api-client.ts
```

- **The BFF proxy** forwards every relative `/api/*` call to `INTERNAL_API_URL`. That URL is server-only, so the browser never learns where the backend lives and there is no CORS to configure.
- **`lib/env.ts`** validates server env vars with Zod (`serverEnvSchema`) at boot. A public `NEXT_PUBLIC_*` variable would need its own client schema; none exist today.
- **`lib/api-client.ts`** is a thin `fetch` wrapper. It sets JSON headers, parses the response, validates it with the Zod schema passed as the third argument, and forwards Next fetch options (`cache`, `next.revalidate`, `next.tags`), so Server Components get caching and revalidation for free.
- **`lib/api-error.ts`** defines `ApiError(status, message, body)`, which `apiClient` throws on any non-2xx response.

## Server state

`app/providers.tsx` mounts the TanStack `QueryClientProvider`. Feature hooks wrap services in `useQuery` and `useMutation`, keyed by the hierarchical factory in `<x>.keys.ts`. Invalidating a prefix such as `examplesKeys.lists()` refetches every active query under it, which is why mutations invalidate instead of refetching by hand.

## Dialogs and toasts

`useDialog()` (`hooks/use-dialog.ts`) is promise-based: `confirm` and `confirmDelete` resolve to the user's choice, and `alert`, `info`, `success`, `warning` and `error` show a message. It drives a Zustand store (`stores/dialog.store.ts`) rendered by `<AppDialogRoot />`, which is mounted once in `app/layout.tsx`. Toasts come from `sonner`.

## i18n

- `i18n/locale.ts` defines the locales (`th` by default, `en`) and the site-wide `locale` cookie that stores the choice for a year. There is no locale in the URL.
- `app/layout.tsx` reads the cookie on the server and passes it to `I18nProvider`, so the first render is already in the right language.
- `I18nProvider` carries only the `common` and `nav` bundles. Feature bundles are imported by the components that use them, so they load with their routes.
- `useMessages(bundle)` picks the current locale in client components; `getMessages(bundle)` (`i18n/get-messages.ts`) reads the cookie in server components.
- `defineMessages(en, th)` types the `th` object against the `en` one, so a missing or extra key fails `tsc`.

## Theming

`next-themes` is set up in `app/layout.tsx` through `components/common/theme-provider.tsx` (`attribute="class"`, `defaultTheme="system"`). `useTheme()` switches it from any client component. The colour tokens are CSS variables in `app/globals.css`: light values on `:root`, dark overrides on `.dark`, exposed to Tailwind as `bg-background`, `text-foreground` and so on.

## React Compiler

`next.config.ts` sets `reactCompiler: true` (with `babel-plugin-react-compiler`). The compiler memoizes components and hooks at build time, which is why STYLE.md drops the always-`useMemo` rule. It skips any component that breaks the Rules of React or uses an incompatible API such as `form.watch()`.
