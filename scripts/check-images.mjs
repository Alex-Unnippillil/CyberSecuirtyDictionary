import fs from 'fs';
import path from 'path';

const rootDir = process.argv[2] || '.';
const maxSizeKB = parseInt(process.env.MAX_IMAGE_SIZE_KB || '100', 10);
const threshold = parseInt(process.env.IMAGE_THRESHOLD || '0', 10);

const htmlFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (['node_modules', '.git'].includes(entry.name)) continue;
      walk(path.join(dir, entry.name));
    } else if (entry.name.endsWith('.html')) {
      htmlFiles.push(path.join(dir, entry.name));
    }
  }
}
walk(rootDir);

const missing = [];
const oversized = [];

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html))) {
    const src = match[1];
    if (/^(https?:|data:)/i.test(src)) continue;
    const imgPath = path.join(rootDir, src);
    try {
      const stat = fs.statSync(imgPath);
      const sizeKB = stat.size / 1024;
      if (sizeKB > maxSizeKB) {
        oversized.push({ path: src, sizeKB, file });
      }
    } catch {
      missing.push({ path: src, file });
    }
  }
}

const report = [];
report.push(`Checked ${htmlFiles.length} HTML files`);
if (missing.length) {
  report.push(`Missing images (${missing.length}):`);
  for (const m of missing) {
    report.push(`  ${m.path} referenced in ${path.relative(rootDir, m.file)}`);
  }
}
if (oversized.length) {
  report.push(`Oversized images (> ${maxSizeKB} KB) (${oversized.length}):`);
  for (const o of oversized) {
    report.push(`  ${o.path} - ${o.sizeKB.toFixed(1)} KB referenced in ${path.relative(rootDir, o.file)}`);
  }
}
const total = missing.length + oversized.length;
report.push(`Total issues: ${total}`);

fs.writeFileSync('image-report.txt', report.join('\n') + '\n');

if (total > threshold) {
  console.error(report.join('\n'));
  process.exit(1);
} else {
  console.log(report.join('\n'));
}
