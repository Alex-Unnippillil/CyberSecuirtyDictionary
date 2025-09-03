require('ts-node/register');
const assert = require('assert').strict;

// Ensure development mode for logging
process.env.NODE_ENV = 'development';

const { t } = require('../src/lib/i18n');

let warned = '';
const originalWarn = console.warn;
console.warn = (msg) => { warned = msg; };

// Should fall back to English and warn
const result = t('greeting', 'es');
assert.equal(result, 'Hello');
assert.ok(warned.includes('Missing translation'));

// Should return key when completely missing
warned = '';
const missing = t('unknown_key', 'es');
assert.equal(missing, 'unknown_key');
assert.ok(warned.includes('unknown_key'));

console.warn = originalWarn;

console.log('i18n tests passed');
