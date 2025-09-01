const fs = require('fs');
const path = require('path');

const [,, description, scope] = process.argv;

if (!description || !scope) {
  console.error('Usage: node log-incident.js "Description" "Scope"');
  process.exit(1);
}

const logPath = path.join(__dirname, 'docs', 'incidents.md');

if (!fs.existsSync(logPath)) {
  const header = '# Incident Log\n\n| Timestamp (UTC) | Description | Scope |\n|-----------------|-------------|-------|\n';
  fs.writeFileSync(logPath, header);
}

const timestamp = new Date().toISOString();
const entry = `| ${timestamp} | ${description} | ${scope} |\n`;

fs.appendFileSync(logPath, entry);
console.log(`Logged incident at ${timestamp}`);
