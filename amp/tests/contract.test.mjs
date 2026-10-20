import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import plugin from '../ponytail-amp/index.ts'
import { harness, strictHost } from './harness.mjs'

async function setup() {
  const host = harness()
  await plugin(host.api)
  const notices = []
  const selections = []
  let choice
  let selection
  const ui = strictHost({
    async notify(message) { notices.push(message) },
    async select(options) { selections.push(options); return selection ?? choice },
  })
  async function command(id, thread) {
    const cmd = host.commands.get(id)
    assert.ok(cmd)
    await cmd.handler(strictHost({ thread: thread ? strictHost({ id: thread }) : undefined, ui }))
  }
  return { ...host, notices, selections, command, choose(value) { choice = value },
    defer(value) { selection = value },
    turn(thread, id) { return host.emit({ thread: { id: thread }, id, message: 'task' }) } }
}

test('all six qualified skills register, valid frontmatter and commands, no extra listeners', async () => {
  const host = await setup()
  assert.deepEqual(host.skills.map(path => `ponytail-amp:${path.slice(7)}`), [
    'ponytail-amp:ponytail', 'ponytail-amp:ponytail-review', 'ponytail-amp:ponytail-audit',
    'ponytail-amp:ponytail-debt', 'ponytail-amp:ponytail-gain', 'ponytail-amp:ponytail-help',
  ])
  for (const path of host.skills) {
    const skill = readFileSync(new URL(`../ponytail-amp/${path}/SKILL.md`, import.meta.url), 'utf8')
    assert.match(skill, new RegExp(`^---\nname: ${path.slice(7)}\n`))
    assert.match(skill, /license: MIT/)
    assert.doesNotMatch(skill, /`\/ponytail|\$ponytail/)
  }
  assert.deepEqual([...host.commands.values()].map(command => [command.options.category, command.options.title]), [
    ['Ponytail Amp', 'Set level'], ['Ponytail Amp', 'Show level'],
  ])
})

test('interleaved threads, all transitions, off, explicit skills and replay deduplication', async () => {
  const host = await setup()
  assert.match(JSON.stringify(host.turn('T-b', 1)), /level: full/)
  host.choose('lite'); await host.command('set-level', 'T-a')
  assert.deepEqual(host.selections[0], {
    title: 'Ponytail Amp level', options: ['lite', 'full', 'ultra', 'off'], initialValue: 'full',
    message: 'Scope: thread T-a, this plugin instance only. Ultra does not select Amp Ultra. Off stops future injections, not history.',
  })
  assert.match(JSON.stringify(host.turn('T-a', 1)), /level: lite/)
  host.choose('ultra'); await host.command('set-level', 'T-b')
  assert.match(JSON.stringify(host.turn('T-b', 2)), /level: ultra/)
  assert.deepEqual(host.turn('T-a', 1), {})
  host.choose('off'); await host.command('set-level', 'T-a')
  assert.deepEqual(host.turn('T-a', 2), {})
  assert.match(JSON.stringify(host.turn('T-b', 3)), /level: ultra/)
  assert.equal(host.skills.length, 6)
  host.choose('full'); await host.command('set-level', 'T-a')
  const result = host.turn('T-a', 3)
  assert.ok(result && typeof result === 'object' && 'message' in result)
  assert.deepEqual(Object.keys(result), ['message'])
  assert.match(JSON.stringify(result), /"display":false/)
  assert.match(JSON.stringify(result), /level: full/)
  // A mode change cannot inject a second copy into an already handled user message.
  assert.deepEqual(host.turn('T-a', 1), {})
  await host.command('show-level', 'T-b')
  assert.match(host.notices.at(-1) ?? '', /ultra; thread T-b; this plugin instance only/)
  const reloaded = await setup()
  assert.match(JSON.stringify(reloaded.turn('T-b', 1)), /level: full/)
})

test('no thread is a notified no-op; cancel and invalid selections preserve current level', async () => {
  const host = await setup()
  await host.command('set-level')
  await host.command('show-level')
  assert.equal(host.selections.length, 0)
  assert.match(host.notices[0] ?? '', /no active thread.*Nothing changed/)
  assert.match(host.notices[1] ?? '', /no global level/)
  host.choose('lite'); await host.command('set-level', 'T-a')
  for (const choice of [undefined, 'review', 'full ']) {
    host.choose(choice); await host.command('set-level', 'T-a')
  }
  assert.match(JSON.stringify(host.turn('T-a', 'after-cancel')), /level: lite/)
})

test('a delayed selection remains bound to the thread that opened it', async () => {
  const host = await setup()
  let finish
  host.defer(new Promise(resolve => { finish = resolve }))
  const pending = host.command('set-level', 'T-a')
  assert.match(JSON.stringify(host.turn('T-b', 1)), /level: full/)
  assert.ok(finish); finish('off'); await pending
  assert.deepEqual(host.turn('T-a', 1), {})
  assert.match(JSON.stringify(host.turn('T-b', 2)), /level: full/)
})
