// src/types/express.d.ts
import { Request } from "express";

interface UserData {
  id: string;
  email: string;
  lastTimeSignIn: Date;
  createdAt : Date
  // Add more fields as per your user model
}

declare global {
  namespace Express {
    interface Request {
      userData?: User; // or specify the type if you have a specific structure for userData
    }
  }
}