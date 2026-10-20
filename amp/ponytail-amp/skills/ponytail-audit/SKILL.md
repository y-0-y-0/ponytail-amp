---
name: ponytail-audit
description: "Audits a repository or named area for bugs, security risks, scale failures, missing tests, slow paths, and removable or mergeable code. Use when asked to audit a codebase, review a whole repo, find bloat, or identify what can be deleted."
license: MIT
---

# Ponytail Audit

Audit the requested code like the senior developer who inherited it and will be paged when it breaks. Order findings by correctness, safety, behavior under expected load, tests, speed, then leanness. This is a report; change no code.

## Map first

- Audit what the user names: a folder, package, or whole repository. If nothing is named, audit the whole repository.
- Read the README, deploy and build config, dependency list, entry points (main, routes, handlers, jobs, CLI commands), and tests.
- Find expected load: one person running a script, or many users and processes. Judge scale against it and state the assumption.
- Trace main flows end to end: where data enters, what is stored, and what goes out. Read high-risk paths fully: user input, money, auth, data writes, background jobs, and anything shared between processes.
- In a large repository, go deep where a mistake costs most rather than file by file. State which parts you did not read.

## Look for

1. **Bugs:** wrong results, crashes, missed edge cases (empty, zero, last item, rounding, time zones), callers that disagree with a function, or the same rule applied differently.
2. **Risks:** security holes (injection, weak randomness, secrets in code, missing checks on user input) and data loss (swallowed errors, wrong write order, missing transactions).
3. **Scale:** check-then-write races, work repeated by every process, unbounded memory or lists, a query per item, quadratic work on large input, or per-process state that must be shared.
4. **Missing tests:** risky logic (a branch, parser, money, security, or data writes) without a test that fails when it breaks. One useful test, not coverage for its own sake.
5. **Speed:** report large slowdowns as problems. Treat small wins, such as work repeated in a hot loop, as suggestions only when relevant.
6. **Leanness:** identify code that should not exist or should be smaller:
   - delete dead code, unused options, flags, config, and speculative features;
   - reuse duplicate helpers, keeping one clear path;
   - use standard-library or platform features instead of a dependency for a few lines;
   - remove abstractions with one implementation, factories with one product, and pass-through wrappers;
   - merge near-copies that must change together;
   - split functions or classes doing unrelated jobs only when that makes them easier to read or test, not by line count or into pointless helpers.

## Verify each finding

- Every finding needs a concrete case: this input or situation causes this wrong result. No case, no finding.
- Before calling code unused, search the whole tree, including tests, fixtures, config, string references, and dynamic references.
- A `shortcut:` (or older `ponytail:`) comment naming a limit is a deliberate choice, not a finding, unless expected load already crosses it.
- Propose the smallest fix that works. Prefer deleting code. Add no layer, framework, or config the problem does not need.
- Report no style taste, vague worry, or unsupported “consider” suggestion.

## Report

Use short, plain English and explain a technical term the first time it appears. Start with `What this repo does:` in two or three sentences, including the load assumption.

Group findings by severity, omitting empty groups:
- **Must fix:** bugs, security, data loss, or breakage at expected load.
- **Should fix:** risky code without a test, real slowness, duplication, mixed responsibilities, or code that should not exist.
- **Nice to have:** small speed-ups or simplifications.

Number findings across all groups so the user can refer to them. Report at most 20; if smaller findings were left out, say how many. Each finding has these four parts, one or two short sentences each:

1. **Orders land on the wrong day** (`billing/close_day.py:L40-52`)
   - **What this is:** At midnight this job closes the day and bills that day's orders.
   - **Problem:** It uses the UTC server date, so an order placed at 00:30 in Berlin is billed on the day before.
   - **Fix:** Compute the date once in the shop's time zone: `datetime.now(ZoneInfo("Europe/Berlin")).date()`.
   - **If we skip it:** Late orders show the wrong date, and accounting fixes them by hand.

End with `Verdict:` and one line naming the first thing to fix or saying the repo is healthy. Add `Lean: -<N> lines, -<M> dependencies possible.` when leanness findings exist. End with `Not checked:` for parts not read or not run.

If no findings: start with `What this repo does:`, then say `Healthy. Nothing to fix.` and state what you checked.

Adapted from Ponytail 5.3.2, Copyright (c) 2026 DietrichGebert, under the MIT License.
