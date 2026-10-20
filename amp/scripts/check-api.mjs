import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const docs = execFileSync('amp', ['plugins', 'show-docs'], { encoding: 'utf8' })
const start = docs.indexOf("declare module '@ampcode/plugin'")
if (start < 0) throw new Error('CLI did not provide the Amp module declaration')
const actual = docs.slice(start).trimEnd() + '\n'
const pinned = readFileSync(new URL('../types/amp-plugin.d.ts', import.meta.url), 'utf8')
if (actual !== pinned) throw new Error('Amp API differs from the pinned declaration; review the full diff before updating support')
console.log('Installed Amp API exactly matches the complete pinned declaration')
