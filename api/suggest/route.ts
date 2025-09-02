import { chipsForTags } from '@lib/prompts';

/**
 * Return prompt chips for the provided comma separated `tags` query parameter.
 */
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const tagsParam = url.searchParams.get('tags') || '';
  const tags = tagsParam.split(',').map((t) => t.trim()).filter(Boolean);
  const suggestions = chipsForTags(tags);
  return new Response(JSON.stringify({ suggestions }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
