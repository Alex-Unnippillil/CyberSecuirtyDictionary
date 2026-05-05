import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const allowedOrigin = process.env.ALLOWED_ORIGIN || 'https://alex-unnippillil.github.io';
const shouldLogRequests = process.env.NODE_ENV === 'development' && process.env.LOG_REQUEST_URLS === 'true';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');

  if (shouldLogRequests) {
    console.debug(`Incoming API request: ${request.method} ${pathname}`);
  }

  if (pathname.startsWith('/api')) {
    if (origin && origin !== allowedOrigin) {
      return new NextResponse(null, { status: 403 });
    }

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': allowedOrigin,
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          Vary: 'Origin',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
