const fs = require('fs');
const path = require('path');

const reportOnly = process.env.NEXT_PUBLIC_CSP_REPORT_ONLY === 'true';
if (!reportOnly) {
  process.exit(0);
}

const files = ['index.html', 'search.html', 'diagnostics.html', 'layout.html'];
for (const file of files) {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) continue;
  const html = fs.readFileSync(filePath, 'utf8');
  const updated = html.replace(/Content-Security-Policy/gi, 'Content-Security-Policy-Report-Only');
  fs.writeFileSync(filePath, updated);
}
