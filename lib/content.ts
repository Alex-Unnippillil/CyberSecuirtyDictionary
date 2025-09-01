import { z } from 'zod';
import type { Ref, Related, TermMeta, TermDoc } from '../types/term';

export const refSchema: z.ZodType<Ref> = z.object({
  name: z.string(),
  url: z.string().url(),
});

export const relatedSchema: z.ZodType<Related> = z.object({
  slug: z.string(),
  name: z.string().optional(),
});

export const termMetaSchema: z.ZodType<TermMeta> = z.object({
  title: z.string(),
  slug: z.string(),
  definition: z.string(),
  category: z.string().optional(),
  synonyms: z.array(z.string()).optional(),
  related: z.array(relatedSchema).optional(),
  sources: z.array(refSchema).optional(),
});

export const termDocSchema: z.ZodType<TermDoc> = termMetaSchema.extend({
  body: z.string(),
});

export function parseTermFrontmatter(data: unknown): TermMeta {
  return termMetaSchema.parse(data);
}
