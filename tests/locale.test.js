const assert = require('assert');
const fs = require('fs');
const path = require('path');
const resolveLocale = require('../router.js');

const enPath = path.join(__dirname, '../content/en/terms/terms.json');
const esPath = path.join(__dirname, '../content/es/terms/terms.json');

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const esData = JSON.parse(fs.readFileSync(esPath, 'utf8'));

assert.strictEqual(resolveLocale('/es/'), 'es');
assert.strictEqual(resolveLocale('/de/'), 'en');
assert.ok(enData.terms.length > 0, 'English terms should load');
assert.ok(esData.terms[0].term === 'Suplantación de identidad', 'Spanish terms should load');

console.log('Locale tests passed');
