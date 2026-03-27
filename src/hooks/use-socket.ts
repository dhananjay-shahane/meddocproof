"use client";

/**
 * useSocket — Client-side Socket.io connection hook.
 *
 * Connects to the Socket.io server (same origin, path /api/socket/io).
 * Automatically reconnects on disconnect.  Call `joinAdminRoom()` once
 * the admin is authenticated to start receiving live application events.
 *
 * Usage:
 *   const { socket, connected } = useSocket();
 *   useEffect(() => { socket?.emit("admin:join"); }, [socket]);
 */

import { useEffect, useRef, useState } from "react";
import { io as socketIO, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@/lib/socket-events";

let globalSocket: Socket | null = null;

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Reuse the global socket if it already exists (module-level singleton)
    if (!globalSocket) {
      globalSocket = socketIO({
        path: "/api/socket/io",
        transports: ["websocket", "polling"],
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });
    }

    const socket = globalSocket;
    socketRef.current = socket;

    const onConnect = () => {
      setConnected(true);
    };

    const onDisconnect = () => {
      setConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (socket.connected) {
      setConnected(true);
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  const joinAdminRoom = () => {
    socketRef.current?.emit(SOCKET_EVENTS.ADMIN_JOIN);
  };

  return {
    socket: socketRef.current,
    connected,
    joinAdminRoom,
  };
}
