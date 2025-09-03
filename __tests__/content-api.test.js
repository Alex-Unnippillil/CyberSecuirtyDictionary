const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('getAllTerms and getTermBySlug load YAML data', async () => {
  const original = fs.readFileSync;
  fs.readFileSync = (p, ...args) =>
    p && p.toString().endsWith('terms.yaml')
      ? `-
  name: Alpha
  slug: alpha
  definition: first
- name: Beta
  slug: beta
  definition: second`
      : original(p, ...args);
  const mod = require('../lib/content/api.ts');
  const all = mod.getAllTerms();
  assert.equal(all.length, 2);
  const beta = mod.getTermBySlug('beta');
  assert.equal(beta.name, 'Beta');
  fs.readFileSync = original;
});
