// app.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

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
const secretkeyJWT = "asdfghjdfghjdfgha";

app.get("/", (req, res) => {
  res.send("Socket.IO with Express works!");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _id: "asdfghjdfghjdfgha", secretkeyJWT });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      message: "Login Success",
    });
});
const user = false;

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err) => {
    const token = socket.request.cookies.token;
    if (!token) return next(new Error("Authentication Error"));
    const decoded = jwt.verify(token, secretkeyJWT);
    next();
  });
  if (user) next();
});
io.on("connection", (socket) => {
  console.log("User Connected", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log({ room, message });
    socket.to(room).emit("received-message", message);
  });

  socket.on("join-room", (room) => {
    socket.join(room);
  });
});
io.on("disconnected", () => {
  console.log("User Disconnected", socket.id);
});

server.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
