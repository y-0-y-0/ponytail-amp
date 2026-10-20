# Changelog

This changelog covers the independent Amp fork, not releases of upstream Ponytail.

## 0.1.0-alpha.1 — experimental, unreleased

- Establishes the maintainer-confirmed `ponytail-amp` Amp directory plugin from Ponytail 5.3.2, based on upstream commit `09c434ab73ca43761c5d8b0c5d341926c2fba710`.
- Documents six explicitly registered Ponytail skills and the **Ponytail Amp** palette controls for `lite`, `full`, `ultra`, and `off`.
- Implements thread-local, in-memory levels, replay deduplication and a verified archive lifecycle with checksums and provenance.
- Adds unit, simulated-contract and packaging tests, strict checks against the complete pinned Amp API, and an unprivileged build-only CI workflow. Disables upstream npm publication for this fork.
- No cost, quality, speed, or reliability gain is claimed for Amp.
- Authenticated Amp loading, six qualified skill lookups, automatic full guidance, a boundary regression fix and a known-defect review were exercised from an installed archive. Real CLI interface tests also passed for `lite/full/ultra/off`, no active thread, two interleaved threads, explicit help in `off`, and reload resetting both threads to `full`. Amp remained in `medium`; Ponytail `ultra` never selected Amp Ultra. No release or package has been published.
