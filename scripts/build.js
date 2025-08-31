const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const termsYamlPath = path.join(__dirname, "..", "data", "terms.yaml");
const termsJsonPath = path.join(__dirname, "..", "terms.json");

function loadTerms() {
  const file = fs.readFileSync(termsYamlPath, "utf8");
  return yaml.load(file);
}

function ensureSources(term, today) {
  if (!term.sources || term.sources.length === 0) {
    throw new Error(`Term "${term.name}" must include at least one source`);
  }
  return term.sources.map((src) => {
    if (typeof src === "string") {
      return { url: src, accessed: today };
    }
    return {
      url: src.url,
      accessed: src.accessed || today,
    };
  });
}

function build() {
  const terms = loadTerms();
  const today = new Date().toISOString().split("T")[0];
  const output = {
    terms: terms.map((t) => ({
      term: t.name,
      slug: t.slug,
      definition: t.definition,
      category: t.category,
      synonyms: t.synonyms,
      see_also: t.see_also,
      sources: ensureSources(t, today),
    })),
  };
  fs.writeFileSync(termsJsonPath, JSON.stringify(output, null, 2));
  console.log(`Wrote ${output.terms.length} terms to ${termsJsonPath}`);
}

build();
