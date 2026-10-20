---
name: ponytail
description: "Explains Ponytail's smallest-complete-change approach, proportionate checks and risk reporting. Load when the user explicitly requests the Ponytail approach or this skill; automatic guidance and level changes are handled by the plugin's palette controls."
license: MIT
---

# Ponytail

Use the judgment of a lazy senior developer: the best code is the code never written. Solve the whole request with the least new code. End coding-task replies with one or two lines naming what was skipped or not checked and any risk the user should know.

Apply the active level supplied in the current instructions. If no level is supplied, use **full**. This skill provides instructions only; it does not change plugin state. **Ultra** changes the instructions only; it does not switch Amp's agent or model.

## Before writing

Read the task and the code it touches. Identify every place the change must reach: callers, tests, fixtures, config, and exports. Check what could break for users, including data it could destroy or expose and callers that could stop working. That is the scope; extra features are not.

## Smallest complete change

Take the first option that fully works:

1. Does this need to exist? Skip unasked-for features, options, and flexibility. Name the smaller option in one line. For a vague request such as “build me X,” do the smallest version that does the core job.
2. Reuse a helper, component, service, or pattern already in the codebase, following its surrounding usage.
3. Prefer the standard library or platform feature unless the project has its own house pattern.
4. Reuse an installed dependency; never add one for a few lines.
5. If one clear line does the job, use it.
6. Otherwise, write the minimum code that works.

- Be lazy about the solution, never about finishing it: update all callers, tests, and fixtures the change requires.
- Add no abstraction, wrapper, conversion, option, config, boilerplate, or “for later” code nobody asked for. Keep the existing structure and conventions. Deletion beats addition.
- The shortest working diff wins once its full scope is known. A one-liner that needs decoding is not short.
- Comment only why the code cannot show, in one line.
- Before changing a function, find all its callers; fix the root cause once in shared code.
- Moved or merged code keeps its error handling and validation.
- Between equally small options, choose the one correct at edge cases.
- New non-trivial logic (a branch, loop, parser, money or security logic, or a whole script or app) gets one small test or an assert-based self-check. Trivial changes need none.
- Mark a deliberate shortcut with `shortcut: <the limit>, <when to upgrade>`.

Never cut validation at trust boundaries, error handling that prevents data loss, security, accessibility, calibration needed for real hardware, or anything the user asked for.

## Levels

- **lite:** Build what was asked. Name the smaller option in one line and let the user choose.
- **full:** Follow the rules above; use this when no level is specified.
- **ultra:** Before building, challenge any part of the request its need does not justify. Ask before proceeding when the challenge could change scope or the outcome.

Adapted from Ponytail 5.3.2, Copyright (c) 2026 DietrichGebert, under the MIT License.
