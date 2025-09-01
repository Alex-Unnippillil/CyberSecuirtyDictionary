import * as fs from "fs";
import * as path from "path";
import { buildIndex, Term } from "../lib/search/build-index";

async function main() {
  const root = path.resolve(__dirname, "..");
  const termsPath = path.join(root, "terms.json");
  const raw = fs.readFileSync(termsPath, "utf8");
  const data = JSON.parse(raw);
  const terms: Term[] = Array.isArray(data) ? data : data.terms || [];

  const index = buildIndex(terms);

  const outDir = path.join(root, "public");
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "index.json");
  fs.writeFileSync(outPath, JSON.stringify(index));
  const stats = fs.statSync(outPath);
  if (stats.size > 100 * 1024) {
    throw new Error(`Search index too large: ${stats.size} bytes`);
  }
  console.log(`Wrote ${outPath} (${stats.size} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
