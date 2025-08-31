const fs = require('node:fs');
const { test } = require('node:test');
const assert = require('node:assert');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);

const data = JSON.parse(fs.readFileSync('terms.json', 'utf8'));

for (const { term, references } of data.terms) {
  if (Array.isArray(references)) {
    for (const url of references) {
      test(`Reference for ${term}: ${url}`, async () => {
        const { stdout } = await execFileAsync('curl', [
          '-o',
          '/dev/null',
          '-s',
          '-w',
          '%{http_code}',
          url,
        ]);
        assert.strictEqual(stdout.trim(), '200');
      });
    }
  }
}
