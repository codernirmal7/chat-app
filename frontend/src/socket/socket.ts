import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
let onlineUsers: string[] = [];

// Function to connect socket
export const connectSocket = (userId : string): Socket => {
  if (!socket) {

    socket = io(import.meta.env.VITE_SOCKET_BASE_URL, {
      withCredentials: true,
      query: {
        userId: userId || "",
      },
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket?.id);
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
