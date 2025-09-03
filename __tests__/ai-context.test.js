const test = require('node:test');
const assert = require('node:assert/strict');
const { toContext } = require('../lib/ai/context.ts');

test('builds context string from term front matter', () => {
  const term = {
    name: 'AES',
    definition: 'A symmetric cipher',
    category: 'encryption',
    synonyms: ['Advanced Encryption Standard'],
    see_also: ['DES']
  };
  const ctx = toContext(term);
  assert.ok(ctx.includes('AES'));
  assert.ok(ctx.includes('A symmetric cipher'));
  assert.ok(ctx.includes('Category: encryption'));
  assert.ok(ctx.includes('Synonyms: Advanced Encryption Standard'));
  assert.ok(ctx.includes('See also: DES'));
});

test('handles missing fields', () => {
  const ctx = toContext({});
  assert.equal(ctx, '');
});
