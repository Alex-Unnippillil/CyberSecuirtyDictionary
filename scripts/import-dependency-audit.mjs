import fs from 'node:fs';
import path from 'node:path';

const roots = ['app', 'components', 'lib', 'hooks'];
const codeExt = new Set(['.js', '.jsx', '.ts', '.tsx']);
const builtins = new Set(['fs', 'path']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (codeExt.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const deps = new Set(Object.keys(pkg.dependencies || {}));
const devDeps = new Set(Object.keys(pkg.devDependencies || {}));

const importMap = new Map();
const pattern = /(?:import|export)\s+(?:[^'"\n]+from\s+)?['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/g;

for (const root of roots) {
  for (const file of walk(root)) {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const spec = (match[1] || match[2]);
      if (!spec || spec.startsWith('.') || spec.startsWith('/')) continue;
      const bucket = importMap.get(spec) || new Set();
      bucket.add(file);
      importMap.set(spec, bucket);
    }
  }
}

const normalize = (spec) => {
  if (spec.startsWith('node:')) return null;
  if (builtins.has(spec)) return null;
  if (spec.startsWith('@/')) return null;
  if (spec === 'contentlayer/generated') return null;
  const parts = spec.split('/');
  if (spec.startsWith('@') && parts.length > 1) return `${parts[0]}/${parts[1]}`;
  return parts[0];
};

const rows = [];
for (const [spec, files] of [...importMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const pkgName = normalize(spec);
  let status = 'built-in / internal';
  if (pkgName && deps.has(pkgName)) status = 'dependency';
  else if (pkgName && devDeps.has(pkgName)) status = 'devDependency';
  else if (pkgName) status = 'missing';
  rows.push({ spec, pkgName: pkgName || '-', status, files: [...files].sort() });
}

console.log('# Import-to-dependency audit\n');
console.log('Scope: `app`, `components`, `lib`, `hooks`.\n');
console.log('| Import specifier | Package mapping | Status | Example file |');
console.log('|---|---|---|---|');
for (const row of rows) {
  console.log(`| \`${row.spec}\` | \`${row.pkgName}\` | ${row.status} | \`${row.files[0]}\` |`);
}

const missing = rows.filter((r) => r.status === 'missing');
console.log('\n## Missing package mappings\n');
if (missing.length === 0) {
  console.log('None.');
} else {
  for (const m of missing) {
    console.log(`- \`${m.spec}\` -> \`${m.pkgName}\``);
  }
}
