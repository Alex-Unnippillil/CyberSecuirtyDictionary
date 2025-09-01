import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define the allowed origin for CORS
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://alex-unnippillil.github.io';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  // Only apply headers to API routes
  if (pathname.startsWith('/api')) {
    // Enforce strict CORS policy
    if (origin && origin !== allowedOrigin) {
      return new NextResponse(null, { status: 403 });
    }

    const response = NextResponse.next();

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
  matcher: '/api/:path*',
};
