# Realtime architecture note

## Deployment model decision

This project uses the **custom Node server** deployment model for realtime features. Socket.IO is hosted in the long-lived Node server process, and browser clients connect using environment-configurable settings (`NEXT_PUBLIC_SOCKET_URL` and `NEXT_PUBLIC_SOCKET_PATH`).

## Why route-handler-level Socket.IO initialization is avoided

Route handlers in serverless or edge-style runtimes are often short-lived and may be scaled across multiple instances. Initializing Socket.IO in a route handler can create fragmented connection state, duplicate server instances, and unreliable upgrades for WebSocket transport.

For those reasons, we avoid owning Socket.IO lifecycle inside `app/api/*` route handlers. Realtime infrastructure should be managed by the custom server layer where process lifetime and transport upgrades are predictable.

## Where realtime state lives

- **Server-side realtime state**: the custom Node server process (Socket.IO host).
- **Client connection state**: the `useSocket` hook (`hooks/useSocket.ts`), which tracks connection status, reconnect attempt count, and online/offline transitions with exponential backoff.
- **UI usage**: callers (for example `app/page.tsx`) consume the transport abstraction from `useSocket` and render graceful status while disconnected.
