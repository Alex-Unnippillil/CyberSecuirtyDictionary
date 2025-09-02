import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

/**
 * Establishes a Socket.IO connection and cleans up on unmount.
 * Returns the active socket instance or null while connecting.
 */
export function useSocket(): Socket | null {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io({ path: "/api/socket" });
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}

export default useSocket;
