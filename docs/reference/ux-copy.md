# Styling, accessibility and copy

Read when changing layout, styling, interaction, accessibility, i18n or user-visible copy. Core ownership and coding rules live in [STYLE.md](../STYLE.md).

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
- **The app shell owns page padding and content width.** Page and feature containers add no page-level `px-*`, `py-*`, `max-w-*` or `mx-auto`. The one exception is a page with no shell, which owns its own padding.
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

All user-visible text lives in a feature's `i18n/messages/<x>.ts` bundle. Use the
current client/server accessors and type-checked `defineMessages(en, th)` API from
the [i18n architecture](../ARCHITECTURE.md#i18n), rather than copying a parallel example here.
Interpolation is a plain TS function. Keep one bundle per feature so it loads with
that route. A project that needs locale URLs for SEO can choose `next-intl` explicitly.

### Copy

- Write Thai as Thai, drafted directly, not translated from English. Avoid passive `ถูก…` and English-shaped clauses.
- One concept, one word, on every page. A new concept gets a glossary row before it reaches a second page.
- No em dashes (—) in UI copy. A lone `—` as an empty-value placeholder in a cell is fine.
