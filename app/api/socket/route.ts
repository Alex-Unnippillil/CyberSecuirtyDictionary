/**
 * Realtime Socket.IO is hosted by the custom Node server, not in route handlers.
 * This endpoint intentionally returns 410 to prevent accidental initialization here.
 */
export async function GET() {
  return Response.json(
    {
      error:
        "Socket.IO is served by the custom Node server layer. Configure NEXT_PUBLIC_SOCKET_URL/NEXT_PUBLIC_SOCKET_PATH on clients.",
    },
    { status: 410 },
  );
}
