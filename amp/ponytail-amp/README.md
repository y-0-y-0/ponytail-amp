# Ponytail Amp plugin

`ponytail-amp` is the confirmed public name of an independent, experimental Amp directory plugin, version `0.1.0-alpha.1`. It adapts MIT-licensed Ponytail 5.3.2 from DietrichGebert/ponytail at `09c434ab73ca43761c5d8b0c5d341926c2fba710`. This fork is not affiliated with Amp, Sourcegraph, or the upstream project. The six skills and plugin implementation are shipped together; the plugin does not download runtime dependencies.

This directory is the plugin source, not an automatically discovered Amp plugin. The build places it inside the archive and copies this README verbatim to the archive root as `INSTALL.md`. The [experimental prerelease `0.1.0-alpha.1`](https://github.com/y-0-y-0/ponytail-amp/releases/tag/0.1.0-alpha.1), published on 2026-10-20 from source commit `3e6008249f528f298ed60a7f4cd6f4ce915be7ce`, includes the archive and `SHA256SUMS`. Later local source or documentation changes do not update those published assets or hosted installations.

## Use in Amp

The plugin registers these six skills explicitly: `ponytail`, `ponytail-review`, `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, and `ponytail-help`. Ask Amp to load the qualified skill name, for example:

> Load `ponytail-amp:ponytail-review` and review this change.

The other names are `ponytail-amp:ponytail`, `ponytail-amp:ponytail-audit`, `ponytail-amp:ponytail-debt`, `ponytail-amp:ponytail-gain`, and `ponytail-amp:ponytail-help`. This is a request to load a skill, not a claim that Amp exposes these as slash commands.

Open Amp's command palette and choose category **Ponytail Amp**:

| Palette title | Behavior |
|---|---|
| **Set level** | Select `lite`, `full`, `ultra`, or `off` for the current thread. |
| **Show level** | Show the selected level, thread ID, and in-memory scope. |

`full` is the default for each thread. A selected level is held in memory by thread ID for this loaded plugin instance; it is not a saved setting. Reloading the plugin, restarting Amp, switching workspaces, or switching to a new plugin process resets levels to `full`. If a command has no active thread, **Set level** reports that nothing changed; new threads still default to `full`. **Show level** reports that there is no global level when no thread is active.

The `agent.start` listener returns instructions in `message.content` with display disabled. That content is intended as hidden agent context, not a visible chat message. Repeated events with the same thread ID and message ID are deduplicated in memory. `off` prevents future automatic instructions but does not erase history or block explicit skill loads. `ultra` only intensifies the instructions; it never selects Amp Ultra or changes Amp's agent or model.

The plugin makes no Amp settings, model, agent, or permission changes and does not install or alter `AGENTS.md`. It does not remove or reconcile other copies of Ponytail guidance. If your workspace already loads Ponytail through `AGENTS.md`, another plugin, or project rules, instructions may be duplicated or conflict; review those sources deliberately rather than deleting them as part of this install.

### Scope limits

- Levels and duplicate-event tracking are process memory only. Reopening a thread in the same still-running plugin instance retains its level; another process or reload starts at `full`. History and compaction do not reconstruct state. There is no compaction hook or persistence guarantee for skill content; future `agent.start` turns receive the current guidance again when enabled.
- Duplicate tracking retains thread/message IDs until reload. Long-lived instances consume memory proportional to handled turns; no history or file contents are cached.
- The plugin does not promise injection into subagents. Its listener is tied to the event's thread; subagent propagation is not implemented or verified.
- `off` affects future automatic instruction injection only. It cannot remove earlier context, and explicitly requested skills remain available.
- Thread history and context are Amp-controlled; changing the level cannot rewrite them.
- The dated checks below cover this Amp directory plugin, including the personal hosted copy. They do not establish behavior for other Ponytail adapters, `AGENTS.md`, or every Amp client/executor combination.

## Manual local installation and lifecycle

These procedures were tested with the locally built archive; the prerelease linked above also provides downloadable assets. Use Bash on Linux, Node 24, GNU tar and `sha256sum`. Choose a fresh extraction directory, inspect the archive, and set the paths explicitly. No remote install script is executed:

```bash
archive=ponytail-amp-0.1.0-alpha.1.tar.gz
bundle="$PWD/ponytail-amp-extracted"
plugins=.amp/plugins
backup=.amp/ponytail-amp-backup
retired=.amp/ponytail-amp-uninstalled
sha256sum -c SHA256SUMS &&
tar -tzf "$archive"
```

Stop if verification fails. Inspect the file list before continuing with the next block. The checksum is checked again so a failed check cannot lead to extraction or execution of the delivered verifier. An existing extraction directory is refused.

<!-- extract -->
```bash
sha256sum -c SHA256SUMS &&
mkdir "$bundle" &&
tar -xzf "$archive" -C "$bundle" &&
node "$bundle/verify.mjs" "$bundle"
```

For a project install, run the copy commands from its repository root. To install on this machine instead, set these three variables before the same copy commands:

```bash
plugins="$HOME/.config/amp/plugins"
backup="$HOME/.config/amp/ponytail-amp-backup"
retired="$HOME/.config/amp/ponytail-amp-uninstalled"
```

Path meanings:

- `archive` points to the downloaded `.tar.gz` file, beside the external `SHA256SUMS` file; `bundle` points to the extracted archive root. The root contains `ponytail-amp/`, `INSTALL.md`, `verify.mjs`, `BUILD.json`, and `MANIFEST.json`.
- For a project install, `plugins` is `.amp/plugins`; for a machine install, use `$HOME/.config/amp/plugins` instead. Machine-wide plugin files are not persistent in an Amp orb.
- `backup` is `.amp/ponytail-amp-backup` for a project install, or a corresponding path under `$HOME/.config/amp/` for a machine install.
- `retired` is `.amp/ponytail-amp-uninstalled` for a project install, or a corresponding path under `$HOME/.config/amp/` for a machine install. Keep both backup and retired directories outside the scanned `plugins` directory.

Stop Amp before installation, update, or uninstall. Before extraction, verify the downloaded archive checksum with `sha256sum -c SHA256SUMS` from the directory containing the external `SHA256SUMS` file. This checksum detects accidental or malicious changes only when the checksum source is trusted; it is **not a signature** and does not authenticate who published the archive. Inspect the archive's file list with `tar -tzf "$archive"` before extracting it. Do not extract an archive whose list or checksum does not match the expected contents.

After extraction, verify the bundle with `node "$bundle/verify.mjs" "$bundle"` before copying. Verify the installed copy with `node "$bundle/verify.mjs" "$plugins/ponytail-amp" --plugin-only` after copying. The same pre-copy and post-copy checks apply to updates. If checksums are supplied with a release, verify them before install and again against the downloaded archive before relying on it.

<!-- install -->
```bash
mkdir -p "$plugins"
mkdir "$plugins/ponytail-amp" &&
cp -R "$bundle/ponytail-amp/." "$plugins/ponytail-amp/"
```

<!-- update -->
```bash
mkdir "$backup" &&
mv "$plugins/ponytail-amp" "$backup/" &&
mkdir "$plugins/ponytail-amp" &&
cp -R "$bundle/ponytail-amp/." "$plugins/ponytail-amp/"
```

<!-- uninstall -->
```bash
mkdir "$retired" &&
mv "$plugins/ponytail-amp" "$retired/"
```

The plain `mkdir` operations deliberately stop if a destination already exists; they do not overwrite an existing plugin, backup, or retired copy. Backups are never overwritten or deleted. Do not blindly rerun a failed update: inspect the plugin, backup, and output of verification first. To restore after an incomplete update, manually move the incomplete new plugin directory aside to a fresh path outside `plugins`, then move the saved backup back to `plugins/ponytail-amp`. Do not merge the two trees.

After an installation has passed the post-copy check, use Amp's verified palette command **`plugins: reload`** to load it. Do not reload before the copy and verification are complete.

For updates, first set `bundle` to the **newly extracted and verified archive**. Backups and retired copies preserve all local additions. After uninstall, restart/reload Amp to unregister the commands, event listener and skills; existing history is unchanged. Removing this plugin does not remove other Ponytail installations or project rules.

### Hosted personal plugins are a separate scope

Official documentation describes `amp plugins repositories` and `amp clone user-plugins`, followed by adding a complete plugin directory at the repository root and a reviewed commit/push. That push publishes to the personal scope across machines; workspace plugins have separate permissions and audience. On 2026-10-20, the prerelease was imported into `@y0y0`'s personal User Plugins at revision `73676eb37a8d4aa0d8e512bc0de067ce7deeb460`; all 12 served plugin files matched the release, and authenticated hosted TUI tests passed. This is not a workspace-wide publication or an automatic installation for other users. Do not run the local copy recipes against a managed cache or confuse `amp plugins add --target workspace` (local project) with a hosted workspace repository. A workspace share link is not this project's public distribution mechanism.

## Build and distribution status

The archive is `ponytail-amp-0.1.0-alpha.1.tar.gz` with `ponytail-amp/`, `INSTALL.md`, `verify.mjs`, `BUILD.json`, and `MANIFEST.json`; `SHA256SUMS` is external. Build it with `node amp/scripts/build.mjs <output-directory>`. `BUILD.json` records the source revision and whether local changes were present; `MANIFEST.json` identifies the exact delivered bytes. The legacy root npm manifest is private. CI builds a downloadable workflow artifact; the October 20 GitHub prerelease was published separately. No npm package was published. There is no automatic update or runtime download.

The local directory-plugin shape and `registerSkill` were checked against the CLI's complete types and an authenticated runtime load from the archive. The documentation and CLI help for URL installation do not establish that `amp plugins add` can fetch a GitHub directory and all its resources. No such route is promised; the published complete archive and explicit copy procedure are the public distribution format.

### Dated validation boundaries

- **2026-10-20, local executor in a Linux x64 Codespace:** Node 24.21.0, GNU tar 1.35, Amp CLI `0.0.1792470027-g8c393d`; archive lifecycle, real plugin loading, six qualified skills, automatic `full` guidance, coding regression and known-defect review. Real TUI tests covered all four levels, no active thread, interleaved thread isolation and reload. A later hosted-copy TUI test on Amp `0.0.1792483247-gc2739b` covered ten turns across two threads, nine hidden blocks, no automatic block in `off`, and all six explicit skills in `off`. Amp stayed in `medium`, including Ponytail `ultra`. [Publication and test history](https://ampcode.com/threads/T-01a15809-70d5-705a-9aae-82462114514e).
- **2026-10-26, unchanged personal hosted copy:** in Debian 12 x64, Node 26.12.1, a real TUI with a local executor and Amp `0.0.1793026252-g165dd4` repeated the levels/off/six-skills/isolation/reload checks: nine turns, eight hidden blocks, mode `low` throughout. One separate orb-executor turn (exported Amp version `0.0.1793027107-g8f0dee`) showed one hidden `full` block, but did not establish orb controls, reload, isolation or remote file identity. Running a local executor inside an orb is not the same as using Amp's orb executor. [Independent audit and evidence](https://ampcode.com/threads/T-01a178ba-a7b5-7100-aa11-8f3ba892d965).

**Known limitation — TUI controlling an orb, 2026-10-26:** with TUI `0.0.1793026252-g165dd4` and orb host `0.0.1793029714-gf0daba`, the palette confirmed `off`, `lite` and `ultra`, but each following exported turn still contained one hidden `full` block. The same mismatch occurred after loading an isolated project copy with unchanged runtime code. Separate client/executor plugin instances were observed; the routing cause is not established. Six explicit skills resolved, but this does not prove loading in an effectively disabled orb. Do not rely on the palette's level/off confirmation for this tested client/executor combination. This is not a blanket failure claim for every orb client; orb thread isolation, effective off and state reset remain unverified beyond these observations.

These are dated observations, not a blanket claim for every current Amp version. Web UI, compaction and real replay of identical event IDs remain unverified; replay deduplication has unit/simulated-contract coverage only. Windows and macOS remain untested. This remains an **experimental pre-release**, not stable. The source repository's `amp/TESTING.md` and `amp/RELEASING.md` retain the initial October 20 test/release baseline; their original unpublished-status statements are historical, superseded by the publication record above.
