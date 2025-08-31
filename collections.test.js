const test = require('node:test');
const assert = require('node:assert');
const { encodeCollection, decodeCollection } = require('./collections.js');

test('encode and decode collection', () => {
  const original = { name: 'TestSet', terms: ['Alpha', 'Beta'] };
  const encoded = encodeCollection(original.name, original.terms);
  const decoded = decodeCollection(encoded);
  assert.deepStrictEqual(decoded, original);
});
