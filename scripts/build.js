const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const ignore = new Set(['node_modules', 'dist', '.git', 'dev', 'scripts']);

function copy(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      if (ignore.has(entry)) continue;
      copy(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

fs.rmSync(dist, { recursive: true, force: true });
copy(root, dist);
console.log('Build complete.');
