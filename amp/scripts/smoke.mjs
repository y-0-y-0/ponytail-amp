// Opt-in authenticated integration test. Creates one private Amp test thread.
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

if (process.argv.length !== 4) throw new Error('Usage: node amp/scripts/smoke.mjs <extracted-bundle> <NEW-test-directory>')
const bundle = resolve(process.argv[2])
const workspace = resolve(process.argv[3])
const run = (command, args, options = {}) => execFileSync(command, args, { cwd: workspace, encoding: 'utf8', stdio: 'pipe', timeout: 30000, ...options })
execFileSync(process.execPath, [join(bundle, 'verify.mjs'), bundle], { stdio: 'inherit' })
mkdirSync(workspace) // Refuse an existing workspace, never overwrite user work.
run('git', ['init', '--quiet'])
cpSync(join(bundle, 'ponytail-amp'), join(workspace, '.amp/plugins/ponytail-amp'), { recursive: true })
cpSync(fileURLToPath(new URL('../fixtures/coding', import.meta.url)), join(workspace, 'coding'), { recursive: true })
cpSync(fileURLToPath(new URL('../fixtures/review', import.meta.url)), join(workspace, 'review'), { recursive: true })
const originalTest = readFileSync(join(workspace, 'coding/shipping.test.mjs'), 'utf8')
const originalReview = readFileSync(join(workspace, 'review/average.mjs'), 'utf8')
const baseline = spawnSync(process.execPath, ['--test', 'coding/shipping.test.mjs'], { cwd: workspace, encoding: 'utf8' })
assert.equal(baseline.status, 1, 'Regression fixture must fail before the task')
writeFileSync(join(workspace, 'before.log'), baseline.stdout + baseline.stderr)
const listing = run('amp', ['plugins', 'list'])
assert.match(listing, /ponytail-amp\/index\.ts active/)
assert.match(listing, /Ponytail Amp: Set level/)
assert.match(listing, /Ponytail Amp: Show level/)
writeFileSync(join(workspace, 'plugins.log'), listing)
for (const name of ['ponytail', 'ponytail-review', 'ponytail-audit', 'ponytail-debt', 'ponytail-gain', 'ponytail-help']) {
  const info = JSON.parse(run('amp', ['skill', 'info', `ponytail-amp:${name}`, '--json']))
  assert.equal(info.name, `ponytail-amp:${name}`)
}
const prompt = 'Artifact integration smoke in this disposable workspace only. State whether automatic Ponytail Amp guidance is present and its level, without inferring it from source files. Fix coding/shipping.mjs so shipping is free at subtotal 50 inclusive. Keep the boundary test unchanged and run it. Then explicitly load ponytail-amp:ponytail-review and review review/average.mjs against its arithmetic-mean contract; report a concrete failing input and correct expected result. Do not edit the review file. Do not commit, push, publish, create other threads, or edit any file except coding/shipping.mjs. Do not change Amp settings or permissions.'
const stream = run('amp', ['--execute', '--stream-json', '--plugin-ready-timeout=20', '--visibility=private'], { input: prompt, timeout: 180000 })
writeFileSync(join(workspace, 'task.jsonl'), stream)
const events = stream.trim().split('\n').map(line => JSON.parse(line))
const id = events.map(event => event.session_id).find(value => typeof value === 'string' && value.startsWith('T-'))
assert.ok(id, 'Expected an Amp thread ID in the documented JSON stream')
const exported = run('amp', ['threads', 'export', id])
writeFileSync(join(workspace, 'thread.json'), exported)
const thread = JSON.parse(exported)
const injected = thread.messages[0].content.filter(block => block.type === 'text' && block.text.startsWith('[Ponytail Amp — level: full]'))
assert.equal(injected.length, 1, 'Exactly one automatic full instruction in first user message')
assert.equal(injected[0].hidden, true)
assert.ok(thread.activatedSkills.some(skill => skill.name === 'ponytail-amp:ponytail-review'))
assert.equal(readFileSync(join(workspace, 'coding/shipping.test.mjs'), 'utf8'), originalTest)
assert.equal(readFileSync(join(workspace, 'review/average.mjs'), 'utf8'), originalReview)
const after = run(process.execPath, ['--test', 'coding/shipping.test.mjs'])
writeFileSync(join(workspace, 'after.log'), after)
console.log(`PASS: archive loading, palette registration, six skill lookups, hidden full injection, review skill load and unchanged regression test. https://ampcode.com/threads/${id}`)
console.log(`Evidence retained in ${workspace}. Inspect the review's concrete finding manually. Interactive level/off/reload tests are still required; this is NOT a complete UI smoke.`)
