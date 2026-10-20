# Amp API fixture

`amp-plugin.d.ts` is the **complete, unmodified declaration**, extracted from
`amp plugins show-docs` on Amp CLI `0.0.1792470027-g8c393d` (2026-10-20).
Source: https://ampcode.com/docs/plugin-api. It is not a hand-written mock.
SHA-256: `82c3f3603777c6a8e722e30a550cb7be08521860bcb9e2eb4a48ff2ee6c8c239`.
The fixture is development-only; it is not shipped in the plugin archive.

Run `node amp/scripts/check-api.mjs` with that CLI to compare the local contract.
Run `npm --prefix amp run typecheck` to check the plugin
against it with TypeScript 5.9.3. The runtime contract harness is a separate,
fail-closed simulation, not a substitute for these types. `environment.d.ts`
declares the observable-interop `Symbol.observable` used by the full CLI
declaration but missing from TypeScript's standard library; it does not change
any Amp type. TypeScript runs as a pinned development
tool through npm exec, not as a runtime or project dependency; its first use
needs registry access. CI needs no Amp credentials or installed Amp CLI.

When updating supported Amp versions, capture and review the **whole** new
declaration, record its CLI version and digest here, and rerun types, contract
tests and the authenticated smoke checklist. Do not add casts or trim the
declaration to conceal incompatibility.
