---
name: ponytail-review
description: "Reviews a code change for correctness, security, load, missing tests, speed, and unnecessary complexity. Use when asked to review a diff, commit, branch, pull request, or changed files."
license: MIT
---

# Ponytail Review

Review a change like the senior developer who will be paged when it breaks. Order findings by correctness, safety, behavior under expected load, tests, speed, then leanness. Give the full report the user asked for; this skill lists findings and changes no code.

## Understand the change

- Review what the user names: uncommitted or staged changes, a branch, a pull request, or files. If nothing is named, review uncommitted changes, or the last commit when there are none.
- Read the diff and the code it touches: callers of changed functions, functions they call, tests, and README.
- Trace the real flow: where data comes in, what is stored, and what goes out.
- Changes to a signature, return value, or behavior can break untouched code. Find every caller.
- Find expected load in the repository (README or deploy config): one person running a script, or many users and processes. Judge scale against that and state the assumption.

## Look for

1. **Bugs:** wrong results, crashes, missed edge cases (empty, zero, last item, rounding, time zones), broken callers, or a fix made in one caller while the shared function remains broken.
2. **Risks:** security holes (injection, weak randomness, secrets, missing checks on user input) and data loss (swallowed errors, wrong write order, missing transactions).
3. **Scale:** check-then-write races, work repeated by every process, unbounded memory or lists, a query per item, quadratic work on large input, or per-process state that must be shared.
4. **Missing tests:** risky new logic (a branch, parser, money, security, data writes, or bug fix) without a test that fails when it breaks. One useful test, not coverage for its own sake.
5. **Speed:** report large slowdowns as problems. Treat small wins, such as work repeated in a hot loop, as suggestions only when relevant.
6. **Leanness:** identify code that should not exist or should be smaller:
   - delete dead code, unused options, and speculative features;
   - reuse an existing helper (name its path);
   - use standard-library or platform features instead of a new dependency for a few lines;
   - remove abstractions with one implementation or config nobody sets;
   - merge near-copies that must change together;
   - split functions doing unrelated jobs only when that makes them easier to read or test, not by line count or into pointless helpers.

## Verify each finding

- Every finding needs a concrete case: this input or situation causes this wrong result. No case, no finding.
- Re-read the lines. Confirm the caller exists, the value can really be empty, and supposedly unused code has no references.
- A `shortcut:` (or older `ponytail:`) comment naming a limit is a deliberate choice, not a finding, unless expected load already crosses it.
- Propose the smallest fix that works; prefer deleting code. Add no layer, framework, or config the problem does not need.
- Report no style taste, vague worry, or unsupported “consider” suggestion.

## Report

Use short, plain English and explain a technical term the first time it appears. Start with `What this change does:` in two or three sentences.

Group findings by severity, omitting empty groups:
- **Must fix:** bugs, security, data loss, or breakage at expected load.
- **Should fix:** risky code without a test, real slowness, duplication, mixed responsibilities, or code that should not exist.
- **Nice to have:** small speed-ups or simplifications.

Number findings across groups so the user can refer to them. Report at most 20; if smaller findings were left out, say how many. Each finding has these four parts, one or two short sentences each:

1. **Orders land on the wrong day** (`billing/close_day.py:L40-52`)
   - **What this is:** At midnight this job closes the day and bills that day's orders.
   - **Problem:** It uses the UTC server date, so an order placed at 00:30 in Berlin is billed on the day before.
   - **Fix:** Compute the date once in the shop's time zone: `datetime.now(ZoneInfo("Europe/Berlin")).date()`.
   - **If we skip it:** Late orders show the wrong date, and accounting fixes them by hand.

End with `Verdict: Ship.` or `Verdict: fix 1 and 3 first.` Add `Lean: -<N> lines possible.` when leanness findings exist, and `Not checked:` when something important could not be checked.

If no findings: start with `What this change does:`, then say `Looks good. Ship.` and state what you checked.

Adapted from Ponytail 5.3.2, Copyright (c) 2026 DietrichGebert, under the MIT License.
