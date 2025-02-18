import { Response } from "express";
import { generateJWT } from "./jwt-helper";

// Utility to regenerate JWT and set it in a cookie
const regenerateJWTAndSetCookie = (res: Response, user: any): string => {
  const token = generateJWT(
    user._id,
    user.fullName,
    user.email,
    user.username,
    user.emailVerifiedAt,
    user.avatar,
    user.createdAt
  );

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return token;
};


export default regenerateJWTAndSetCookie