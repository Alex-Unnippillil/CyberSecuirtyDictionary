import { NextRequest, NextResponse } from 'next/server';
import { search } from '../../../lib/search/runtime';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const hits = search(q);
  return NextResponse.json({ hits });
}
