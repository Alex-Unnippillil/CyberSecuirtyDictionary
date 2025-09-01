// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const yaml = require('js-yaml');

interface Term {
  name: string;
  slug?: string;
  sources?: unknown;
}

const termsPath = path.join(__dirname, '../data/terms.yaml');
const file = fs.readFileSync(termsPath, 'utf8');
const terms = yaml.load(file) as Term[];

let hasError = false;

for (const term of terms) {
  const missing: string[] = [];
  if (!term.slug) {
    missing.push('slug');
  }
  if (!Array.isArray(term.sources) || term.sources.length === 0) {
    missing.push('sources');
  }

  if (missing.length > 0) {
    hasError = true;
    console.error(
      `Term "${term.name}" is missing: ${missing.join(', ')}`
    );
  }
}

if (hasError) {
  process.exit(1);
}
