import { apiOptions } from '../_lib/http';
import { log } from '../_lib/logger';
import { Server } from "socket.io";

let io: Server | undefined;

export async function GET() {
  // Lazily initialize the Socket.IO server so it only runs once per server.
  if (!io) {
    io = new Server({ path: "/api/socket" });
    io.on("connection", (socket) => {
      log('info', 'Socket client connected', { socketId: socket.id });
    });
  }

  // The server is ready; return an empty 200 response.
  return new Response(null, { status: 200 });
}


export function OPTIONS() {
  return apiOptions();
}
