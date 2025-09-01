import { readFileSync } from "fs";
import path from "path";

interface TermEntry {
  term?: string;
  name?: string;
  definition?: string;
  synonyms?: string[];
  [key: string]: any;
}

let cache: TermEntry[] | null = null;

function loadIndex(): TermEntry[] {
  if (!cache) {
    const indexPath = path.resolve(__dirname, "../../index.json");
    const raw = readFileSync(indexPath, "utf8");
    const data = JSON.parse(raw);
    cache = Array.isArray(data) ? data : data.terms || [];
  }
  return cache;
}

export function search(query: string): TermEntry[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return loadIndex().filter((entry) => {
    const term = (entry.term || entry.name || "").toLowerCase();
    const def = (entry.definition || "").toLowerCase();
    const syns = (entry.synonyms || []).map((s) => s.toLowerCase());
    return (
      term.includes(q) || def.includes(q) || syns.some((s) => s.includes(q))
    );
  });
}

export function suggest(query: string): string[] {
  if (!query) return [];
  const q = query.toLowerCase();
  const suggestions: string[] = [];
  for (const entry of loadIndex()) {
    const term = (entry.term || entry.name || "").toLowerCase();
    if (term.startsWith(q)) {
      suggestions.push(entry.term || entry.name || "");
    }
  }
  return suggestions.slice(0, 10);
}

export default { search, suggest };
