# Verification and tooling

Read when adding tests, choosing checks or changing the build/tool boundary. [AGENTS.md](../../AGENTS.md) owns completion/workflow; [STYLE.md](../STYLE.md) owns coding conventions. Inspect package/config files for exact commands and enforced diagnostics.

## Test boundaries

- Colocated `.test.ts` / `.test.tsx` files participate in TypeScript checks; JavaScript tests do not in this template. Use plain behavioral scenario names.
- Non-trivial branching, parsing, money, security or state-transition logic needs a small focused check. Pure calculations should test without React or network mocks.
- `server-only` / `client-only` throw outside a Next build. `bunfig.toml` preloads `test-setup.ts` to stub them, so unit tests can import the owned integration modules.

## Tooling gotchas

- `bun lint` mutates files: ESLint fixes run before Prettier so brace fixes are formatted. Review its diff; use the existing tools' check modes for a read-only review.
- Typed routes need generated types: run `bunx next typegen` before `bunx tsc --noEmit` after a fresh checkout or route changes. `next build` also generates them.
- Typed ESLint uses `projectService`; keep `no-implicit-coercion` off because it conflicts with the chosen `!!x` convention. Keep `erasableSyntaxOnly` off while using string enums.
- A monorepo has one git hooks path. Use one root lefthook configuration with per-app dispatch, rather than competing managers.
- React Compiler is enabled here, but eligibility/diagnostics matter. The [memoization guidance](forms-and-data.md#memoization) owns that decision; do not assume every consumer gets stable identity automatically.

## Known implementation gap

`app/globals.css` still declares `@custom-variant dark (&:is(.dark *))`, while the
[styling rule](ux-copy.md#9-styling) uses `:where()` to avoid extra specificity.
Changing that requires its own UI verification; this documentation cleanup does
not migrate the runtime.
