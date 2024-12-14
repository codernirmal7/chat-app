import { Server } from "socket.io";
import http from "http";
import express from "express";
import "dotenv/config";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

const usersSocketMap: { [userId: string]: string } = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId as string;

  console.log(`Socket connected: ${socket.id}`);

  if (userId) {
    // Map userId to the socket.id
    usersSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId} -> ${socket.id}`);
  }

  //io.emit is used to send events to all connected clients

  io.emit("getOnlineUsers", Object.keys(usersSocketMap));

  // Listen for disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove the user from the map if they disconnect
    if (userId) delete usersSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(usersSocketMap));
  });
});

export { io, app, server };
