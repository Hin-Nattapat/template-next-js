---
paths:
  - "**/*.{ts,tsx,css}"
---

# Next.js style

Core conventions for new and touched code. Task-specific approved decisions take precedence; leave unrelated files unchanged. Claude Code loads this file through `.claude/rules/style.md`. Resolve the reference links below from `docs/STYLE.md`, not from the symlink's directory.

Read the relevant reference before editing its area:

- **Components, routes, props or handlers:** [components](reference/components.md).
- **Forms, queries, services, state, effects or hooks:** [forms and data](reference/forms-and-data.md).
- **Layout, styling, interaction, accessibility, i18n or UI copy:** [UX and copy](reference/ux-copy.md).
- **Verification, tool configuration or historical decisions:** [tooling](reference/tooling.md).

[ARCHITECTURE.md](ARCHITECTURE.md) owns current runtime architecture. [AGENTS.md](../AGENTS.md) owns workflow and completion checks. Tool configurations and diagnostics own mechanically enforced rules; inspect them rather than copying their rule lists here.

## 1. Principles

- Prefer simple, explicit code; reuse the existing implementation before adding one.
- Require two concrete callers for a **shared abstraction**. A local helper, a pure calculation or a named reactive workflow may have one caller when it owns a real responsibility. Consolidate repeated markup by its third copy.
- Server Components are the default; add `"use client"` for hooks, events, browser APIs or Zustand. Keep server/client import boundaries intact.
- Hand-write frontend code; use design mockups as visual reference.
- Size thresholds are review signals, not automatic extraction rules. Split where a meaningful responsibility makes code easier to follow.

## 2. Layout

Choose the owner first: keep feature-owned code in `features/<x>/`; promote to app level when a second feature actually needs it. Then choose the role:

| Role                                    | Feature-owned                             | App-wide                         |
| --------------------------------------- | ----------------------------------------- | -------------------------------- |
| Types and entities                      | `types.ts`                                | `types/<topic>.ts`               |
| Fixed values, enums, option sets        | `constants.ts`                            | `types/<topic>.constants.ts`     |
| Boundary schemas                        | `services/<x>.schema.ts`                  | `schemas/<topic>.schema.ts`      |
| Pure calculations/transforms            | `utils/<x>-<topic>.ts`                    | `utils/<topic>.ts`               |
| Runtime-dependent configuration builder | `config/<x>-config.ts`                    | Keep with its actual owner       |
| React behavior                          | `hooks/use-<x>.ts`                        | `hooks/` for cross-feature hooks |
| UI                                      | `components/<x>-page.tsx` and sections    | `components/common/`             |
| Network operations                      | `services/<x>.service.ts`                 | `lib/` for infrastructure        |
| App-wide client state                   | Use local state/Context for feature state | `stores/<x>.store.ts`            |

- `app/` owns thin route entries and layouts; `components/ui/` owns shadcn primitives; `components/form-controls/` owns RHF-bound controls. Follow the existing tree; these rules do not authorize moving runtime code during a documentation change.
- Use `lib/server/` with `import "server-only"` for server-only integration, `lib/client/` with `import "client-only"` for browser-only integration, and `lib/` for both-side infrastructure. Pure work belongs to its feature role, not automatically to `lib/` or `utils/`.
- Keep service-local types with the service; a `z.infer` type may stay beside its schema. A lib module keeps shared `<module>.constants.ts` / `<module>.schema.ts` beside it and exports its own input types from the module.
- Keep private prop/params/return types, a small one-off lookup and trivial local helpers with their component or hook. Substantial pure logic gets a named, testable module; runtime config gets its owner's builder. Other feature entities, shared options and boundary schemas follow the table.
- `components/common/` may also keep private constants/cva values and exported caller-facing types at the top of its component file. Move values out when another file needs them; do not create `<component>.constants.ts` siblings.
- `lib/utils.ts` keeps `cn()` because `components.json` points to it. Use the existing `utils/format.ts` for generic money, number, percent and date formatting.
- Use descriptive filenames, never `helpers.ts`. Feature transforms use `<x>-form.ts`; display formatting uses `<x>-format.ts`; other calculations get a domain-specific name.
- Keep one source for each rule/value. Tailwind classes used once stay inline; constants are for cva variants or real reuse.
- Copy `features/example/` for new features. Add types/constants → schemas → service → keys → hooks → components → route, as needed.

## 3. Decisions and functions

- Finite keys selecting fixed labels, icons or values use a typed lookup, e.g. `satisfies Record<Mode, IModeConfig>`. A small single-use lookup may stay local.
- Related labels/settings selected by the same mode belong in one config entry; select it once rather than repeating the same condition for every field.
- Genuine alternative behaviors with the same input/output contract may use a typed function map. Do not turn fixed values into functions merely to use a map. Use explicit control flow for branches with different payloads or contracts, including discriminated view states.
- When config depends on runtime inputs, use a pure builder. With a clear feature owner, place it at `features/<x>/config/<x>-config.ts`; keep only true fixed data in constants. Functions belong to their responsibility, not all in `utils/`.
- Use a named argument object when positional roles are ambiguous, especially current versus saved values. Keep short, obvious positional calls when their meaning is clear.
- Keep simple expressions directly at the use site. Name multi-step derivations and nested conditional shapes; avoid a trail of one-use constants that merely rename property access.
- Keep intermediate calculation values inside the pure function that owns the calculation. Return the result callers need; do not spread internal steps across a hook and component.

## 4. Naming and language

| What                               | Convention                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------- |
| Files/folders                      | kebab-case; role suffixes such as `.service.ts`, `.schema.ts`, `.keys.ts`, `.store.ts`, `-page.tsx` |
| Components                         | PascalCase const arrow; default export at bottom; one component per file                            |
| Hooks/services                     | Named `export function`; hooks `useX` in `use-x.ts`                                                 |
| Object/prop shapes                 | `interface I*`; single-component props `IProps`, reused/exported props `I<Name>Props`               |
| Unions/entities/inferred responses | `type T*`; hook return `TUseXReturn`, store `TXState`, input `TCreateXInput`                        |
| Variables/module constants         | camelCase / UPPER_SNAKE_CASE                                                                        |
| Booleans                           | `isX` / `hasX`                                                                                      |
| Handlers/callback props            | `handleX` / domain-event `onX`, such as `onSelect`                                                  |
| Formatters/transforms              | `formatX`, `toX`, descriptive label functions                                                       |

- Destructure props inside the body. Never define a component inside another component.
- Finite domain value sets use PascalCase string enums in the owner's constants file; use members in comparisons/options instead of numeric enums, bare literal unions or magic strings. Keep `erasableSyntaxOnly` off while using enums.
- Narrow `unknown` at trust boundaries; import types from their definition rather than re-export-only stubs.
- Truthiness uses `!!x`, `!x` or a plain truthy check; `.filter(Boolean)` is fine. Every `if` body has braces.
- Comments explain a non-obvious reason, invariant or workaround/removal condition in one or two lines. Put longer reasoning in docs. Remove stale/narrative/divider comments from touched components; leave no commented-out code, task history or `TODO` without an issue link.
