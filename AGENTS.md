# AGENTS.md

Next.js frontend template. Talk to the human in Thai; write files, commits and PRs in English.

## Before editing

- **TS, TSX or CSS changes/reviews:** read [docs/STYLE.md](docs/STYLE.md) and the references triggered by the affected area. Claude Code loads the core through `.claude/rules/style.md`.
- **Request path, providers, view states, dialogs, i18n or theming:** read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), the current architecture source.
- Use `features/example/` as the working implementation; inspect `package.json` for commands.
- Inspect callers, tests and boundaries before editing; preserve unrelated user changes.

## Defects and scope

Reproduce the defect with a failing check, trace it to its first incorrect value/behavior, identify the responsible owner and search for siblings. Explain the cause and fix briefly, then proceed within already-authorized scope. Fix the owner and turn the check green.

Get approval before expanding into a changed contract, schema or domain rule; use `/recipe` for that design work when available. A routine authorized fix does not need a second yes. Verify sibling fixes fit the agreed scope.

## Completion

- Run `bun lint`, `bunx next typegen && bunx tsc --noEmit` and `bun test`. Typed routes need generated types before `tsc`.
- Check UI changes with real screenshots at mobile and desktop widths.
- Report the result, checks run and material limitations. For documentation-only changes, check affected links and instruction consistency; application checks are unnecessary unless behavior/config also changed.

## Git and PRs

- Work on an existing feature branch. From `main`, fetch the remote default branch and create a feature branch from that ref, preserving local changes. This template's default is `main`; never commit or push directly to it.
- Stage explicit paths so local settings stay out. Use Conventional Commits (`init`, `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`), with an imperative subject up to 90 characters.
- Make a few complete, independently verifiable commits by concern. Separate docs from runtime code when independently reviewable; order dependent changes coherently and fold review fixes into the relevant commit. No fixed commit count.
- Before the PR, rebase onto the current remote default branch; update the feature branch with `--force-with-lease` when rewriting pushed history.
- Open PRs against the default branch. Merge with a merge commit (`gh pr merge --merge`). With multiple PRs, merge one, rebase the next onto the updated default, update with `--force-with-lease`, and wait for CI before merging it.

## Documentation

Before adding Markdown, name its reader/task, entry point, unique knowledge, owner
and update trigger. Extend an existing source when a new file would merely repeat
code, config or another guide. Keep routine plans/audit reports in the existing
issue/PR unless a durable record is needed. Closed-job records explain history;
they do not override the current rule sheet. Links alone are not proof of use.

## brigade

```
inbox: gh
style: docs/STYLE.md
lang: th
```
