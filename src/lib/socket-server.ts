/**
 * Socket.io server singleton.
 *
 * Because Next.js can hot-reload modules in development, we store the io
 * instance on the global object so it survives reloads without creating
 * duplicate server instances.
 *
 * Usage in API routes:
 *   import { getIO, emitToAdmins } from "@/lib/socket-server";
 */
import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import { SOCKET_EVENTS } from "./socket-events";

declare global {
  // eslint-disable-next-line no-var
  var _io: IOServer | undefined;
}

export function initSocketServer(httpServer: HTTPServer): IOServer {
  if (global._io) return global._io;

  const io = new IOServer(httpServer, {
    path: "/api/socket/io",
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    // Admin clients join the admin room to receive live updates
    socket.on(SOCKET_EVENTS.ADMIN_JOIN, () => {
      socket.join("admin:applications");
    });

    socket.on("disconnect", () => {
      // cleanup handled automatically by Socket.io
    });
  });

  global._io = io;
  return io;
}

export function getIO(): IOServer | null {
  return global._io ?? null;
}

// ─── Emit helpers ────────────────────────────────────────────

export function emitToAdmins(event: string, data: unknown): void {
  const io = getIO();
  if (io) {
    io.to("admin:applications").emit(event, data);
  }
}
