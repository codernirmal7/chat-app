import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let onlineUsers: string[] = [];
let currentUserId: string | null = null;

// Function to connect socket
export const connectSocket = (userId : string): Socket => {
  if (!socket) {

    socket = io("https://209.74.87.56:443", {
      withCredentials: true,
      query: {
        userId: userId || "",
      },
    });

    socket.on("connect", () => {
      currentUserId = userId;  // Store the current user ID
    });

    socket.on("getOnlineUsers", (userIds) => {
      onlineUsers = userIds;  // Store the online users
      console.log("Online users:", userIds);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
  }
  return socket;
};

// Function to disconnect socket
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected.");
  }
};

// Function to get the current socket instance
export const getSocket = (): Socket | null => socket;

// Function to get the current online users
export const getOnlineUsers = (): string[] => onlineUsers;
export const getCurrentUserId = (): string | null => currentUserId;