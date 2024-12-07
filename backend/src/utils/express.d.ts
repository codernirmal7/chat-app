// src/types/express.d.ts
import { Request } from "express";

interface UserData {
  userId: string;
  fullName: string;
  email: string;
  username: string;
  emailVerifiedAt: Date;
  avatar: string;
  accountCreatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      userData?: User; // or specify the type if you have a specific structure for userData
    }
  }
}