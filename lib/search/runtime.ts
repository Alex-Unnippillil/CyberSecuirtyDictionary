import { getSearchIndex } from "@/lib/content/api";

interface TermEntry {
  term: string;
  definition: string;
  slug: string;
  synonyms?: string[];
  [key: string]: any;
}

let cache: TermEntry[] | null = null;

function loadIndex(): TermEntry[] {
  if (!cache) {
    cache = getSearchIndex();
  }
  return cache;
}

export function search(query: string): TermEntry[] {
  if (!query) return [];
  const q = query.toLowerCase();
  return loadIndex().filter((entry) => {
    const term = (entry.term || "").toLowerCase();
    const def = (entry.definition || "").toLowerCase();
    const syns = (entry.synonyms || []).map((s) => s.toLowerCase());
    return term.includes(q) || def.includes(q) || syns.some((s) => s.includes(q));
  });
}

export function suggest(query: string): string[] {
  if (!query) return [];
  const q = query.toLowerCase();
  const suggestions: string[] = [];
  for (const entry of loadIndex()) {
    const term = (entry.term || "").toLowerCase();
    if (term.startsWith(q)) {
      suggestions.push(entry.term || "");
    }
  }
  return suggestions.slice(0, 10);
}

export default { search, suggest };
