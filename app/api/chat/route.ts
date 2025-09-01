import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export const runtime = 'edge';

// System prompts used for various modes of the AI expander
const SYSTEM_PROMPTS: Record<string, string> = {
  expander:
    'You are a cybersecurity term expander. Provide clear, concise explanations and cite canonical sources such as NIST, OWASP or Wikipedia.',
  coach:
    'You are a cybersecurity study coach. Offer guidance, examples and cite canonical sources when applicable.',
  mapper:
    'You are a cybersecurity concept mapper. Describe relationships between terms and cite canonical sources.',
};

const CANONICAL_HOSTS = [
  'nvd.nist.gov',
  'csrc.nist.gov',
  'owasp.org',
  'en.wikipedia.org',
];

function isCanonical(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return CANONICAL_HOSTS.some((allowed) => host.endsWith(allowed));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const { messages = [], mode = 'expander' } = await req.json();

  const system = SYSTEM_PROMPTS[mode] ?? SYSTEM_PROMPTS.expander;

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system,
    messages,
  });

  // Wrap the AI stream to filter out any non-canonical citation links
  const filtered = new ReadableStream({
    async start(controller) {
      for await (const chunk of result.stream) {
        if (chunk.type === 'citation') {
          if (isCanonical(chunk.url)) {
            controller.enqueue(JSON.stringify(chunk));
          }
          continue;
        }
        controller.enqueue(chunk.toString());
      }
      controller.close();
    },
  });

  return new Response(filtered, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
