const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const rootDir = path.join(__dirname, '..');
const termsYaml = path.join(rootDir, 'data', 'terms.yaml');
const apiDir = path.join(rootDir, 'api');
const apiTermsDir = path.join(apiDir, 'terms');

const content = fs.readFileSync(termsYaml, 'utf8');
const terms = yaml.load(content);

// Generate simplified terms.json for site consumption
const simplified = {
  terms: terms.map(t => ({
    term: t.name,
    slug: t.slug,
    definition: t.definition
  }))
};
fs.writeFileSync(
  path.join(rootDir, 'terms.json'),
  JSON.stringify(simplified, null, 2)
);

// Ensure API directories exist
fs.mkdirSync(apiTermsDir, { recursive: true });

// Write aggregated API file
fs.writeFileSync(
  path.join(apiDir, 'terms.json'),
  JSON.stringify({ terms }, null, 2)
);

// Write individual term files
for (const term of terms) {
  const slug = term.slug;
  fs.writeFileSync(
    path.join(apiTermsDir, `${slug}.json`),
    JSON.stringify(term, null, 2)
  );
}

console.log(`Generated ${terms.length} term files.`);
