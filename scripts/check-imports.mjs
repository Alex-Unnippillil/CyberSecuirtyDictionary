import fs from 'node:fs';
import path from 'node:path';
import module from 'node:module';

const roots = ['app', 'components', 'lib', 'hooks'];
const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'];
const ignoreBare = new Set(['contentlayer/generated']);
const builtins = new Set(module.builtinModules.map((m) => m.replace(/^node:/, '')));

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const knownPackages = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {})
]);

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (extensions.includes(path.extname(entry.name))) files.push(full);
  }
  return files;
}

function existsModuleFile(base) {
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return true;
  for (const ext of extensions) {
    if (fs.existsSync(base + ext)) return true;
  }
  if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
    for (const ext of extensions) {
      if (fs.existsSync(path.join(base, 'index' + ext))) return true;
    }
  }
  return false;
}

const importRe = /(?:import|export)\s+(?:[^'"\n]+from\s+)?['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)/g;
const errors = [];

for (const root of roots) {
  for (const file of walk(root)) {
    const src = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = importRe.exec(src))) {
      const spec = m[1] || m[2];
      if (!spec) continue;
      if (spec.startsWith('node:')) continue;

      if (spec.startsWith('./') || spec.startsWith('../')) {
        const resolved = path.resolve(path.dirname(file), spec);
        if (!existsModuleFile(resolved)) errors.push(`${file}: unresolved relative import '${spec}'`);
        continue;
      }

      if (spec.startsWith('@/')) {
        const resolved = path.resolve(spec.slice(2));
        if (!existsModuleFile(resolved)) errors.push(`${file}: unresolved alias import '${spec}'`);
        continue;
      }

      if (spec.startsWith('/')) {
        const resolved = path.resolve(spec);
        if (!existsModuleFile(resolved)) errors.push(`${file}: unresolved absolute import '${spec}'`);
        continue;
      }

      if (ignoreBare.has(spec)) continue;
      const pkgName = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
      if (builtins.has(pkgName)) continue;
      if (!knownPackages.has(pkgName)) errors.push(`${file}: missing dependency for '${spec}' (expected package '${pkgName}')`);
    }
  }
}

if (errors.length) {
  console.error('Unresolved imports found:\n' + errors.join('\n'));
  process.exit(1);
}

console.log('Import dependency check passed.');
