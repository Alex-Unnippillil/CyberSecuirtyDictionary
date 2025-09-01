import termsData from '../../terms.json';
import { buildIndex, SearchableTerm, Term } from './build-index';

const allTerms: Term[] = (termsData as { terms: Term[] }).terms;
const index: SearchableTerm[] = buildIndex(allTerms);

export interface SearchHit {
  term: string;
  definition: string;
}

export function search(query: string, limit = 10): SearchHit[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return index
    .filter((item) => item.term.toLowerCase().includes(q))
    .slice(0, limit)
    .map(({ term, definition }) => ({ term, definition }));
}
