import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { z } from 'zod';

const termSchema = z.object({
  term: z.string(),
  definition: z.string(),
});

export type Term = z.infer<typeof termSchema> & { slug: string; content: string };

const termsDir = path.join(process.cwd(), 'content/terms');

export async function getAllTerms(): Promise<Term[]> {
  const files = await fs.promises.readdir(termsDir);
  const terms: Term[] = [];
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue;
    const slug = file.replace(/\.mdx$/, '');
    const fullPath = path.join(termsDir, file);
    const source = await fs.promises.readFile(fullPath, 'utf8');
    const { data, content } = matter(source);
    const parsed = termSchema.parse(data);
    terms.push({ ...parsed, slug, content });
  }
  return terms;
}

export async function getTermBySlug(slug: string): Promise<Term> {
  const fullPath = path.join(termsDir, `${slug}.mdx`);
  const source = await fs.promises.readFile(fullPath, 'utf8');
  const { data, content } = matter(source);
  const parsed = termSchema.parse(data);
  return { ...parsed, slug, content };
}
