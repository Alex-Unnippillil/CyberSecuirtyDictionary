#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const [,, title] = process.argv;

if (!title) {
  console.error('Usage: pnpm term:new "Title"');
  process.exit(1);
}

const slugify = str => str
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const baseSlug = slugify(title);
const contentDir = path.join(__dirname, '..', 'content', 'terms');
fs.mkdirSync(contentDir, { recursive: true });

let slug = baseSlug;
let filePath = path.join(contentDir, `${slug}.md`);
let counter = 1;
while (fs.existsSync(filePath)) {
  slug = `${baseSlug}-${counter++}`;
  filePath = path.join(contentDir, `${slug}.md`);
}

const frontMatterData = { title, slug };
let frontMatterYaml;
try {
  frontMatterYaml = yaml.dump(frontMatterData, { lineWidth: 100 });
  yaml.load(frontMatterYaml); // validate YAML
} catch (err) {
  console.error(`Invalid frontmatter: ${err.message}`);
  process.exit(1);
}

const starterSections = `\n## Definition\n\nTBD.\n\n## Sources\n\n- TBD\n`;
const fileContents = `---\n${frontMatterYaml}---${starterSections}`;

fs.writeFileSync(filePath, fileContents, 'utf8');
console.log(`Created ${filePath}`);
