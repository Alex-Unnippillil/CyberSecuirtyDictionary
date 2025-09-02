import { expandTopic } from '@lib/ai';

/**
 * API route that expands a topic using the configured AI provider.
 * Expects a JSON body: `{ topic: string, prompt?: string, provider?: string }`.
 */
export async function POST(request: Request): Promise<Response> {
  const { topic, prompt = '', provider } = await request.json();
  const combined = prompt ? `${topic}\n\n${prompt}` : topic;
  const expansion = await expandTopic(combined, provider);
  return new Response(JSON.stringify({ expansion }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
