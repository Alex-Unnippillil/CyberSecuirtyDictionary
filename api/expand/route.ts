import { expandTopic, AIProvider } from '../../lib/ai';

/**
 * API route that expands a topic using the configured AI provider.
 * Expects a JSON body: `{ topic: string, prompt?: string, provider?: string }`.
 */
export async function POST(request: Request): Promise<Response> {
  const { topic, prompt = '', provider } = await request.json();
  const combined = prompt ? `${topic}\n\n${prompt}` : topic;

  const resolvedProvider: AIProvider =
    (provider as AIProvider) ||
    ((process.env.AI_PROVIDER as AIProvider) || 'openai');
  const apiKey =
    resolvedProvider === 'openai'
      ? process.env.OPENAI_API_KEY
      : process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response('Missing API key', { status: 500 });
  }

  const expansion = await expandTopic(combined, resolvedProvider, apiKey);
  return new Response(JSON.stringify({ expansion }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
