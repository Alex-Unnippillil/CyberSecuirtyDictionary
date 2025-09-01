import crypto from 'crypto';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Middleware that generates a nonce for each request and applies a
 * Content-Security-Policy header. The nonce is exposed through response
 * headers so that downstream handlers or templates can apply it to inline
 * scripts.
 */
export function middleware(req: NextRequest) {
  const nonce = crypto.randomBytes(16).toString('base64');
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-csp-nonce', nonce);

  const res = NextResponse.next({ request: { headers: requestHeaders } });

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "object-src 'none'",
    "base-uri 'none'",
    "report-uri /csp-report"
  ].join('; ');

  if (process.env.CSP_ENFORCE === 'true') {
    res.headers.set('Content-Security-Policy', directives);
  } else {
    res.headers.set('Content-Security-Policy-Report-Only', directives);
  }

  res.headers.set('X-CSP-Nonce', nonce);
  return res;
}

/**
 * Endpoint to receive CSP violation reports. It simply logs the report so
 * that administrators can monitor for any unexpected resource loads.
 */
export async function cspReportLogger(req: NextRequest) {
  const report = await req.json().catch(() => null);
  console.log('CSP Violation Report:', report);
  return new NextResponse(null, { status: 204 });
}

export const config = {
  matcher: '/:path*',
};
