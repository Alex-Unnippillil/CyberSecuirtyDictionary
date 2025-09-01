import { NextRequest, NextResponse } from 'next/server';
import { getAllTerms } from '@/lib/terms';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase();
  const terms = await getAllTerms();
  const results = terms.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q)
  );
  return NextResponse.json(results.map(({ term, slug }) => ({ term, slug })));
}
