import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync, readdirSync, symlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { digest, files } from '../scripts/verify.mjs'
import { harness } from './harness.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const filename = 'ponytail-amp-0.1.0-alpha.1.tar.gz'

test('reproducible full archive; documented install/update/uninstall; occupied destinations and tampering', async () => {
  const scratch = mkdtempSync(join(tmpdir(), 'ponytail-amp-test-'))
  try {
    const output = join(scratch, 'build')
    const output2 = join(scratch, 'rebuild')
    const build = (directory, source = root) => execFileSync(process.execPath, ['amp/scripts/build.mjs', directory], { cwd: source, stdio: 'pipe' })
    build(output); build(output2)
    assert.equal(digest(join(output, filename)), digest(join(output2, filename)))
    execFileSync('sha256sum', ['-c', 'SHA256SUMS'], { cwd: output })
    assert.throws(() => build(output), /Output already occupied/)
    const bundle = join(scratch, 'extracted bundle')
    mkdirSync(bundle)
    execFileSync('tar', ['-xzf', join(output, filename), '-C', bundle])
    const verify = (directory = bundle, extra = [], source = bundle) => execFileSync(process.execPath, [join(source, 'verify.mjs'), directory, ...extra], { stdio: 'pipe' })
    verify()
    const shipped = files(bundle)
    assert.deepEqual(shipped.filter(path => !path.startsWith('ponytail-amp/')), ['BUILD.json', 'INSTALL.md', 'MANIFEST.json', 'verify.mjs'])
    assert.equal(shipped.filter(path => path.endsWith('/SKILL.md')).length, 6)
    assert.equal(readFileSync(join(bundle, 'ponytail-amp/LICENSE'), 'utf8'), readFileSync(join(root, 'LICENSE'), 'utf8'))
    assert.doesNotMatch(shipped.join('\n'), /AGENTS\.md|hooks\/|node_modules|\.opencode/)
    assert.equal(readFileSync(join(bundle, 'INSTALL.md'), 'utf8'), readFileSync(join(root, 'amp/ponytail-amp/README.md'), 'utf8'))
    const metadata = JSON.parse(readFileSync(join(bundle, 'BUILD.json'), 'utf8'))
    assert.equal(metadata.version, '0.1.0-alpha.1')
    assert.equal(metadata.upstream.commit, '09c434ab73ca43761c5d8b0c5d341926c2fba710')
    assert.match(metadata.sourceRevision, /^[a-f0-9]{40}$/)
    // Build a genuinely different next-version artifact in a disposable LOCAL clone.
    const nextSource = join(scratch, 'next-source')
    execFileSync('git', ['clone', '--quiet', '--shared', '--no-checkout', root, nextSource])
    cpSync(join(root, 'amp'), join(nextSource, 'amp'), { recursive: true })
    cpSync(join(root, 'LICENSE'), join(nextSource, 'LICENSE'))
    const packagePath = join(nextSource, 'amp/ponytail-amp/package.json')
    const nextMetadata = JSON.parse(readFileSync(packagePath, 'utf8'))
    nextMetadata.version = '0.1.0-alpha.2'
    writeFileSync(packagePath, JSON.stringify(nextMetadata))
    const nextOutput = join(scratch, 'next-output')
    build(nextOutput, nextSource)
    const nextBundle = join(scratch, 'next-bundle')
    mkdirSync(nextBundle)
    execFileSync('tar', ['-xzf', join(nextOutput, 'ponytail-amp-0.1.0-alpha.2.tar.gz'), '-C', nextBundle])
    verify(nextBundle, [], nextBundle)
    const guide = readFileSync(join(bundle, 'INSTALL.md'), 'utf8')
    const recipe = name => {
      const match = guide.match(new RegExp(`<!-- ${name} -->\n\x60\x60\x60bash\n([\\s\\S]*?)\n\x60\x60\x60`))
      assert.ok(match, `Missing documented ${name} procedure`)
      return match[1]
    }
    // Ordinary Bash, without set -e: failed checks must stop the documented chain.
    const extract = (destination, cwd = output) => spawnSync('bash', ['-c', recipe('extract')], {
      cwd, env: { ...process.env, archive: filename, bundle: destination }, encoding: 'utf8',
    })
    const documentedBundle = join(scratch, 'documented extraction')
    assert.equal(extract(documentedBundle).status, 0)
    verify(documentedBundle, [], documentedBundle)
    const stale = join(scratch, 'existing extraction')
    mkdirSync(stale)
    writeFileSync(join(stale, 'verify.mjs'), 'console.log("STALE_VERIFIER_EXECUTED")')
    const occupied = extract(stale)
    assert.notEqual(occupied.status, 0)
    assert.doesNotMatch(occupied.stdout, /STALE_VERIFIER_EXECUTED/)
    const untrusted = join(scratch, 'invalid checksum')
    mkdirSync(untrusted)
    cpSync(join(output, filename), join(untrusted, filename))
    writeFileSync(join(untrusted, 'SHA256SUMS'), `${'0'.repeat(64)}  ${filename}\n`)
    const refused = join(scratch, 'must not extract')
    assert.notEqual(extract(refused, untrusted).status, 0)
    assert.equal(existsSync(refused), false)
    for (const scope of ['project/.amp', 'machine/.config/amp']) {
      const base = join(scratch, scope)
      const plugins = join(base, 'plugins')
      const backup = join(base, 'ponytail-amp-backup')
      const retired = join(base, 'ponytail-amp-uninstalled')
      const env = { ...process.env, bundle, plugins, backup, retired }
      const run = name => spawnSync('bash', ['-c', recipe(name)], { env, encoding: 'utf8' })
      mkdirSync(plugins, { recursive: true })
      writeFileSync(join(plugins, 'unrelated.ts'), 'leave me alone')
      assert.equal(run('install').status, 0)
      const destination = join(plugins, 'ponytail-amp')
      verify(destination, ['--plugin-only'])
      assert.notEqual(run('install').status, 0)
      verify(destination, ['--plugin-only'])
      // Import ONLY the extracted+installed artifact, never checkout source.
      const installed = await import(pathToFileURL(join(destination, 'index.ts')).href)
      const host = harness()
      await installed.default(host.api)
      assert.equal(host.skills.length, 6)
      assert.match(JSON.stringify(host.emit({ thread: { id: 'T-installed' }, message: 'task', id: 1 })), /level: full/)
      for (const skill of host.skills) assert.ok(existsSync(join(destination, skill, 'SKILL.md')))
      // A private modification is preserved in backup, not silently overwritten.
      writeFileSync(join(destination, 'personal-note.txt'), 'my local change')
      env.bundle = nextBundle
      assert.equal(run('update').status, 0)
      verify(destination, ['--plugin-only'], nextBundle)
      assert.equal(JSON.parse(readFileSync(join(destination, 'package.json'), 'utf8')).version, '0.1.0-alpha.2')
      assert.equal(JSON.parse(readFileSync(join(backup, 'ponytail-amp/package.json'), 'utf8')).version, '0.1.0-alpha.1')
      assert.equal(readFileSync(join(backup, 'ponytail-amp/personal-note.txt'), 'utf8'), 'my local change')
      assert.notEqual(run('update').status, 0)
      verify(destination, ['--plugin-only'], nextBundle)
      assert.equal(run('uninstall').status, 0)
      assert.equal(existsSync(destination), false)
      verify(join(retired, 'ponytail-amp'), ['--plugin-only'], nextBundle)
      assert.notEqual(run('uninstall').status, 0)
      assert.equal(readFileSync(join(plugins, 'unrelated.ts'), 'utf8'), 'leave me alone')
      assert.deepEqual(readdirSync(plugins), ['unrelated.ts'])
    }
    const index = join(bundle, 'ponytail-amp/index.ts')
    const original = readFileSync(index)
    writeFileSync(index, 'tampered')
    assert.throws(() => verify(), /Checksum mismatch/)
    writeFileSync(index, original)
    writeFileSync(join(bundle, 'extra'), 'unexpected')
    assert.throws(() => verify(), /File inventory differs/)
    rmSync(join(bundle, 'extra'))
    symlinkSync(index, join(bundle, 'symlink'))
    assert.throws(() => verify(), /Symlinks are not allowed/)
  } finally {
    rmSync(scratch, { recursive: true, force: true })
  }
})
