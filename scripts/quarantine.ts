import * as fs from 'fs';
import * as path from 'path';

const featurePath = process.argv[2];
if (!featurePath) {
  console.error('Usage: pnpm quarantine <feature-path>');
  process.exit(1);
}

const repoRoot = process.cwd();
const absFeaturePath = path.resolve(repoRoot, featurePath);
if (!fs.existsSync(absFeaturePath)) {
  console.error(`Feature path ${featurePath} does not exist`);
  process.exit(1);
}

const featureName = path.basename(absFeaturePath);
const archiveDir = path.join(repoRoot, 'archive', 'features', featureName);
fs.mkdirSync(path.dirname(archiveDir), { recursive: true });
fs.renameSync(absFeaturePath, archiveDir);

const appDir = path.join(repoRoot, 'app', featureName);
fs.mkdirSync(appDir, { recursive: true });
const pageContent = `export default function Page() {\n  return <div>Coming soon</div>;\n}\n`;
fs.writeFileSync(path.join(appDir, 'page.tsx'), pageContent);

console.log(`Quarantined feature ${featureName}`);
