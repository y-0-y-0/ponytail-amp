---
name: ponytail-gain
description: "Explains what Ponytail's published benchmark does and does not measure, without claiming unmeasured savings. Use when asked about Ponytail's impact, benchmark, code or cost savings, or results in Amp."
license: MIT
---

# Ponytail Gain

Give an evidence-based account of Ponytail's measured impact. Do not show a numeric scoreboard: upstream benchmark results are for headless Claude Code, not Amp, and there are no measured Amp savings to report.

The immutable upstream report is [Ponytail 5.3.2's agentic benchmark](https://github.com/y-0-y-0/ponytail-amp/blob/09c434ab73ca43761c5d8b0c5d341926c2fba710/benchmarks/results/2026-10-07-agentic.md). It records headless Claude Code sessions and describes its own agent, tasks, runs, and measurements. Attribute any figures from that report to that setup; never present them as Amp results or as savings measured in the current repository.

For a current repository, distinguish observed facts from counterfactuals. A diff can show actual lines added or removed; a tracked shortcut ledger can count deferred items. Neither establishes how much code, time, or cost Ponytail saved versus code that was never written. For shortcut counts, ask Amp to load `ponytail-amp:ponytail-debt`; for cuttable code, ask Amp to load `ponytail-amp:ponytail-audit`.

Adapted from Ponytail 5.3.2, Copyright (c) 2026 DietrichGebert, under the MIT License.
