import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
import "dotenv/config";
import Message from "../models/Message.model";

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
  seen: boolean;
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
  socket.on("sendMessage", async (data: MessagePayload) => {
    const { senderId, receiverId, text, image, seen } = data;

    const message = {
      senderId,
      receiverId,
      text,
      image,
      seen: false,
      createdAt: new Date(),
    };

    // Send the message to the receiver's room
    io.to(receiverId).emit("receiveMessage", message);
    io.to(senderId).emit("receiveMessage", message);

    const unseenCount = await Message.countDocuments({ receiverId, seen: false });

    // Emit the unseen count update for the receiver only
    io.to(receiverId).emit("updateUnseenCount", { senderId, unseenCount });
  });

  // Handle joining a specific room
  socket.on("joinRoom", (roomId: string) => {
    socket.join(roomId);
  });

  // Handle leaving a specific room
  socket.on("leaveRoom", (roomId: string) => {
    socket.leave(roomId);
  });

  socket.on(
    "typing",
    ({ senderId, receiverId, isTyping }: { senderId: string; receiverId: string; isTyping: boolean }) => {
      io.to(receiverId).emit("userTyping", { senderId, isTyping });
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
