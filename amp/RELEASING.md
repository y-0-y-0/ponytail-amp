# Releasing Ponytail Amp

This is a human-operated checklist for the confirmed `ponytail-amp` distribution. It is not authorization to publish. **Permission to commit and push source for CI does not authorize creating or pushing tags, attaching release assets, publishing a release or package, or publishing hosted plugins. Obtain separate approval for the specific publication.** No npm publication is part of this project.

## Release gates

1. Confirm the intended version and source baseline. For the first alpha, record upstream Ponytail 5.3.2 at `09c434ab73ca43761c5d8b0c5d341926c2fba710`, and confirm the fork remote and upstream remote before describing provenance.
2. Review `git diff` and every intended release file. Confirm the archive contains only `ponytail-amp/`, `INSTALL.md`, `verify.mjs`, `BUILD.json`, and `MANIFEST.json`; confirm `INSTALL.md` is the plugin README copied verbatim. Keep the external `SHA256SUMS` outside the archive.
3. Build with `node amp/scripts/build.mjs <output-directory>` on the first-delivery target: Linux x64, Node 24, GNU tar. Replace the placeholder with a real output directory. Inspect the archive listing before extraction and verify it using the delivered verifier. Do not claim the build passed unless it was run on the stated environment.
4. Run the Amp unit, contract, and package tests with `npm --prefix amp test`. Type-check against the full pinned CLI API captured in `amp/types/amp-plugin.d.ts` using the repository's TypeScript tool. Run every manual check in [`TESTING.md`](TESTING.md), including the authenticated Amp smoke test; record the exact CLI version and evidence. The target CLI version for the initial delivery is `0.0.1792470027-g8c393d`.
5. Review all changes to adapted or copied upstream code and skills. Preserve MIT and author notices, verify there are no accidental runtime dependencies or download steps, and confirm no changes to Amp settings, models, agents, permissions, or `AGENTS.md` installation.
6. Check that public docs state the experimental status and do not overstate platform compatibility, results, or security. Check `SECURITY.md` and confirm the reporting route is accurate.
7. Produce and verify `SHA256SUMS` separately from the archive. A checksum is not a signature; do not describe it as proof of publisher identity. Confirm no release URL or asset is published in docs until one exists.
8. Obtain explicit human approval for the exact commit, tag, archive, checksum file, release text, and publication destination. Only then may the human perform the approved push/tag/release steps.

## Current status

The local archive, lifecycle tests and complete-API type check pass. Authenticated loading, skill discovery, automatic full guidance, a coding regression and known-defect review were exercised. Real CLI interface tests passed for all four levels, no active thread, two interleaved threads, explicit help in off and reload resetting both threads. See `TESTING.md` for the evidence boundary. Treat this as an **experimental pre-release**, not a stable release. The root npm package is private and the former publish workflow is build-only. The maintainer confirmed the public name and authorized source commits/pushes for CI; release, package, tag and hosted-plugin publication remain unauthorized. Before any publication, verify the exact commit's remote CI, rebuild from clean committed source, check final hashes and obtain approval for the exact destination and assets.
