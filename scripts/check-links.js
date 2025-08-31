const fs = require('fs');
const { extractUrls } = require('./standard-links');

const data = JSON.parse(fs.readFileSync('terms.json', 'utf8'));
const urls = new Set();
for (const term of data.terms) {
  extractUrls(term.definition).forEach((u) => urls.add(u));
}

if (urls.size === 0) {
  console.log('No standard links to verify.');
  process.exit(0);
}

async function verify(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    if (res.status !== 200) {
      throw new Error(`status ${res.status}`);
    }
    console.log(`${url} -> ${res.status}`);
  } catch (err) {
    console.error(`${url} -> ERROR ${err.message}`);
    process.exitCode = 1;
  }
}

(async () => {
  for (const url of urls) {
    await verify(url);
  }
  if (process.exitCode) {
    process.exit(process.exitCode);
  }
})();
