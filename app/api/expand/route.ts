import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { term, definition } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OPENAI_API_KEY' }, { status: 500 });
  }
  const prompt = `Expand the following cybersecurity term with a detailed explanation:\n\n${term}: ${definition}`;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  const data = await res.json();
  const expanded = data.choices?.[0]?.message?.content ?? '';
  return NextResponse.json({ expanded });
}
