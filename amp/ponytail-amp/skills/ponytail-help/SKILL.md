---
name: ponytail-help
description: "Shows Ponytail Amp's level controls, registered skills, and limits. Use when asked how to use Ponytail Amp, which skills it provides, or what its controls do."
license: MIT
---

# Ponytail Amp Help

Ponytail Amp is an independent, experimental Amp directory plugin, provisionally named `ponytail-amp`.

## Controls

Open Amp's command palette and choose category **Ponytail Amp**:

- **Set level** selects `lite`, `full`, `ultra`, or `off`.
- **Show level** shows the selected level.

`full` is the default. Level choice is independent for each thread in the plugin process's memory only. Reloading the plugin or restarting Amp resets all selected levels to `full`. With no active thread, both commands report that explicitly and change nothing. `off` stops future automatic instruction injections; it cannot erase conversation history. Explicitly loaded skills remain available while `off` is selected.

## Registered skills

Invoke any skill by asking Amp to load its qualified name:

| Qualified name | Purpose |
|---|---|
| `ponytail-amp:ponytail` | Smallest complete development approach. |
| `ponytail-amp:ponytail-review` | Reviews a change for correctness, safety, load, tests, speed, and leanness. |
| `ponytail-amp:ponytail-audit` | Audits a repository for risks and removable or improvable code. |
| `ponytail-amp:ponytail-debt` | Collects deliberate shortcuts into a ledger. |
| `ponytail-amp:ponytail-gain` | Explains benchmark evidence and its limits. |
| `ponytail-amp:ponytail-help` | Shows this reference. |

## Limits

There are no slash commands, environment or config mode files, other-host hooks, band, board, telemetry, metrics, subagent propagation, or controls for switching Amp's agent or model. `ultra` changes instructions only; it does not switch Amp's agent or model.

Adapted from Ponytail 5.3.2, Copyright (c) 2026 DietrichGebert, under the MIT License.
