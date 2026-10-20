# Ponytail Amp testing

## Status and environment

The tested local environment is Linux x64 (GitHub Codespace), Node 24.21.0, GNU tar 1.35 and Amp CLI `0.0.1792470027-g8c393d` on 2026-10-20. No macOS, Windows, orb, or hosted personal/workspace installation claim is made.

| Layer | Observed result |
|---|---|
| Unit | Two tests: three intensities/off, independent thread state and replay IDs. |
| Simulated host contract | Four tests: six registrations, both palette controls, transitions, no active thread, cancellation, async thread isolation, off and reload. Unexpected host capabilities throw. |
| Packaging | Reproducible archives, full resources/license, hash/inventory checks, extracted-module load, documented project/machine lifecycle, occupied destinations and tampering. |
| API | Complete installed CLI declaration matches the pinned fixture byte-for-byte; TypeScript 5.9.3 strict check passes without API casts or `skipLibCheck`. |
| Authenticated CLI | Archive installed in a fresh Git project; plugin/listener/two commands listed; all six qualified skill lookups pass; automatic full guidance, coding regression and known-defect review exercised. |
| Authenticated interactive UI | Real CLI TUI, driven through a PTY: all four levels, no-thread commands, two interleaved threads, explicit help in off, hidden injection and plugin reload pass. Web UI and identical-event replay were not exercised. |
| Other hosts | Root: 144/144 and Pi: 30/30 pass after supplying the existing CI dependency pandas in an isolated test venv. Rule copies, version consistency and agentic benchmark selftest pass. |
| GitHub CI | Both native Amp and inherited test workflows passed for the native-port commit; exact run links and environment follow below. |

The exported authenticated coding thread contains exactly one automatic `[Ponytail Amp — level: full]` text block with `hidden: true` in its first user message, and records `ponytail-amp:ponytail-review` in activated skills. The task fixed only the scratch copy of `shipping.mjs` (`> 50` → `>= 50`) and passed the unchanged boundary test. It identified a concrete arithmetic-mean failure, without modifying the review fixture. These are functional smoke checks, not evidence of cost or quality gains. Single-platform coverage and the remaining scope limits keep this an experimental pre-release.

## Authenticated CLI interface results — 2026-10-20

The installed archive was copied into a fresh disposable Git project. The actual
interactive CLI ran with `--executor=local --visibility=private --no-ide`, using
normal existing authentication. A PTY driver sent keyboard input to Amp's real
command palette and selection dialogs; it did not replace PluginAPI, invoke
mock handlers, change settings, or copy credentials. No human interaction was
needed. Terminal output, keyboard actions and private thread exports were kept
outside the distributable source.

| Check | Observed result |
|---|---|
| No active thread | Both palette commands notified explicitly; Set level did not open a picker or change a global value. |
| Thread A | User-turn injection sequence: `full`, `lite`, `lite` after switching back, no automatic block in `off`, then `full` after reload. |
| Thread B | User-turn injection sequence: `full`, `ultra`, `ultra` after switching back while A was off, explicitly selected `full`, then `full` after reload. |
| Explicit skill in off | `ponytail-amp:ponytail-help` loaded and described the two palette controls. Earlier injected instructions remained in the exported history. |
| Reload | With A off and B changed to lite, running `plugins: reload` reset both to full in the same TUI process. |
| Injection | Each enabled turn had exactly one automatic block with `hidden: true`; the off turn had none. The terminal transcript did not display these hidden instructions. |
| Amp mode | Both exported threads stayed in `medium`, including the turns using Ponytail ultra. |

These checks do not establish Web UI behavior, compaction behavior, subagent
propagation, or replay of an identical event ID. Duplicate-ID replay remains a
unit/simulated-contract test; it was not manufactured through undocumented host
APIs and must not be described as a real UI replay test.

The first root test run failed because pandas was absent, not because of an Amp
change. Repeating it with Python 3.14.2 and pandas 3.0.6 in a disposable venv
passed all 174 root/Pi tests; no project dependency or global Python installation
was changed. The inherited CI then passed on Ubuntu 24.04.5 with Node 22.23.3,
Python 3.12.15 and pandas 3.0.6. The native Amp CI used Node 24.21.0.

## Remote CI results — 2026-10-20

For the native-port commit
[`a5a8738`](https://github.com/y-0-y-0/ponytail-amp/commit/a5a873830a14096d43a0f575a585f8cde5e6fdc3),
both [Amp CI](https://github.com/y-0-y-0/ponytail-amp/actions/runs/39389446047)
and [inherited CI](https://github.com/y-0-y-0/ponytail-amp/actions/runs/39389446039)
completed successfully. Amp CI ran the strict type check, all seven Amp tests,
archive build and workflow-artifact upload without Amp credentials. Inherited
CI passed all 144 root and 30 Pi tests, rule-copy/version checks and the agentic
benchmark selftest. This is an observation for that exact source commit, not a
claim that later commits pass; check Actions for the exact publication candidate.
Workflow artifacts are not a public release or a package publication.

## Automated checks

Run the independent layers (no Amp login needed):

```sh
npm --prefix amp test
npm --prefix amp run typecheck
# Optional, with the supported CLI installed:
node amp/scripts/check-api.mjs
```

The contract/type check must use the full pinned Amp CLI API declaration captured at `amp/types/amp-plugin.d.ts`, through the repository's TypeScript tool. Do not substitute an incomplete hand-written API shape or infer compatibility from successful compilation against another CLI version. Record the exact declaration revision and tool version.

Build and inspect the package using the specified command:

```sh
node amp/scripts/build.mjs <output-directory>
```

Replace the placeholder with a real output directory. Inspect the archive file list before extraction, run its `verify.mjs`, and verify the installed plugin copy with `--plugin-only`. For published assets, also verify the external `SHA256SUMS` file with `sha256sum -c`; checksum verification is not signature verification. The plugin itself has no runtime dependency or runtime download requirement.

## Opt-in authenticated CLI integration

With Amp already authenticated normally, first build, extract and verify the archive.
Then run this from the source repository, with a fresh test-directory path whose
parent exists:

```sh
node amp/scripts/smoke.mjs <extracted-bundle> <new-test-directory>
```

This runs the installed CLI, creates one private test thread (normally archived
by execute mode), and may consume inference credits. It does not run in CI.
It never copies credentials or logs in on your behalf. Missing authentication,
unavailable services or failed checks are errors, not skipped passes. It leaves
the disposable Git workspace, JSON transcript and before/after logs for review;
those files may contain account metadata, so keep them private. It uses the
existing Amp profile; other installed plugins can affect the result. Review the
known-defect finding in the transcript manually. This script verifies only the
CLI subset, not interactive level/off/reload behavior.

## Manual authenticated UI smoke test

Use a disposable Amp workspace and an authenticated Amp CLI at the stated target version. Capture the environment and observations; do not report a pass without actually running each step.

1. **Load:** install the built local directory plugin by the documented manual procedure, reload via the verified palette entry **`plugins: reload`**, and confirm Amp loads the plugin without startup errors.
2. **Palette:** confirm category **Ponytail Amp** exposes titles **Set level** and **Show level**. Confirm Show level identifies the active thread, chosen level, and in-memory scope.
3. **Six skills:** ask Amp to load each exact qualified name: `ponytail-amp:ponytail`, `ponytail-amp:ponytail-review`, `ponytail-amp:ponytail-audit`, `ponytail-amp:ponytail-debt`, `ponytail-amp:ponytail-gain`, and `ponytail-amp:ponytail-help`. Confirm they resolve as skills; do not require slash-command syntax.
4. **Levels and off:** set each of `lite`, `full`, `ultra`, and `off`; verify the selected level is reported for the current thread. Confirm `full` is the default in a fresh thread. Confirm `ultra` does not select Amp Ultra or change the agent/model. With `off`, confirm future automatic guidance stops while prior history remains and an explicitly loaded skill can still be requested.
5. **Thread isolation:** open two threads, set different levels, then interleave prompts. Confirm each thread retains its own selected level during the current plugin process and that one thread's setting does not affect the other.
6. **Reload/reset:** change a thread away from `full`, reload the plugin or restart Amp, then confirm the level resets to `full`. Reopening in the same live instance retains its level; a new process or reload resets levels and duplicate tracking. History does not restore them.
7. **Injection visibility and deduplication:** confirm the automatic `agent.start` instruction is hidden from visible chat, and confirm a repeated event with the same thread and message IDs does not inject twice in that plugin instance. Treat compaction, history replay, and reopened-thread behavior as unverified beyond this explicit case.
8. **Coding regression:** in a disposable coding task, make a small requested change and check that the plugin's guidance does not block normal work, that tests/checks are proportionate, and that no settings, model, permissions, or `AGENTS.md` files were changed by the plugin.
9. **Known-defect review:** run `ponytail-amp:ponytail-review` against a controlled change with a documented known defect and record whether it is identified accurately. Use copies of `amp/fixtures/coding/` and `amp/fixtures/review/`, never edit the fixture originals. The coding test is intentionally red at the inclusive 50 threshold. The review bug divides by `length - 1`: `[2,4]` should average to 3, not 6. The fixture tests are not part of the normal green suite.
10. **Limitations:** explicitly check that the plugin makes no claim of subagent instruction propagation, no global persistent level, and no interaction with or removal of other Ponytail or `AGENTS.md` instructions.

Record failures as failures and unresolved cases as not checked. Do not report cost or quality gains based on this smoke test.
