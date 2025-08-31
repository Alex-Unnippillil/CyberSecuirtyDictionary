const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

if (process.argv.length < 3){
  console.error('Usage: node migrate-v1-to-v2.js <file>');
  process.exit(1);
}

const file = process.argv[2];
const ext = path.extname(file).toLowerCase();

if (!fs.existsSync(file)){
  console.error(`File not found: ${file}`);
  process.exit(1);
}

function migrate(obj){
  const terms = Array.isArray(obj) ? obj : obj.terms || [];
  return { schemaVersion: 2, terms };
}

if (ext === '.yaml' || ext === '.yml'){
  const data = yaml.load(fs.readFileSync(file, 'utf8'));
  const migrated = migrate(data);
  fs.writeFileSync(file, yaml.dump(migrated));
} else if (ext === '.json'){
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const migrated = migrate(data);
  fs.writeFileSync(file, JSON.stringify(migrated, null, 2));
} else {
  console.error('Unsupported file type');
  process.exit(1);
}
