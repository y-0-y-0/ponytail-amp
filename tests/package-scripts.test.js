#!/usr/bin/env node

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

test('root npm test covers bundled subprojects', () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

  assert.match(packageJson.scripts.test, /npm test --prefix pi-extension/);
});

test('fork cannot publish the upstream npm identity and workflows pin actions', () => {
  const publish = fs.readFileSync(path.join(root, '.github', 'workflows', 'publish.yml'), 'utf8').replace(/\r\n/g, '\n');
  const ci = fs.readFileSync(path.join(root, '.github', 'workflows', 'test.yml'), 'utf8').replace(/\r\n/g, '\n');
  const amp = fs.readFileSync(path.join(root, '.github', 'workflows', 'amp.yml'), 'utf8');
  const metadata = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

  assert.equal(metadata.private, true);
  assert.match(ci, /^  workflow_call:$/m);
  assert.match(publish, /uses: \.\/\.github\/workflows\/amp\.yml/);
  assert.doesNotMatch(publish, /\bpush:|\btags:/);
  assert.match(publish, /^permissions:\n  contents: read\n\n/m);
  assert.match(amp, /npm --prefix amp run typecheck/);
  assert.match(amp, /npm --prefix amp test/);

  for (const workflow of [publish, ci, amp]) {
    assert.doesNotMatch(workflow, /id-token:|npm publish|gh release|contents: write|pull_request_target|secrets\./);
    for (const action of workflow.matchAll(/^\s+- uses: (.+)$/gm)) {
      assert.match(action[1], /^actions\/[\w-]+@[a-f0-9]{40} # v\d+\.\d+\.\d+\r?$/);
    }
  }
});
