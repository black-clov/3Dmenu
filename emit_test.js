const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer();
const io = new Server(server, {
  cors: { origin: "*" },
  path: "/api/tokens/current", // 👈 this must match the Python SOCKET_IO_URL path
});

server.listen(5000, () => {
  console.log("Socket.IO test server running on port 5000 (path /api/tokens/current)");
});

setTimeout(() => {
  console.log("Emitting test tokenUpdate...");
  io.emit("tokenUpdate", { tableId: "table2", token: "testToken12345" });
}, 3000);
