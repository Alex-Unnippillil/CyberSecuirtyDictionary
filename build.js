const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "terms.json");
const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const termsDir = path.join(__dirname, "terms");
fs.mkdirSync(termsDir, { recursive: true });

const baseUrl =
  "https://alex-unnippillil.github.io/CyberSecuirtyDictionary/terms";

const urls = [];

function slugify(term) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCSVValue(value) {
  if (Array.isArray(value)) {
    value = value.join("; ");
  }
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

for (const term of data.terms) {
  const slug = slugify(term.term);
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
  <a href="${slug}.csv" download>Download CSV</a>
</body>
</html>`;
  fs.writeFileSync(path.join(termsDir, `${slug}.html`), html);

  const fields = [
    "term",
    "definition",
    "category",
    "synonyms",
    "see_also",
    "sources",
  ];
  const headers = [];
  const values = [];
  for (const field of fields) {
    if (term[field]) {
      headers.push(field);
      values.push(toCSVValue(term[field]));
    }
  }
  const csv = headers.join(",") + "\n" + values.join(",") + "\n";
  fs.writeFileSync(path.join(termsDir, `${slug}.csv`), csv);

  if (!term.draft) {
    urls.push(`${baseUrl}/${slug}.html`);
  }
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`;

fs.writeFileSync(path.join(__dirname, "sitemap.xml"), sitemap);
