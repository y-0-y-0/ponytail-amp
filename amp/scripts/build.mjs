import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { digest, files } from './verify.mjs'

const root = fileURLToPath(new URL('../../', import.meta.url))
const plugin = join(root, 'amp/ponytail-amp')
const metadata = JSON.parse(readFileSync(join(plugin, 'package.json'), 'utf8'))
if (metadata.name !== 'ponytail-amp' || !/^\d+\.\d+\.\d+-alpha\.\d+$/.test(metadata.version)) {
  throw new Error('Review release naming before changing the experimental distribution identity')
}
if (!process.argv[2]) throw new Error('Usage: node amp/scripts/build.mjs <output-directory>')
const output = resolve(process.argv[2])
const filename = `${metadata.name}-${metadata.version}.tar.gz`
mkdirSync(output, { recursive: true })
if (existsSync(join(output, filename)) || existsSync(join(output, 'SHA256SUMS'))) throw new Error('Output already occupied; choose a fresh directory')
const stage = mkdtempSync(join(tmpdir(), 'ponytail-amp-build-'))
try {
  // An explicit allowlist keeps unrelated host integrations and development files out.
  for (const name of ['index.ts', 'instructions.ts', 'state.ts', 'package.json', 'README.md', 'skills']) {
    cpSync(join(plugin, name), join(stage, 'ponytail-amp', name), { recursive: true })
  }
  cpSync(join(root, 'LICENSE'), join(stage, 'ponytail-amp/LICENSE'))
  cpSync(join(plugin, 'README.md'), join(stage, 'INSTALL.md'))
  cpSync(new URL('./verify.mjs', import.meta.url), join(stage, 'verify.mjs'))
  writeFileSync(join(stage, 'BUILD.json'), JSON.stringify({
    name: metadata.name, version: metadata.version, repository: metadata.repository,
    sourceRevision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    dirty: execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim().length > 0,
    upstream: metadata.upstream,
  }, null, 2) + '\n')
  const inventory = Object.fromEntries(files(stage).map(name => [name, digest(join(stage, name))]))
  writeFileSync(join(stage, 'MANIFEST.json'), JSON.stringify({ format: 1, files: inventory }, null, 2) + '\n')
  execFileSync(process.execPath, [join(stage, 'verify.mjs'), stage], { stdio: 'inherit' })
  execFileSync('tar', ['--sort=name', '--mtime=@0', '--owner=0', '--group=0', '--numeric-owner', '--mode=u=rwX,go=rX', '-czf', join(output, filename), '-C', stage, '.'])
  writeFileSync(join(output, 'SHA256SUMS'), `${digest(join(output, filename))}  ${filename}\n`, { flag: 'wx' })
  console.log(join(output, filename))
} finally {
  rmSync(stage, { recursive: true, force: true })
}
