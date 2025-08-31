const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const allowedVersions = [2];
let errors = 0;

function check(file, version){
  if (!allowedVersions.includes(version)){
    console.error(`${file}: unknown schemaVersion ${version}`);
    errors++;
  }
}

function readYaml(file){
  const content = fs.readFileSync(file, 'utf8');
  const data = yaml.load(content);
  return data && data.schemaVersion;
}

function readJson(file){
  const content = fs.readFileSync(file, 'utf8');
  const data = JSON.parse(content);
  return data && data.schemaVersion;
}

const yamlFile = path.join(__dirname, '..', 'data', 'terms.yaml');
if (fs.existsSync(yamlFile)){
  const v = readYaml(yamlFile);
  check('data/terms.yaml', v);
}

const jsonFile = path.join(__dirname, '..', 'terms.json');
if (fs.existsSync(jsonFile)){
  const v = readJson(jsonFile);
  check('terms.json', v);
}

if (errors > 0){
  process.exit(1);
} else {
  console.log('schemaVersion check passed');
}
