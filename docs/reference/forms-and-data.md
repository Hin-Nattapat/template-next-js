# Forms, data and hooks

Read before changing forms, queries, services, client state, effects or hooks. [STYLE.md](../STYLE.md) owns decomposition/arguments; [ARCHITECTURE.md](../ARCHITECTURE.md) owns the current request/provider/state wiring. Inspect [features/example](../../features/example) for working API/form/query examples instead of copying another catalog here.

## Server state

- Use feature `useQuery` / `useMutation` hooks and services; components do not call the network directly or build fetching state with effects. A hook does not bypass its service to call `apiClient`.
- Use hierarchical query keys and invalidate the affected prefix after writes. Caller-specific outcomes belong at `mutate`; shared invalidation belongs in the mutation hook. Toasts/navigation follow the mutation outcome, not an effect watching success.
- Use query `select` for a reusable data projection. A short render derivation may remain local; multi-step pure calculations belong in their owning function rather than another hook by default.
- The [page view state](../ARCHITECTURE.md#page-view-state) section owns the template's loading/error/empty/not-found/ready precedence. Follow the existing `AppViewState` contract here. A failed background refresh currently replaces ready content with Error; changing that behavior needs an explicit product decision.
- `AppViewState` switches over a discriminated union because each state carries different data. A typed function map is for genuine alternatives with the same contract, as described in the core.

## Client state

- Zustand owns app-wide state, with one small store per concern and narrow selectors. Do not mirror query results into it or create a store without a real consumer. Use persistence with `partialize` when required.
- Feature/page edit state stays local to its reactive owner. Share through a feature Context only when the subtree needs it: an `XProvider` and a `useXContext()` that throws outside the provider. Leaf pickers remain prop-driven.
- Dialogs use the existing promise-based `useDialog`; notifications use `sonner`. Their APIs and provider composition live in the architecture/implementation.

## Memoization

React Compiler is enabled, but that does not guarantee every component/hook is compiled. Write ordinary derived expressions first. Use `useMemo` / `useCallback` for expensive work or a concrete consumer identity contract, including an effect dependency. Verify that need at the consumer rather than memoizing every array/object. Hoist fixed data to module scope.

## Hooks and effects

A hook owns named reactive behavior, a lifecycle or a workflow and reduces the details its caller needs to know. A single caller is valid; size alone does not justify extraction. Pure calculations/config stay plain functions.

- Hooks return an object unless they are intentionally useState-like. Root `hooks/` is only for cross-feature use.
- Effects synchronize with outside systems: a subscription (with cleanup), imperative DOM work, or initializing/replacing a form from fetched data when required. Keep dependencies honest, without lint suppression, and give a one-line non-obvious reason where needed.
- Derived values belong in render/pure functions; clicks belong in handlers; mutation outcomes belong in callbacks. Reset child state with explicit state ownership or `key` rather than a synchronization effect by default.

## Forms

- Use RHF with `zodResolver`, `<Form {...form}>` and bound `components/form-controls/`. Each control stays inside `FormControl` for ID/error/accessibility wiring; required controls pass `required`. The form control owns `FormMessage` and reserves its error line.
- Read reactive field values with `useWatch`, not `form.watch()`. Watch an existing coherent row/object when its fields feed one decision, instead of growing parallel name/result tuples. Individual fields are fine when they are genuinely all the decision needs.
- For a computed result, `compute` returns fresh derived values, not the input/shared nested object. Capture only inputs fixed for the form's lifetime; apply changing locale/messages/query data outside it. Put the subscription in the smallest consumer that renders the result. A `getValues` read is a snapshot, not a reactive subscription.
- Input schemas validate the form; response schemas validate external data. Keep them by the service and infer their types, using `satisfies z.ZodType<T>` when matching a domain shape. Validation errors are human sentences.
- Wire↔form transformations use `toFormValues` / `toApiPayload` in the owning `<x>-form.ts`. Handlers validate → transform → mutate rather than assembling conditional payloads inline.

## API boundaries

- Browser feature services use named exports over `lib/client/api-client.ts`, relative `/api/*` URLs and Zod validation. The [request path](../ARCHITECTURE.md#request-path) owns BFF, environment and server/client import boundaries. Do not import a browser service from a Server Component.
- Parse URL identifiers, search values and redirect targets with schemas at the boundary. Let the schema state accepted shapes/defaults instead of unexplained coercion.
- Handle expected `ApiError` statuses at the owning boundary and rethrow unexpected failures. Align consumed response schemas with the backend DTO; this template does not generate that contract.
- A project with another backend client (such as Eden Treaty for Elysia) chooses it explicitly instead of duplicating transports.
