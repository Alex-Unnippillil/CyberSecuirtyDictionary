import { Server } from "socket.io";
import logger from "../../../src/utils/logger";

let io: Server | undefined;

export async function GET() {
  // Lazily initialize the Socket.IO server so it only runs once per server.
  if (!io) {
    io = new Server({ path: "/api/socket" });
    io.on("connection", (socket) => {
      logger.info("Client connected", socket.id);
    });
  }

  // The server is ready; return an empty 200 response.
  return new Response(null, { status: 200 });
}
