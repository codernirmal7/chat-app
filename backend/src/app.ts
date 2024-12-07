import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./rotues/auth.route";
import userRouter from "./rotues/user.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

//routes
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)

export default app;