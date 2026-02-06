import { chipsForTags } from '../../lib/prompts';
import { NextResponse } from 'next/server';

/**
 * Return prompt chips for the provided comma separated `tags` query parameter.
 */
export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const tagsParam = url.searchParams.get('tags') || '';
    const tags = tagsParam.split(',').map((t) => t.trim()).filter(Boolean);
    const suggestions = chipsForTags(tags);
    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Failed to generate suggestions', error);
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    );
  }
}
