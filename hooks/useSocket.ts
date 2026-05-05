"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type ConnectionState = "idle" | "connecting" | "connected" | "offline" | "error";

type RealtimeTransport = "socketio";

export type RealtimeConnection = {
  socket: Socket | null;
  state: ConnectionState;
  transport: RealtimeTransport;
  reconnectAttempt: number;
};

const SOCKET_PATH = process.env.NEXT_PUBLIC_SOCKET_PATH ?? "/socket.io";
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

/**
 * Connects to the realtime backend hosted by the custom Node server.
 * Includes bounded exponential retry and graceful offline detection.
 */
export function useSocket(): RealtimeConnection {
  const [state, setState] = useState<ConnectionState>("idle");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  const connection = useMemo(
    () => ({
      socket: socketRef.current,
      state,
      transport: "socketio" as const,
      reconnectAttempt,
    }),
    [state, reconnectAttempt],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!navigator.onLine) {
      setState("offline");
      return;
    }

    setState("connecting");

    const socket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
      reconnectionDelayMax: 8000,
      randomizationFactor: 0.5,
      timeout: 10000,
    });

    socketRef.current = socket;

    const markOffline = () => {
      setState("offline");
    };

    const markConnecting = () => {
      setState("connecting");
    };

    const markConnected = () => {
      setReconnectAttempt(0);
      setState("connected");
    };

    const onReconnectAttempt = (attempt: number) => {
      setReconnectAttempt(attempt);
      setState("connecting");
    };

    const onConnectError = () => {
      setState(navigator.onLine ? "error" : "offline");
    };

    window.addEventListener("online", markConnecting);
    window.addEventListener("offline", markOffline);

    socket.on("connect", markConnected);
    socket.on("disconnect", () => {
      setState(navigator.onLine ? "connecting" : "offline");
    });
    socket.on("reconnect_attempt", onReconnectAttempt);
    socket.on("connect_error", onConnectError);

    return () => {
      window.removeEventListener("online", markConnecting);
      window.removeEventListener("offline", markOffline);
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      setState("idle");
    };
  }, []);

  return connection;
}

export default useSocket;
