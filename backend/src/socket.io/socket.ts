import { Server, Socket } from "socket.io";
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

// Map to store userId and their corresponding socket ID
const usersSocketMap: Record<string, string> = {};

// Utility function to get socket ID for a user
export function getReceiverSocketId(userId: string): string | null {
  return usersSocketMap[userId] || null;
}

interface MessagePayload {
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt?: Date;
}

io.on("connection", (socket: Socket) => {
  const userId = socket.handshake.query?.userId as string;

  if (userId) {
    // Map userId to socket ID
    usersSocketMap[userId] = socket.id;
    socket.join(userId); // Join a room with the user's ID
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  // Notify all clients about online users
  io.emit("getOnlineUsers", Object.keys(usersSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    if (userId) {
      delete usersSocketMap[userId]; // Remove from the map
      socket.leave(userId); // Leave the room
      console.log(`User ${userId} disconnected, socket ID: ${socket.id}`);
    }

    // Update online users for all clients
    io.emit("getOnlineUsers", Object.keys(usersSocketMap));
  });

  // Handle sending messages
  socket.on("sendMessage", (data: MessagePayload) => {
    const { senderId, receiverId, text, image } = data;

    const message = {
      senderId,
      receiverId,
      text,
      image,
      createdAt: new Date(),
    };

    // Send the message to the receiver's room
    io.to(receiverId).emit("receiveMessage", message);
    io.to(senderId).emit("receiveMessage", message);
    console.log(`Message sent ${text}`);
  });

  // Handle joining a specific room
  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room: ${roomId}`);
  });

  // Handle leaving a specific room
  socket.on("leaveRoom", (roomId: string) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left room: ${roomId}`);
  });

  // Handle typing indicators (optional)
  socket.on(
    "typing",
    ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      io.to(receiverId).emit("userTyping", { senderId });
    }
  );

  socket.on(
    "stopTyping",
    ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
      io.to(receiverId).emit("userStoppedTyping", { senderId });
    }
  );
});

// Export the server and app for further use
export { io, app, server };
