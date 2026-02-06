import { expandTopic } from '../../lib/ai';
import { NextResponse } from 'next/server';

/**
 * API route that expands a topic using the configured AI provider.
 * Expects a JSON body: `{ topic: string, prompt?: string, provider?: string }`.
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const { topic, prompt = '', provider } = await request.json();
    const combined = prompt ? `${topic}\n\n${prompt}` : topic;
    const expansion = await expandTopic(combined, provider);
    return NextResponse.json({ expansion });
  } catch (error) {
    console.error('Failed to expand topic', error);
    return NextResponse.json(
      { error: 'Failed to expand topic' },
      { status: 500 }
    );
  }
}
