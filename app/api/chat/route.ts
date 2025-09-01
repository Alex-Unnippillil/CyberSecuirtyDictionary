import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL);

const WINDOW_SECONDS = 60; // rate limit window
const MAX_REQUESTS = 5; // allowed requests per window

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const key = `rate_limit:${ip}`;

  const results = await redis.multi().incr(key).ttl(key).exec();
  const count = Number(results?.[0]?.[1] ?? 0);
  let ttl = Number(results?.[1]?.[1] ?? 0);

  if (ttl === -1) {
    const jitter = Math.floor(Math.random() * WINDOW_SECONDS);
    ttl = WINDOW_SECONDS + jitter;
    await redis.expire(key, ttl);
  }

  if (count > MAX_REQUESTS) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": ttl.toString(),
      },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
