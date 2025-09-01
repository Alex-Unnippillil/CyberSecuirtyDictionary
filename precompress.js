const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function precompressDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      precompressDir(full);
    } else if (/\.(svg|json)$/i.test(entry.name)) {
      const source = fs.readFileSync(full);
      const compressed = zlib.brotliCompressSync(source);
      fs.writeFileSync(full + '.br', compressed);
    }
  }
}

if (require.main === module) {
  const assetsDir = path.join(__dirname, 'assets');
  if (fs.existsSync(assetsDir)) {
    precompressDir(assetsDir);
  }
}

module.exports = { precompressDir };
