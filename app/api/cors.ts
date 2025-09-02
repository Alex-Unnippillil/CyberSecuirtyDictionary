import { NextResponse } from "next/server";

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  process.env.ALLOWED_ORIGIN ||
  "https://alex-unnippillil.github.io"
)
  .split(",")
  .map((origin) => origin.trim());

/**
 * Ensures requests come from trusted origins.
 * Returns a 403 response if the origin header is not in the whitelist.
 */
export function verifyOrigin(request: Request): Response | null {
  const origin = request.headers.get("origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return null;
}

/**
 * Adds CORS headers to the response for a valid origin.
 */
export function withCors(request: Request, response: Response): Response {
  const origin = request.headers.get("origin");
  const allowed =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  response.headers.set("Access-Control-Allow-Origin", allowed);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Vary", "Origin");
  return response;
}

/**
 * Handles CORS preflight requests.
 */
export function handleOptions(request: Request): Response {
  const origin = request.headers.get("origin");
  const response = new NextResponse(null, { status: 204 });
  const allowed =
    origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  response.headers.set("Access-Control-Allow-Origin", allowed);
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Vary", "Origin");
  return response;
}
