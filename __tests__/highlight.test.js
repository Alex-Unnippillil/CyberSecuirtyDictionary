const test = require('node:test');
const assert = require('node:assert/strict');
const highlight = require('../lib/highlight.ts').default;

test('wraps query in mark tags', () => {
  const result = highlight('hello world', 'world');
  assert.equal(result, 'hello <mark>world</mark>');
});

test('returns original text when query empty', () => {
  const result = highlight('hello', '');
  assert.equal(result, 'hello');
});
