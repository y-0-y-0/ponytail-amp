---
name: ponytail-debt
description: "Collects deliberate shortcut comments into a debt ledger, including older Ponytail markers. Use when asked to list shortcut debt, find deferred work, or see what a codebase deliberately simplified."
license: MIT
---

# Ponytail Debt

Collect deliberate shortcuts into one ledger so a deferral cannot quietly become permanent. This is a read-only report unless the user asks to save the ledger.

## Scan

- By default, search the repository for comment markers, skipping `.git` and files ignored by `.gitignore`:

  ```sh
  git grep --no-index --exclude-standard -nE '(#|//|/[*]) ?(shortcut|ponytail):'
  ```

  Add comment prefixes used by the repository's language when needed.
- If the user names a different marker word, search for that word instead.
- Treat each hit as a row only when it is a deliberate deferral. Skip unrelated prose, such as a note about a keyboard shortcut.

## Ledger

Write one row per marker, grouped by file:

`<file>:<line>, <what was simplified>. ceiling: <the limit named>. upgrade: <the trigger to revisit>.`

Take the ceiling and trigger from the comment. If a marker names no upgrade path or trigger, add a `no-trigger` tag; those are at risk of silently rotting. Add an owner only if asked, using `git blame -L<line>,<line>`.

End with `<N> markers, <M> with no trigger.` If nothing is found, say `No shortcut debt. Clean ledger.`

If the user asks to persist the report, write the ledger to the requested location (or ask where if none is given). Otherwise, read and report only.

Adapted from Ponytail 5.3.2, Copyright (c) 2026 DietrichGebert, under the MIT License.
