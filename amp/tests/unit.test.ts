import { test } from 'node:test'
import assert from 'node:assert/strict'
import { instructions, isLevel } from '../ponytail-amp/instructions.ts'
import { ThreadState } from '../ponytail-amp/state.ts'

test('three intensities preserve development safeguards; off generates nothing', () => {
  for (const level of ['lite', 'full', 'ultra'] as const) {
    const text = instructions(level)
    assert.match(text, new RegExp(`level: ${level}`))
    assert.match(text, /security, accessibility/)
    assert.match(text, /small test or assert-based self-check/)
    assert.match(text, /fix the shared root cause/)
  }
  assert.match(instructions('lite'), /let the user pick/)
  assert.doesNotMatch(instructions('lite'), /push back/)
  assert.match(instructions('ultra'), /push back/)
  assert.equal(instructions('off'), '')
  for (const value of ['review', 'FULL', '', null, undefined, {}]) assert.equal(isLevel(value), false)
})

test('state isolates levels and replay IDs across threads and resets per instance', () => {
  const state = new ThreadState()
  assert.equal(state.level('T-a'), 'full')
  state.setLevel('T-a', 'off')
  state.setLevel('T-b', 'lite')
  assert.equal(state.level('T-a'), 'off')
  assert.equal(state.level('T-b'), 'lite')
  assert.equal(state.claimTurn('T-a', 'one'), true)
  assert.equal(state.claimTurn('T-b', 'one'), true)
  assert.equal(state.claimTurn('T-a', 'two'), true)
  assert.equal(state.claimTurn('T-a', 'one'), false)
  assert.equal(state.claimTurn('T-a', 1), true)
  assert.equal(state.claimTurn('T-a', '1'), true)
  const reloaded = new ThreadState()
  assert.equal(reloaded.level('T-a'), 'full')
  assert.equal(reloaded.claimTurn('T-a', 'one'), true)
})
