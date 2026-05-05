import { NextResponse } from 'next/server';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://alex-unnippillil.github.io';

const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  Vary: 'Origin',
};

export function apiJson<T>(body: T, status = 200): NextResponse<T> {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

export function apiError(message: string, status = 500): NextResponse<{ error: string }> {
  return apiJson({ error: message }, status);
}

export function apiOptions(): NextResponse<null> {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
