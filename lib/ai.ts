export type AIProvider = 'openai' | 'anthropic';

/**
 * Expand a topic using the configured AI provider. The provider can be
 * specified explicitly or via the AI_PROVIDER environment variable.
 */
export async function expandTopic(
  topic: string,
  provider: AIProvider = (process.env.AI_PROVIDER as AIProvider) || 'openai'
): Promise<string> {
  switch (provider) {
    case 'openai':
      return openAIExpand(topic);
    case 'anthropic':
      return anthropicExpand(topic);
    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

async function openAIExpand(topic: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('Missing OPENAI_API_KEY');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: `Expand on: ${topic}` }]
    })
  });
  const data = await res.json();
  // OpenAI responses may vary in structure; attempt to retrieve the text safely.
  const text = data?.choices?.[0]?.message?.content;
  return typeof text === 'string' ? text.trim() : '';
}

async function anthropicExpand(topic: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Missing ANTHROPIC_API_KEY');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 256,
      messages: [{ role: 'user', content: `Expand on: ${topic}` }]
    })
  });
  const data = await res.json();
  const text = data?.content?.[0]?.text;
  return typeof text === 'string' ? text.trim() : '';
}
