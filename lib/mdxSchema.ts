import { z } from 'zod';

/**
 * Shared schema for MDX front matter.
 */
export const mdxSchema = z
  .object({
    title: z.string(),
    slug: z.string(),
    summary: z.string()
  })
  .passthrough();

export type MdxFrontmatter = z.infer<typeof mdxSchema>;
