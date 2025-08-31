const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const htmlFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'templates', 'contribute.html')
];

function fetchHash(url) {
  let buffer;
  try {
    buffer = execSync(`curl -L --ipv4 -s ${JSON.stringify(url)}`);
  } catch (err) {
    throw new Error(`Failed to fetch ${url}`);
  }
  return crypto.createHash('sha384').update(buffer).digest('base64');
}

async function processFile(file) {
  let html = fs.readFileSync(file, 'utf8');
  let modified = false;

  const linkRegex = /<link(?=[^>]*rel=["']stylesheet["'])(?=[^>]*href=["'](https?:[^"']+)["'])[^>]*>/gi;
  const scriptRegex = /<script[^>]*src=["'](https?:[^"']+)["'][^>]*><\/script>/gi;
  const patterns = [linkRegex, scriptRegex];

  for (const regex of patterns) {
    const matches = [...html.matchAll(regex)];
    for (const match of matches) {
      const tag = match[0];
      const url = match[1];
      const integrityMatch = tag.match(/integrity=["']([^"']+)["']/i);
      const hash = fetchHash(url);
      const integrityValue = `sha384-${hash}`;
      if (integrityMatch) {
        if (integrityMatch[1] !== integrityValue) {
          throw new Error(`Integrity mismatch for ${url} in ${path.basename(file)}`);
        }
      } else {
        const newTag = tag.replace(/\s*>$/, ` integrity="${integrityValue}" crossorigin="anonymous">`);
        html = html.replace(tag, newTag);
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(file, html);
  }
}

(async () => {
  for (const file of htmlFiles) {
    await processFile(file);
  }
})().catch(err => {
  console.error(err.message);
  process.exit(1);
});
