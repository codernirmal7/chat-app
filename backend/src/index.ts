import "dotenv/config";
import connectToDB from "./db/mongo.db";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./rotues/auth.route";
import userRouter from "./rotues/user.route";
import { app , server } from "./socket.io/socket";
import express from "express";
import messageRouter from "./rotues/message.route";
import { secureEndpointAccess } from "./middlewares/secureEndpointAccess.middleware";

const PORT = process.env.PORT || 5347; // Set 5347 as default when no port is defined

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    // origin: process.env.FRONTEND_URL, // Explicitly allow your frontend
    origin: "http://localhost:5173", // Explicitly allow your frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());

// app.use("/api/*",secureEndpointAccess)

//routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/messages", messageRouter)

connectToDB(process.env.MONGODB_CONNECTION_URI as string)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(error);
  });
