const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const assets = [
  'styles.css',
  'script.js',
  path.join('assets','js','app.js'),
  path.join('assets','js','search.js')
];

const manifest = {};

for (const asset of assets) {
  const filePath = path.join(__dirname, asset);
  const content = fs.readFileSync(filePath);
  const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0,8);
  const ext = path.extname(asset);
  const base = path.basename(asset, ext);
  const dir = path.dirname(asset);
  const hashedFile = path.join(dir, `${base}.${hash}${ext}`);
  fs.writeFileSync(path.join(__dirname, hashedFile), content);
  manifest[asset] = hashedFile.replace(/\\/g, '/');
}

fs.writeFileSync(path.join(__dirname, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));

const filesToUpdate = ['index.html', 'search.html', 'layout.html', 'sw.js'];
for (const file of filesToUpdate) {
  const filePath = path.join(__dirname, file);
  let data = fs.readFileSync(filePath, 'utf8');
  for (const [original, hashed] of Object.entries(manifest)) {
    const regex = new RegExp(original.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&'), 'g');
    data = data.replace(regex, hashed);
  }
  fs.writeFileSync(filePath, data);
}

console.log('Hashed assets generated:', manifest);
