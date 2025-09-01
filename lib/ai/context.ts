export interface TermFrontMatter {
  name?: string;
  term?: string;
  definition?: string;
  category?: string;
  synonyms?: string[];
  see_also?: string[];
  sources?: string[];
  [key: string]: any;
}

/**
 * Build a concise context string for a term from its MDX front matter.
 */
export function toContext(term: TermFrontMatter): string {
  const parts: string[] = [];

  const title = term.name || term.term;
  if (title) parts.push(title);
  if (term.definition) parts.push(term.definition);
  if (term.category) parts.push(`Category: ${term.category}`);
  if (term.synonyms && term.synonyms.length)
    parts.push(`Synonyms: ${term.synonyms.join(", ")}`);
  if (term.see_also && term.see_also.length)
    parts.push(`See also: ${term.see_also.join(", ")}`);

  return parts.join(" | ");
}
