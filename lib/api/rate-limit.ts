import { NextRequest } from 'next/server';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function getClientId(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) {
    return fwd.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 'unknown-client';
}

export function consumeRateLimit(
  request: NextRequest,
  options: { routeKey: string; limit: number; windowMs: number }
): { allowed: true; remaining: number; resetAt: number } | { allowed: false; retryAfterSec: number } {
  const now = Date.now();
  const key = `${options.routeKey}:${getClientId(request)}`;
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + options.windowMs });
    return {
      allowed: true,
      remaining: options.limit - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (bucket.count >= options.limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  bucket.count += 1;
  buckets.set(key, bucket);
  return {
    allowed: true,
    remaining: options.limit - bucket.count,
    resetAt: bucket.resetAt,
  };
}
