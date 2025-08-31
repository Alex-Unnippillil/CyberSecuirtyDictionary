#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const root = path.join(__dirname, "..");
const termsDir = path.join(root, "terms");
const redirectsPath = path.join(root, "redirects.json");
const termsYamlPath = path.join(root, "data", "terms.yaml");

const slugify = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

if (!fs.existsSync(termsDir)) {
  console.error(`Terms directory not found: ${termsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(termsDir).filter((f) => f.endsWith(".md"));

let termsData = [];
if (fs.existsSync(termsYamlPath)) {
  const yamlRaw = fs.readFileSync(termsYamlPath, "utf8");
  termsData = yaml.load(yamlRaw) || [];
}

const redirects = {};

files.forEach((file) => {
  const filePath = path.join(termsDir, file);
  const raw = fs.readFileSync(filePath, "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)/);
  let front = {};
  let body = raw;
  if (match) {
    front = yaml.load(match[1]) || {};
    body = match[2];
  }

  const oldFileSlug = path.parse(file).name;
  const targetSlug = front.slug || oldFileSlug;
  const newSlug = slugify(targetSlug);
  front.slug = newSlug;

  const newContent = `---\n${yaml.dump(front)}---\n${body}`;
  fs.writeFileSync(filePath, newContent);

  const newFileName = `${newSlug}.md`;
  if (newFileName !== file) {
    fs.renameSync(filePath, path.join(termsDir, newFileName));
    redirects[`/${oldFileSlug}`] = `/${newSlug}`;

    const item = termsData.find((t) => t.slug === oldFileSlug);
    if (item) item.slug = newSlug;
  }
});

if (termsData.length) {
  fs.writeFileSync(termsYamlPath, yaml.dump(termsData));
}

fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2));
