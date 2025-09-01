const { JSDOM } = require('jsdom');

// Set up a DOM with localStorage for the prefs module
const dom = new JSDOM('', { url: 'https://example.com' });
global.localStorage = dom.window.localStorage;

const {
  loadPrefs,
  savePrefs,
  getPref,
  setPref,
  clearPrefs,
} = require('./lib/ui/prefs.js');

clearPrefs();
const original = { theme: 'dark', fontSize: 14 };
savePrefs(original);
const loaded = loadPrefs();
if (JSON.stringify(loaded) !== JSON.stringify(original)) {
  console.error('Loaded preferences did not match saved preferences');
  process.exit(1);
}

setPref('theme', 'light');
if (getPref('theme') !== 'light') {
  console.error('Preference did not round-trip through storage');
  process.exit(1);
}

console.log('Prefs round-trip test passed');
