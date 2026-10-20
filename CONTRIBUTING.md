# Contributing

Ponytail Amp is an independent, experimental fork. Keep contributions scoped to the Amp adapter and its public documentation unless a maintainer explicitly approves a broader change. Do not imply official Amp, Sourcegraph, or upstream Ponytail affiliation. There is no public npm distribution for this fork.

## Upstream relationship

The Amp adaptation is based on Dietrich Gebert's MIT-licensed Ponytail 5.3.2 at `09c434ab73ca43761c5d8b0c5d341926c2fba710`. Preserve the upstream copyright and MIT notices in derived code and skills. Changes to behavior or guidance should be reviewed against the upstream version; do not imply that upstream endorses this fork.

When considering an upstream sync, first inspect `git remote -v` and confirm `origin` is `https://github.com/y-0-y-0/ponytail-amp` and `upstream` is `https://github.com/DietrichGebert/ponytail.git`. Fetch upstream, then read the commits and file diff from the pinned baseline. Do not automatically merge or cherry-pick upstream changes. Port only the changes that are relevant to this independent Amp fork, preserve support for other hosts, and inspect how copied or adapted skills and `AGENTS.md` guidance would interact. Re-run the Amp regression tests and the publishing review before proposing a release.

After verifying remotes, inspect the next upstream baseline without assuming a branch name:

```sh
git fetch upstream HEAD
git log --oneline 09c434ab73ca43761c5d8b0c5d341926c2fba710..FETCH_HEAD
git diff 09c434ab73ca43761c5d8b0c5d341926c2fba710 FETCH_HEAD -- AGENTS.md skills hooks/ponytail-instructions.js hooks/ponytail-config.js
```

Record an accepted new baseline in `amp/ponytail-amp/package.json`, the changelog
and provenance documentation. Review the full upstream generator/config diff
for side effects before adapting any logic; do not import that generator into Amp.

## Amp ownership boundaries

- `amp/ponytail-amp/index.ts`: documented PluginAPI registration, palette and `agent.start` integration only.
- `state.ts`: plugin-instance maps keyed by thread ID, levels and thread/message replay deduplication. No files or persistent global mode.
- `instructions.ts`: pure instruction generation from explicitly ported Ponytail principles. It imports no upstream configuration, fallback reader, history, or host hooks.
- `skills/`: six Amp-specific packages; skill invocation does not change plugin state. Help/gain deliberately differ from upstream host promises and benchmarks.
- `amp/scripts/`: offline archive building/verifying and an explicitly opted-in authenticated CLI test; none run when the plugin loads.

The source directory stays outside `.amp/plugins`, so developing or testing it
does not automatically enable it in the implementation thread. Tests load it
through a simulated host or copy the built archive into a disposable Git project.

## Before a change

- Read the affected source, callers, tests, packaging metadata, and docs. Keep the compatibility boundary pinned to the full Amp CLI API declaration described in [`amp/TESTING.md`](amp/TESTING.md).
- Prefer a small change and one focused test for non-trivial behavior. Do not remove validation, error handling, security, or accessibility.
- Do not add plugin runtime dependencies, downloads, settings, model or permission changes, or `AGENTS.md` installation without explicit approval.
- Do not claim cost, quality, speed, or reliability gains for Amp without an Amp-specific, reproducible measurement.
- If changing release contents or build metadata, update the manifest and installation instructions together and re-audit the archive contents and checksum process.

## Checks

Run `npm --prefix amp test`, `npm --prefix amp run typecheck`, and the manual smoke checklist in [`amp/TESTING.md`](amp/TESTING.md). With the pinned CLI installed, `node amp/scripts/check-api.mjs` compares its complete declaration with the fixture. The upstream checks remain `npm test`, `node scripts/check-rule-copies.js`, `node scripts/check-versions.js`, and `python3 benchmarks/agentic/run.py --selftest`; upstream correctness tests also need Python `pandas`. There is no repository-wide linter or formatter configured. Do not call an unrun check passing.

Before submitting a release-related change, use the human approval checklist in [`amp/RELEASING.md`](amp/RELEASING.md). No push, tag, or release publication is authorized by a documentation change or by this checklist alone.
