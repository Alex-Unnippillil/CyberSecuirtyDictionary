const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const { resolveRequestedPath, WEB_ROOT } = require('../server');

test('resolves root path to index.html under web root', () => {
  const result = resolveRequestedPath('/');

  assert.equal(result.error, undefined);
  assert.equal(result.resolvedPath, path.join(WEB_ROOT, 'index.html'));
  assert.equal(result.contentType, 'text/html; charset=utf-8');
});

test('rejects dot-dot traversal attempts', () => {
  const result = resolveRequestedPath('/../../etc/passwd');

  assert.equal(result.error, 'Invalid path');
  assert.equal(result.statusCode, 400);
});

test('rejects encoded traversal attempts', () => {
  const result = resolveRequestedPath('/%2e%2e/%2e%2e/etc/passwd');

  assert.equal(result.error, 'Invalid path');
  assert.equal(result.statusCode, 400);
});

test('rejects encoded absolute path attempts', () => {
  const result = resolveRequestedPath('/%2Fetc/passwd');

  assert.equal(result.error, 'Invalid path');
  assert.equal(result.statusCode, 400);
});

test('rejects unsupported extensions', () => {
  const result = resolveRequestedPath('/README.md');

  assert.equal(result.error, 'Unsupported file type');
  assert.equal(result.statusCode, 403);
});
