const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BUDGET_BYTES = 30 * 1024; // 30 KB per route
const IGNORE_DIRS = new Set(['node_modules', 'templates', '.git']);

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }
  return files;
}

const routes = walk(ROOT).map((file) => {
  const size = fs.statSync(file).size;
  return { route: path.relative(ROOT, file), size };
});

routes.forEach((r) => {
  console.log(`${r.route}: ${(r.size / 1024).toFixed(2)} kB`);
});

let largest = { route: '', size: 0 };
for (const r of routes) {
  if (r.size > largest.size) largest = r;
}

console.log(`Largest route: ${largest.route} at ${(largest.size / 1024).toFixed(2)} kB`);

const exceeded = routes.filter((r) => r.size > BUDGET_BYTES);
if (exceeded.length > 0) {
  console.error(`\nBundle size budget of ${BUDGET_BYTES} bytes exceeded:`);
  exceeded.forEach((r) => {
    console.error(`  ${r.route} at ${r.size} bytes`);
  });
  process.exit(1);
}
