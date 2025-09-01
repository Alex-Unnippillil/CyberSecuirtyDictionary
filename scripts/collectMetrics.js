const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let num = bytes;
  while (num >= 1024 && i < units.length - 1) {
    num /= 1024;
    i++;
  }
  return `${num.toFixed(2)} ${units[i]}`;
}

function getDirSize(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let total = 0;
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git'].includes(entry.name)) continue;
      total += getDirSize(fullPath);
    } else {
      total += fs.statSync(fullPath).size;
    }
  }
  return total;
}

function updateReadme(summary) {
  const readmePath = path.join(process.cwd(), 'README.md');
  let readme = fs.readFileSync(readmePath, 'utf8');
  const startMarker = '<!-- METRICS-START -->';
  const endMarker = '<!-- METRICS-END -->';
  const block = `${startMarker}\n${summary}\n${endMarker}`;
  const startIdx = readme.indexOf(startMarker);
  const endIdx = readme.indexOf(endMarker);
  if (startIdx !== -1 && endIdx !== -1) {
    readme = readme.slice(0, startIdx) + block + readme.slice(endIdx + endMarker.length);
  } else {
    readme += `\n## Metrics\n${block}\n`;
  }
  fs.writeFileSync(readmePath, readme);
}

function getTraffic() {
  if (!process.env.GITHUB_TOKEN) return null;
  try {
    const views = execSync(`curl -s -H \"Authorization: token ${process.env.GITHUB_TOKEN}\" https://api.github.com/repos/Alex-Unnippillil/CyberSecuirtyDictionary/traffic/views`);
    const clones = execSync(`curl -s -H \"Authorization: token ${process.env.GITHUB_TOKEN}\" https://api.github.com/repos/Alex-Unnippillil/CyberSecuirtyDictionary/traffic/clones`);
    return { views: JSON.parse(views.toString()), clones: JSON.parse(clones.toString()) };
  } catch (e) {
    return null;
  }
}

function generateReport(metrics, budgets, suggestions, traffic) {
  const lines = [];
  lines.push('# Build Metrics');
  lines.push(`Generated on ${new Date().toISOString()}`);
  lines.push('');
  lines.push('| Metric | Value | Budget | Status |');
  lines.push('| --- | --- | --- | --- |');
  lines.push(`| Bundle size | ${formatBytes(metrics.bundleBytes)} | ${formatBytes(budgets.bundleBytes)} | ${metrics.bundleBytes > budgets.bundleBytes ? '❌' : '✅'} |`);
  lines.push(`| Build time | ${metrics.buildMinutes.toFixed(2)} min | ${budgets.buildMinutes.toFixed(2)} min | ${metrics.buildMinutes > budgets.buildMinutes ? '❌' : '✅'} |`);
  lines.push(`| Storage | ${formatBytes(metrics.storageBytes)} | ${formatBytes(budgets.storageBytes)} | ${metrics.storageBytes > budgets.storageBytes ? '❌' : '✅'} |`);
  if (traffic) {
    lines.push(`| Traffic (7d views) | ${traffic.views.count} | - | - |`);
    lines.push(`| Traffic (7d clones) | ${traffic.clones.count} | - | - |`);
  } else {
    lines.push('| Traffic | not available | - | - |');
  }
  lines.push('');
  lines.push('## Suggestions');
  if (suggestions.length === 0) {
    lines.push('- All metrics are within budgets.');
  } else {
    for (const s of suggestions) lines.push(`- ${s}`);
  }
  return lines.join('\n');
}

function generateSummary(metrics, budgets) {
  const lines = [];
  lines.push('| Metric | Value | Budget |');
  lines.push('| --- | --- | --- |');
  lines.push(`| Bundle size | ${formatBytes(metrics.bundleBytes)} | ${formatBytes(budgets.bundleBytes)} |`);
  lines.push(`| Build time | ${metrics.buildMinutes.toFixed(2)} min | ${budgets.buildMinutes.toFixed(2)} min |`);
  lines.push(`| Storage | ${formatBytes(metrics.storageBytes)} | ${formatBytes(budgets.storageBytes)} |`);
  return lines.join('\n');
}

function main() {
  const start = Date.now();
  execSync('sh build.sh', { stdio: 'inherit' });
  const buildMinutes = (Date.now() - start) / 60000;

  const files = ['index.html', 'search.html', 'diagnostics.html', 'script.js', 'styles.css', 'sw.js'];
  let bundleBytes = 0;
  for (const file of files) {
    if (fs.existsSync(file)) {
      bundleBytes += fs.statSync(file).size;
    }
  }

  const storageBytes = getDirSize(process.cwd());

  const metrics = { bundleBytes, buildMinutes, storageBytes };
  const budgets = {
    bundleBytes: 500 * 1024,
    buildMinutes: 5,
    storageBytes: 50 * 1024 * 1024,
  };

  const suggestions = [];
  if (bundleBytes > budgets.bundleBytes) suggestions.push('Reduce bundle size by minifying or removing unused assets.');
  if (buildMinutes > budgets.buildMinutes) suggestions.push('Optimize build steps to reduce build time.');
  if (storageBytes > budgets.storageBytes) suggestions.push('Remove unnecessary files to reduce storage usage.');

  const traffic = getTraffic();
  metrics.traffic = traffic;

  const report = generateReport(metrics, budgets, suggestions, traffic);
  fs.mkdirSync('docs', { recursive: true });
  fs.writeFileSync(path.join('docs', 'metrics.md'), report + '\n');

  const summary = generateSummary(metrics, budgets);
  updateReadme(summary);
}

main();
