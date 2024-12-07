import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { isTokenBlacklisted } from "../utils/handelBlackListJWT";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized." });
  }

  // Check if token is blacklisted
  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    return res
      .status(401)
      .json({ success: false, message: "Token has been revoked." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userData = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default verifyToken;
