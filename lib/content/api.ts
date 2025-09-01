import * as fs from 'fs';
import * as path from 'path';
import { load } from 'js-yaml';

export interface Term {
  name: string;
  slug: string;
  definition: string;
  category?: string;
  synonyms?: string[];
  see_also?: string[];
  sources?: string[];
}

let cachedTerms: Term[] | null = null;

function loadTerms(): Term[] {
  if (cachedTerms) {
    return cachedTerms;
  }
  const filePath = path.join(__dirname, '../../data/terms.yaml');
  const file = fs.readFileSync(filePath, 'utf8');
  const loaded = load(file) as Term[] | { terms: Term[] };
  const terms = Array.isArray(loaded) ? loaded : (loaded as { terms: Term[] }).terms;
  cachedTerms = terms;
  return terms;
}

export function getAllTerms(): Term[] {
  return loadTerms();
}

export function getTermBySlug(slug: string): Term | undefined {
  return loadTerms().find((t) => t.slug === slug);
}
