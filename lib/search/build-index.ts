export interface Term {
  term: string;
  definition: string;
}

export interface SearchableTerm extends Term {
  tokens: string[];
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/\s+/)
    .map((token) => token.replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);
}

export function buildIndex(allTerms: Term[]): SearchableTerm[] {
  return allTerms.map((t) => ({ ...t, tokens: tokenize(t.term) }));
}
