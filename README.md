# Ponytail Amp

**Ponytail Amp** is an independent, experimental Amp plugin fork of the Ponytail development-guidance project. Its confirmed public distribution name is `ponytail-amp`; the first alpha is `0.1.0-alpha.1`.

This is not an official Amp product, an official Ponytail release, or affiliated with Sourcegraph, Amp, or Dietrich Gebert. The source fork is [y-0-y-0/ponytail-amp](https://github.com/y-0-y-0/ponytail-amp). It was based on upstream [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) 5.3.2 at commit `09c434ab73ca43761c5d8b0c5d341926c2fba710`. Before the Amp port on 2026-10-20, the fork's `origin` and upstream HEADs were verified to be at that same commit. Upstream author and license attribution remain: Dietrich Gebert, MIT; see [LICENSE](LICENSE).

> **Experimental pre-release, not a stable release.** Installation from the archive, real Amp loading, six-skill discovery, a coding regression and known-defect review have been exercised. Authenticated CLI interface tests also passed for palette level changes, `off`, two interleaved threads and plugin reload. No release or package has been published.

## What it does

The plugin explicitly registers six Ponytail skills and injects a small development-guidance instruction at Amp's `agent.start` event. Choose `lite`, `full`, `ultra`, or `off` from Amp's command palette. `full` is the default for each thread. The plugin does not change Amp's settings, model, agent, or permissions, and does not install `AGENTS.md`.

`ultra` changes the guidance only; it never selects Amp Ultra. `off` stops future automatic instructions for that thread, but does not remove conversation history or disable explicit skill requests. Runtime state is in memory and resets when the plugin reloads, its process restarts, or the workspace switches to a different plugin instance. See the [plugin guide](amp/ponytail-amp/README.md) for behavior, limitations, and installation lifecycle instructions.

Load a skill by asking Amp to load its qualified name, for example: **“Load `ponytail-amp:ponytail-review` and review this change.”** The six names are `ponytail-amp:ponytail`, `ponytail-amp:ponytail-review`, `ponytail-amp:ponytail-audit`, `ponytail-amp:ponytail-debt`, `ponytail-amp:ponytail-gain`, and `ponytail-amp:ponytail-help`. Do not assume that these names are slash commands.

## Source and distribution

The plugin source directory is [`amp/ponytail-amp/`](amp/ponytail-amp/). Amp does not auto-discover that source directory: a built directory plugin must be installed explicitly. There is no npm distribution for this Amp fork. The legacy root npm manifest retains the upstream identity for compatibility but is now **private**, preventing npm publication. The former publication workflow only verifies and builds the Amp archive; it has no publishing credentials or release step. Existing other-host integrations are preserved, not newly certified.

The built archive is `ponytail-amp-0.1.0-alpha.1.tar.gz`, containing `ponytail-amp/`, `INSTALL.md`, `verify.mjs`, `BUILD.json`, and `MANIFEST.json`. `SHA256SUMS` is a separate checksum file, not a member of the archive. No public release asset or download URL is claimed here; use release assets only if and when they are actually published.

Build locally into a fresh directory:

```sh
node amp/scripts/build.mjs <output-directory>
```

Replace `<output-directory>` with a real directory. The verified build environment is Linux x64 with Node 24.21.0 and GNU tar 1.35. The plugin has no runtime dependency or download requirement. The archive records the version, source commit, dirty-worktree flag and file hashes; an uncommitted build is not represented as a clean release commit. See [testing status and checks](amp/TESTING.md).

For manual local installation, stop Amp first and follow the [copy, update, and uninstall procedures](amp/ponytail-amp/README.md). They have been tested from the archive in fresh project-local and simulated machine-local destinations, including refusal to overwrite existing directories. Project plugins live in `.amp/plugins` (in a Git project, the repository root); machine plugins live in `$HOME/.config/amp/plugins`, which is not persistent in an Amp orb. A hosted personal or workspace plugin is a separate route and is not tested, published, or a public URL installer for this project.

## Verification and project docs

- [Testing and manual smoke checklist](amp/TESTING.md)
- [Release approval checklist](amp/RELEASING.md)
- [Contributing](CONTRIBUTING.md)
- [Security reporting](SECURITY.md)
- [Changelog](CHANGELOG.md)
- [Archived upstream README](README.upstream.md) — retained with its original root-relative links and labeled as historical documentation.

No cost, speed, code-quality, or reliability gain is claimed for Amp. Upstream benchmarks were run in a different setup and are not Amp measurements.
