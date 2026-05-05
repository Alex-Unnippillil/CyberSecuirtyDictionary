import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authorizeMutation } from './lib/api/auth';
import { consumeRateLimit } from './lib/api/rate-limit';

// Define the allowed origin for CORS
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://alex-unnippillil.github.io';

export function middleware(request: NextRequest) {
  console.log(`Incoming request: ${request.method} ${request.url}`);
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Only apply headers to API routes
  if (pathname.startsWith('/api')) {
    // Enforce strict CORS policy
    if (origin && origin !== allowedOrigin) {
      return new NextResponse(null, { status: 403 });
    }

    const response = NextResponse.next();

    if (pathname === '/api/feedback') {
      const limit = consumeRateLimit(request, {
        routeKey: 'feedback',
        limit: 10,
        windowMs: 60_000,
      });
      if (!limit.allowed) {
        return NextResponse.json(
          { success: false, error: { code: 'RATE_LIMITED', message: 'Too many feedback requests.' } },
          { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
        );
      }
    }

    if (pathname.startsWith('/api/terms')) {
      const limit = consumeRateLimit(request, {
        routeKey: pathname.startsWith('/api/terms/') ? 'terms-item' : 'terms-collection',
        limit: 30,
        windowMs: 60_000,
      });
      if (!limit.allowed) {
        return NextResponse.json(
          { success: false, error: { code: 'RATE_LIMITED', message: 'Too many term requests.' } },
          { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } }
        );
      }
    }

    if (pathname === '/api/feedback' || pathname.startsWith('/api/terms')) {
      const auth = authorizeMutation(request);
      if (!auth.ok) {
        return auth.response;
      }
    }

    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Vary', 'Origin');

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
