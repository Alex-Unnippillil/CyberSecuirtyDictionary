import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

// Simple script to build a search index from terms.json
const termsPath = join(process.cwd(), "terms.json");
const outputDir = join(process.cwd(), "assets");
const outputPath = join(outputDir, "search-index.json");

const raw = readFileSync(termsPath, "utf8");
const { terms } = JSON.parse(raw);

const index = terms.map((t: any) => ({
  term: t.term ?? t.name,
  definition: t.definition,
}));

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, JSON.stringify(index, null, 2) + "\n");
console.log(`Search index generated at ${outputPath}`);
