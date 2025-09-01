import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware that generates a nonce for each request and applies a
 * Content-Security-Policy header. The nonce is exposed through both a
 * response header and `res.locals` so that downstream handlers or
 * templates can apply it to inline scripts.
 */
export function cspNonceMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const nonce = crypto.randomBytes(16).toString('base64');
  // Make the nonce available to templates
  (res.locals as any).nonce = nonce;
  // Also expose the nonce via a response header
  res.setHeader('X-CSP-Nonce', nonce);

  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline'",
    "object-src 'none'",
    "base-uri 'none'",
    "report-uri /csp-report"
  ].join('; ');

  // Start in report-only mode so violations are logged without blocking.
  // Once the site reports zero violations this can be flipped to enforce
  // the policy by setting the `CSP_ENFORCE` environment variable.
  if (process.env.CSP_ENFORCE === 'true') {
    res.setHeader('Content-Security-Policy', directives);
  } else {
    res.setHeader('Content-Security-Policy-Report-Only', directives);
  }

  next();
}

/**
 * Endpoint to receive CSP violation reports. It simply logs the report so
 * that administrators can monitor for any unexpected resource loads.
 */
export function cspReportLogger(req: Request, res: Response): void {
  console.log('CSP Violation Report:', req.body);
  res.status(204).end();
}

export default cspNonceMiddleware;
