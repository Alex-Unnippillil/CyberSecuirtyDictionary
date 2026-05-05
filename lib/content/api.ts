import * as fs from 'node:fs';
import * as path from 'node:path';
import matter from 'gray-matter';

const CANONICAL_TERMS_DIR = path.join(process.cwd(), 'content', 'terms');

function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

function extractHeading(content: string): string | undefined {
  const heading = content.match(/^#\s+(.+)$/m);
  return heading?.[1]?.trim();
}

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\[\^\d+\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstSentence(text: string): string {
  if (!text) return '';
  const sentence = text.match(/[^.!?]+[.!?]/)?.[0]?.trim();
  return sentence || text;
}

function assertCanonicalTermsDirectoryExists(): void {
  if (!fs.existsSync(CANONICAL_TERMS_DIR)) {
    throw new Error(
      `Canonical terms directory is missing: ${CANONICAL_TERMS_DIR}. Expected content under content/terms/*.mdx.`
    );
  }

  const stats = fs.statSync(CANONICAL_TERMS_DIR);
  if (!stats.isDirectory()) {
    throw new Error(
      `Canonical terms path is not a directory: ${CANONICAL_TERMS_DIR}. Expected content under content/terms/*.mdx.`
    );
  }
}

export interface Term {
  name: string;
  title: string;
  slug: string;
  definition: string;
  body: string;
  category?: string;
  tags?: string[];
  synonyms?: string[];
  see_also?: string[];
  sources?: string[];
}

let cachedTerms: Term[] | null = null;

function parseTermFile(filePath: string): Term {
  const file = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(file);
  const fallbackSlug = path.basename(filePath, '.mdx');
  const slug = String(data.slug || fallbackSlug);
  const title = String(data.title || extractHeading(content) || slugToTitle(slug));
  const plainText = markdownToPlainText(content);

  return {
    name: title,
    title,
    slug,
    definition: String(data.shortDefinition || firstSentence(plainText) || title),
    body: content,
    category: typeof data.category === 'string' ? data.category : undefined,
    tags: Array.isArray(data.tags) ? data.tags.filter((t): t is string => typeof t === 'string') : undefined,
    synonyms: Array.isArray(data.synonyms)
      ? data.synonyms.filter((s): s is string => typeof s === 'string')
      : undefined,
    see_also: Array.isArray(data.see_also)
      ? data.see_also.filter((s): s is string => typeof s === 'string')
      : undefined,
    sources: Array.isArray(data.sources)
      ? data.sources.filter((s): s is string => typeof s === 'string')
      : undefined,
  };
}

function loadTerms(): Term[] {
  if (cachedTerms) {
    return cachedTerms;
  }

  assertCanonicalTermsDirectoryExists();

  const entries = fs
    .readdirSync(CANONICAL_TERMS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.mdx'))
    .map((entry) => path.join(CANONICAL_TERMS_DIR, entry.name));

  cachedTerms = entries.map(parseTermFile).sort((a, b) => a.title.localeCompare(b.title));
  return cachedTerms;
}

export function getAllTerms(): Term[] {
  return loadTerms();
}

export function getTermBySlug(slug: string): Term | undefined {
  return loadTerms().find((t) => t.slug === slug);
}

export function getSearchIndex(): Array<{ term: string; definition: string; slug: string; synonyms: string[] }> {
  return loadTerms().map((term) => ({
    term: term.title,
    definition: term.definition,
    slug: term.slug,
    synonyms: term.synonyms || [],
  }));
}

export function validateContentModel(): void {
  assertCanonicalTermsDirectoryExists();
}

validateContentModel();
