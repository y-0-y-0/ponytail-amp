import { createHash } from 'node:crypto'
import { lstatSync, readdirSync, readFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export function files(root, prefix = '') {
  return readdirSync(join(root, prefix)).sort().flatMap(name => {
    const relative = prefix ? `${prefix}/${name}` : name
    const stat = lstatSync(join(root, relative))
    if (stat.isSymbolicLink()) throw new Error(`Symlinks are not allowed: ${relative}`)
    if (stat.isDirectory()) return files(root, relative)
    if (!stat.isFile()) throw new Error(`Not a regular file: ${relative}`)
    return [relative]
  })
}

export function digest(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

export function verify(root, pluginOnly = false) {
  const manifest = JSON.parse(readFileSync(new URL('./MANIFEST.json', import.meta.url), 'utf8'))
  if (manifest.format !== 1 || !manifest.files || typeof manifest.files !== 'object') {
    throw new Error('Invalid manifest')
  }
  const entries = Object.entries(manifest.files).filter(([name]) => !pluginOnly || name.startsWith('ponytail-amp/'))
  const expected = entries.map(([name]) => pluginOnly ? name.slice('ponytail-amp/'.length) : name).sort()
  const actual = files(root).filter(name => pluginOnly || name !== 'MANIFEST.json').sort()
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('File inventory differs from manifest')
  for (const [name, hash] of entries) {
    if (!/^[a-zA-Z0-9_./-]+$/.test(name) || name.startsWith('/') || name.split('/').includes('..') || !/^[a-f0-9]{64}$/.test(hash)) {
      throw new Error('Invalid manifest entry')
    }
    const relative = pluginOnly ? name.slice('ponytail-amp/'.length) : name
    if (digest(join(root, relative)) !== hash) throw new Error(`Checksum mismatch: ${relative}`)
  }
  return expected.length
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(process.argv[2] ?? fileURLToPath(new URL('.', import.meta.url)))
  if (process.argv[3] && process.argv[3] !== '--plugin-only') throw new Error('Usage: node verify.mjs <directory> [--plugin-only]')
  console.log(`Verified ${verify(root, process.argv[3] === '--plugin-only')} files`)
}
