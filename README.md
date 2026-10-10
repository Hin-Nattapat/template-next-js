# template-next-js

Opinionated Next.js 16 template tuned for fast feature delivery.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19, with the React Compiler
- **Language**: TypeScript (strict)
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york) + lucide-react
- **State**: TanStack Query for server state, Zustand for app-wide client state
- **Forms**: react-hook-form + Zod
- **API**: a `fetch` wrapper with Zod validation, behind a BFF proxy
- **i18n**: homegrown, type-checked th/en messages
- **Theming**: `next-themes` (light / dark / system)
- **Notifications**: sonner toasts + a promise-based dialog system
- **Tooling**: ESLint, Prettier, lefthook, gitleaks
- **Runtime**: Bun (Node 20+ also works)

## Getting started

```bash
bun install
bunx lefthook install       # git hooks; gitleaks needs `brew install gitleaks` once
cp .env.example .env.local
bun dev
```

Then open <http://localhost:3000>. The home page links to `/example`, a working showcase of the form, dialog and toast patterns.

| Command             | What it does                                                           |
| ------------------- | ---------------------------------------------------------------------- |
| `bun dev`           | Dev server                                                             |
| `bun run build`     | Production build                                                       |
| `bun start`         | Serve the production build                                             |
| `bun lint`          | ESLint `--fix`, then Prettier                                          |
| `bun test`          | The colocated `*.test.ts` files                                        |
| `bunx tsc --noEmit` | Type check (run `bunx next typegen` first so typed routes are checked) |

lefthook runs ESLint, Prettier and gitleaks on staged files at commit time, and `bun test` before push.

## Environment variables

| Variable           | Description                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------- |
| `INTERNAL_API_URL` | Backend base URL. Server-only: the BFF proxy reads it, and the browser bundle never sees it. |

Server env vars are validated at boot (`instrumentation.ts`): a missing or invalid one stops `next dev` and `next start`. `bun run build` reads them too.

## Tour

```
app/                 routes (thin), layouts, the BFF proxy at api/[...proxy]
features/<x>/        everything a feature owns: components, hooks, services, utils, types, constants
components/          ui/ (shadcn), common/ (App* wrappers), form-controls/ (RHF inputs)
i18n/                locale, provider, messages/<x>.ts
types/ schemas/      shared types and constants, shared zod schemas
utils/               pure helpers: format, view-state, number-input, pagination
lib/                 api-error, utils (shared)
lib/server/          server-only: env
lib/client/          browser-only: api-client, query-client
stores/ hooks/       app-wide state and cross-feature hooks
docs/                STYLE.md (placement rule in §2) and ARCHITECTURE.md
```

## Starting a feature

`features/example/` is a working scaffold of the full pattern.

1. Copy `features/example/` to `features/<your-feature>/`.
2. Rename files and identifiers (`example` → `your-feature`, `Example` → `YourFeature`).
3. Add the route at `app/(public)/<your-feature>/page.tsx`.
4. Delete `features/example/` once you no longer need it as a reference.

## Docs

| File                                           | For                                                                                          |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [`docs/STYLE.md`](docs/STYLE.md)               | How code is written here: components, state, forms, styling, i18n, naming                    |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | How the pieces work: request path, server state, dialogs, i18n, theming                      |
| [`AGENTS.md`](AGENTS.md)                       | What coding agents load every session: where to read, what "done" means, commit and PR rules |
