// app.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));

const server = http.createServer(app); // ✅ create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
}); // ✅ pass HTTP server to Socket.IO

app.use(cors());

app.get("/", (req, res) => {
  res.send("Socket.IO with Express works!");
});

io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("message", (data) => {
    console.log(data);
    io.emit("message", data);
  });
});
socket.on("disconnected", () => {
  console.log("User Disconnected", socket.id);
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
