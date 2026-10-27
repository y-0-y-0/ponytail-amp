# Amp API fixture

`amp-plugin.d.ts` is the **complete, unmodified declaration**, extracted from
`amp plugins show-docs` on Amp CLI `0.0.1793026252-g165dd4` (2026-10-26).
Source: https://ampcode.com/docs/plugin-api. It is not a hand-written mock.
SHA-256: `4257283873bfd81d777e1fa4a523cccb275b07064ea818a9f8ba34d6ccabf765`.
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

The October 26 update removes custom-agent subagent-pin declarations and adds
confirmation-dialog fields and tool cancellation signals, as well as a JSDoc
clarification. None changes the members used by this plugin: `registerSkill`,
`registerCommand`, command `thread.id`, `ui.select`/`ui.notify`, or `agent.start`
event IDs and the returned `message.content`/`message.display`. The exact snapshot
gate remains unchanged; compilation is separate from actual-host verification.

When updating supported Amp versions, capture and review the **whole** new
declaration, record its CLI version and digest here, and rerun types, contract
tests and the authenticated smoke checklist. Do not add casts or trim the
declaration to conceal incompatibility.
