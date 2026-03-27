/**
 * Custom Next.js server with Socket.io attached.
 *
 * Why a custom server?
 * Next.js's built-in `next dev` / `next start` commands use their own HTTP
 * server. Socket.io needs access to the same underlying http.Server instance
 * so it can upgrade HTTP connections to WebSockets.  A custom server lets us
 * create the http.Server first, attach Socket.io to it, then pass it to Next.
 *
 * Run with:
 *   node server.js          (production)
 *   node server.js --dev    (development)
 */

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server: IOServer } = require("socket.io");

const dev = process.argv.includes("--dev") || process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // ─── Attach Socket.io ──────────────────────────────────────
  const io = new IOServer(httpServer, {
    path: "/api/socket/io",
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // Make io available to Next.js API routes via the global object
  // (same pattern as src/lib/socket-server.ts uses global._io)
  global._io = io;

  io.on("connection", (socket) => {
    socket.on("admin:join", () => {
      socket.join("admin:applications");
    });
  });
  // ──────────────────────────────────────────────────────────

  httpServer.listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port} [${dev ? "dev" : "prod"}]`);
    console.log(`> Socket.io attached at /api/socket/io`);
  });
});
