import { Server } from "socket.io";
import { NextResponse } from 'next/server';

let io: Server | undefined;

export async function GET() {
  try {
    // Lazily initialize the Socket.IO server so it only runs once per server.
    if (!io) {
      io = new Server({ path: '/api/socket' });
      io.on('connection', (socket) => {
        console.log('Client connected', socket.id);
      });
    }

    // The server is ready; return an empty 200 response.
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Socket initialization failed', error);
    return NextResponse.json(
      { error: 'Socket initialization failed' },
      { status: 500 }
    );
  }
}
