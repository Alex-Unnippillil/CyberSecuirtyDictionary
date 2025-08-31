const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const rootDir = process.cwd();

function getHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getHtmlFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const domCache = new Map();
function loadDom(file) {
  if (!domCache.has(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    domCache.set(file, cheerio.load(content));
  }
  return domCache.get(file);
}

function checkInternalLink(href, currentFile) {
  const [pathPart, anchor] = href.split('#');
  let targetFile;
  if (!pathPart || pathPart === '') {
    targetFile = currentFile;
  } else if (pathPart.startsWith('/')) {
    targetFile = path.join(rootDir, pathPart.replace(/^\//, ''));
  } else {
    targetFile = path.resolve(path.dirname(currentFile), pathPart);
  }

  if (!fs.existsSync(targetFile)) {
    return `Missing file: ${href} referenced from ${currentFile}`;
  }

  if (anchor) {
    const $ = loadDom(targetFile);
    if ($(`#${anchor}`).length === 0 && $(`[name='${anchor}']`).length === 0) {
      return `Missing anchor #${anchor} in ${targetFile} referenced from ${currentFile}`;
    }
  }
  return null;
}

async function checkExternalLink(url, retries = 3, delay = 500) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let res = await fetch(url, { method: 'HEAD' });
      if (res.status === 405) {
        res = await fetch(url, { method: 'GET' });
      }
      if (res.ok) return null;
      throw new Error(`Status ${res.status}`);
    } catch (err) {
      if (attempt === retries) {
        return `External link failure ${url}: ${err.message}`;
      }
      const wait = delay * Math.pow(2, attempt);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  return null;
}

async function main() {
  const htmlFiles = getHtmlFiles(rootDir);
  const errors = [];
  for (const file of htmlFiles) {
    const $ = loadDom(file);
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href || href.includes('{{') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;
      if (href.startsWith('http://') || href.startsWith('https://')) {
        // push a promise for external check
        errors.push(checkExternalLink(href));
      } else {
        const err = checkInternalLink(href, file);
        if (err) errors.push(Promise.resolve(err));
      }
    });
  }

  const results = await Promise.all(errors);
  const failed = results.filter(Boolean);
  if (failed.length) {
    console.error('Link check failed:');
    for (const e of failed) console.error(' -', e);
    process.exit(1);
  } else {
    console.log('All links passed');
  }
}

main().catch(err => {
  console.error('Unexpected error', err);
  process.exit(1);
});
