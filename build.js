const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// Determine project root relative to this script
const rootDir = __dirname;

const jsonPath = path.join(rootDir, "terms.json");
const yamlPath = path.join(rootDir, "data", "terms.yaml");
const legacyJsonPath = path.join(rootDir, "data.json");

let data;
if (fs.existsSync(jsonPath)) {
  data = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
} else if (fs.existsSync(yamlPath)) {
  const yamlData = yaml.load(fs.readFileSync(yamlPath, "utf8"));
  const terms = yamlData.map((t) => ({
    term: t.name,
    definition: t.definition,
    draft: t.draft || false,
    slug: t.slug,
  }));
  data = { terms };
  fs.writeFileSync(legacyJsonPath, JSON.stringify(data, null, 2));
} else {
  throw new Error("No terms.json or data/terms.yaml found");
}

const termsDir = path.join(rootDir, "terms");
fs.mkdirSync(termsDir, { recursive: true });

const baseUrl = "https://alex-unnippillil.github.io/CyberSecuirtyDictionary";

const urls = [];

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

for (const term of data.terms) {
  const slug = term.slug || slugify(term.term);
  const metaRobots = term.draft ? '<meta name="robots" content="noindex">' : "";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${term.term}</title>
  ${metaRobots}
</head>
<body>
  <h1>${term.term}</h1>
  <p>${term.definition}</p>
</body>
</html>`;
  fs.writeFileSync(path.join(termsDir, `${slug}.html`), html);
  if (!term.draft) {
    urls.push(`${baseUrl}/terms/${slug}.html`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(rootDir, "sitemap.xml"), sitemap);
