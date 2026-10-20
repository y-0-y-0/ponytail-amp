import { test } from 'node:test'
import assert from 'node:assert/strict'
import { shipping } from './shipping.mjs'

test('shipping is free at 50 inclusive, not below', () => {
  assert.equal(shipping(49.99), 5)
  assert.equal(shipping(50), 0)
  assert.equal(shipping(50.01), 0)
})
