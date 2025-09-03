const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

test('search and suggest query the index', async () => {
  const original = fs.readFileSync;
  fs.readFileSync = (p, ...args) =>
    p && p.toString().endsWith('index.json')
      ? JSON.stringify([
          { term: 'Alpha', definition: 'first' },
          { term: 'Beta', definition: 'second', synonyms: ['B'] }
        ])
      : original(p, ...args);
  const { search, suggest } = require('../lib/search/runtime.ts');
  const results = search('beta');
  assert.equal(results.length, 1);
  assert.equal(results[0].term, 'Beta');
  const suggestions = suggest('a');
  assert.deepEqual(suggestions, ['Alpha']);
  // exercise cache and empty query branches
  const cached = search('beta');
  assert.equal(cached.length, 1);
  assert.deepEqual(search(''), []);
  assert.deepEqual(suggest(''), []);
  fs.readFileSync = original;
});
