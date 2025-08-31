const fs = require('fs');
const path = require('path');

if (process.env.ALLOW_NEW_DOMAINS) {
  console.log('ALLOW_NEW_DOMAINS set; skipping domain allowlist check.');
  process.exit(0);
}

const projectRoot = __dirname;
const allowlistPath = path.join(projectRoot, 'docs', 'allowed-domains.json');
const allowed = new Set(JSON.parse(fs.readFileSync(allowlistPath, 'utf8')));
const ignoreDirs = new Set(['node_modules', '.git', 'docs']);
const ignoreFiles = new Set(['site.config.json']);
const domains = new Set();

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    if (ignoreDirs.has(entry)) continue;
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else {
      if (ignoreFiles.has(entry)) continue;
      const content = fs.readFileSync(full, 'utf8');
      const regex = /https?:\/\/([^\/"'\s]+)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        domains.add(match[1]);
      }
    }
  }
}

walk(projectRoot);

const unknown = [...domains].filter((d) => !allowed.has(d));

if (unknown.length > 0) {
  console.error('Found external domains not in allowlist:');
  for (const d of unknown) console.error(` - ${d}`);
  console.error('Update docs/allowed-domains.json and docs/vendor-policy.md or set ALLOW_NEW_DOMAINS=1 to override.');
  process.exit(1);
}

console.log('All external domains are allowlisted.');
