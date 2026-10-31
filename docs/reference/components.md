# Components and routes

Read before changing routes, component composition, slots or handlers. [STYLE.md](../STYLE.md) owns general naming, placement and decision rules; [features/example](../../features/example) is the runnable example. Inspect current App component props rather than maintaining a second API catalog.

## Route boundaries

- A route reads `params`/`searchParams`, validates external values with Zod, calls `notFound()` for invalid identifiers, and passes the parsed values to the feature page. A route with no parameters simply renders that page.
- Use Next's generated `PageProps<"/route">`, `LayoutProps<"/route">` and `RouteContext<"/route">`; run `next typegen` before type-checking. Destructure props before reading/parsing their values.
- A dynamic segment with its own 404 experience keeps `not-found.tsx` beside its page. It uses the shared `AppStateMessage`; the root not-found handles unmatched routes.
- Client components consume feature hooks/services. The browser-only `lib/client/api-client.ts` is not a server transport. Backend reads on the server require an explicit server-only helper; the template does not ship one.

## Composition and local scope

Keep component bodies in this order: props/trivial locals → hooks (`useRef`, router, form, data/custom; producer first when required) → state → derived values → effects → handlers → guards → JSX. Group related declarations for scanning. Follow the core's responsibility test before creating another hook.

A feature page composes named sections and wires actions. A child earns a file through reuse or an independent responsibility, including a meaningful named page section. A tiny wrapper that adds neither shared semantics nor behavior can stay inline. File length, prop count and repeated classes are review signals, not extraction quotas.

When a component folder becomes difficult to navigate, group by UI role: `pages`, `sections`, `forms`, `tables`, `dialogs`, `shared`. Keep multi-step flows in those buckets, not another flow-specific hierarchy. Hooks/services/utils and feature types/constants remain flat. Descriptive format/form helpers follow the core's placement table.

## Wrappers and controls

- Search existing `components/common/`, `components/ui/` and sibling implementations before adding a primitive. Feature code uses the App wrapper when one exists. Interactive raw primitives are owned by the UI layer, including inside App wrappers.
- New shared visual variants belong in the UI primitive's cva; app-only behavior belongs in its App wrapper. This exception is different from forking shadcn for a single caller's styling.
- Standard `AppButton` content uses typed `icon`/`label`; `children` is for composition or an accessible icon-only control. A destination renders a real link through the existing composition, preserving middle-click, copy-link and prefetch behavior.
- Reusable components accept `className` merged through `cn()` and typed slots instead of unrelated boolean flags. Keep their prop surface small; arbitrary DOM prop spreading belongs only on primitive wrappers.

## JSX and actions

- Use explicit `Fragment`; compose prose as one message/template literal rather than hand-spaced text nodes.
- A short direct choice may remain inline. For nested decisions, choose a config, pure function or control flow according to [STYLE.md](../STYLE.md#3-decisions-and-functions), instead of extracting every value to a const.
- Pass an existing object when its shape already fits. Non-trivial wire/form shaping belongs at that boundary; a new alias alone does not improve identity or meaning.
- A callback that hides a nested update algorithm or a named operation becomes a handler. Keep short, obvious local wiring inline; line wrapping alone does not require another function.
- Caller-specific mutation outcomes belong at `mutate(input, { onSuccess, onError })`; invalidation needed by every caller belongs in the mutation hook. Name a multi-step outcome when that makes the operation clearer, rather than making one helper per callback by default.
