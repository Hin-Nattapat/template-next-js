# AGENTS.md

Next.js 16 frontend template: App Router, React 19, TypeScript strict, Tailwind v4, shadcn, TanStack Query, Bun. Clone it and add features by copying `features/example/`.

Talk to the human in Thai. Write everything that lands in a file, a commit or a PR in English.

## Before you change code

- **Writing, changing or reviewing TS, TSX or CSS:** read [`docs/STYLE.md`](docs/STYLE.md) in full first. It is the single source for how code is written here. Claude Code loads it automatically through `.claude/rules/style.md`.
- **Changing the request path (BFF proxy, `api-client`), providers, dialogs, i18n or theming:** read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) first.
- `features/example/` is the reference implementation; `package.json` lists every script.

## Fixing a defect

Zoom out before you change a line, whether the session starts with the bug or you hit it mid-task:

1. **Reproduce it.** Get a check that goes red on this defect: a failing test, a curl, a script. The `diagnosing-bugs` skill has the full loop.
2. **Find where it is born,** not where it shows. Trace the value or behaviour back through the layers in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) to the first place it goes wrong.
3. **Name the owner:** the layer or module that should hold the rule that failed ([`docs/STYLE.md`](docs/STYLE.md) says where each kind of rule lives).
4. **Look for siblings.** Search for the same pattern elsewhere; one cause often shows up in several places.
5. **Tell the human in a few lines:** symptom → where it is born → owner → siblings → the fix you propose and at which level. Wait for a yes.
6. **Fix it at the owner,** turning the red check green. If the fix changes a contract, a schema or a domain rule, or reaches the siblings, it is a job: start `/recipe`.

## Done means

- `bun lint`, `bunx next typegen && bunx tsc --noEmit` and `bun test` pass. Typed routes need the generated types before `tsc` sees them.
- UI changes are checked with real screenshots at mobile and desktop widths.

## Commits and pull requests

- Conventional Commits with `init · feat · fix · refactor · chore · docs · style · test`. The subject is imperative and at most 90 characters; details go in the body.
- Commit as often as you like while working. Before push and PR, consolidate to 4–6 commits, never more than 8, so the PR reads as a short story instead of a long tail:
  - docs apart from code; code in dependency order (types/constants/schema/service → hooks → components → route);
  - each commit passes lint and tests on its own;
  - every review fix folded into the commit it belongs to.
- Before opening the PR: rebase onto the current remote base, then push with `--force-with-lease`.
- Stage by explicit path, so local files such as `.claude/settings.local.json` stay out.
- Open PRs against the default branch, never against another feature branch.
- Merge with a merge commit (`gh pr merge --merge`), not rebase or squash, so each PR stays visible as its own branch. With several PRs, merge one, rebase the next onto the updated default branch and push `--force-with-lease`, wait for CI, then merge it the same way.

## brigade

```
inbox: gh
style: docs/STYLE.md
lang: th
```
