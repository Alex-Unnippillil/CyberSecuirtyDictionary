import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

// Initialize OpenAI client using the API key from environment variables.
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

// Handle POST requests to the chat endpoint. This uses the `streamText`
// helper to stream tokens from the model and return partial results as
// they are generated.
export async function POST(req: Request): Promise<Response> {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages,
    });

    // Convert the stream into a `Response` object that emits Server-Sent
    // Events. Each event contains partial model output so the caller can
    // render tokens incrementally.
    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Chat streaming failed', error);
    return new NextResponse('Failed to generate chat response', { status: 500 });
  }
}
