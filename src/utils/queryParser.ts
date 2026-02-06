import { z } from 'zod';

/**
 * Generic helper to parse URL query parameters with a Zod schema.
 * Returns the parsed data or an error message when validation fails.
 */
export function parseQuery<T extends z.ZodTypeAny>(
  url: string,
  schema: T
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const params = Object.fromEntries(new URL(url).searchParams.entries());
  const result = schema.safeParse(params);
  if (!result.success) {
    const message = result.error.errors.map((e) => e.message).join(', ');
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}

// Schema for the search API.
export const searchQuerySchema = z
  .object({ q: z.string().trim().min(1).transform((v) => v.toLowerCase()) })
  .strict();

// Schema for endpoints that expect no query parameters.
export const emptyQuerySchema = z.object({}).strict();
