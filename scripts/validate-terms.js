const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const schemaPath = path.join(__dirname, '..', 'schemas', 'term.schema.json');
const termsPath = path.join(__dirname, '..', 'data', 'terms.yaml');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const terms = yaml.load(fs.readFileSync(termsPath, 'utf8'));

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

let hasErrors = false;

terms.forEach((term, index) => {
  const valid = validate(term);
  if (!valid) {
    hasErrors = true;
    console.error(`Term ${term.name || `#${index}`} is invalid:`);
    for (const err of validate.errors) {
      console.error(`  ${err.instancePath || '/'} ${err.message}`);
    }
  }
});

if (hasErrors) {
  process.exit(1);
} else {
  console.log('All terms valid.');
}
