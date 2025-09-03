const test = require('node:test');
const assert = require('node:assert/strict');

test('personal terms storage helpers', async () => {
  const store = new Map();
  const fakeDB = {
    put: async (_store, term) => { store.set(term.slug, term); },
    getAll: async () => Array.from(store.values())
  };
  const idbPath = require.resolve('idb');
  require.cache[idbPath] = { exports: { openDB: async () => fakeDB } };
  const mod = require('../lib/personalTerms.ts');
  await mod.savePersonalTerm({ slug: 'alpha', definition: 'first', tags: [], source: 'src' });
  const all = await mod.getAllPersonalTerms();
  assert.equal(all.length, 1);
  const results = await mod.searchPersonalTerms('first');
  assert.equal(results[0].slug, 'alpha');
  delete require.cache[idbPath];
});
