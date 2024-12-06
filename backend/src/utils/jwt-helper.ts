import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";

export const generateJWT = (
  userId: string,
  fullName: string,
  email: string,
  username: string,
  emailVerifiedAt: Date,
  avatar: string,
  accountCreatedAt: Date
): string => {
  return jwt.sign({ 
    userId,
    fullName,
    email,
    username,
    emailVerifiedAt,
    avatar,
    accountCreatedAt
   }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};