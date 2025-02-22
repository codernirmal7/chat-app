import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { isTokenBlacklisted } from "../utils/handelBlackListJWT";
import { UserData } from "../utils/express";

const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
 
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized." });
    return;
  }

  // Check if token is blacklisted
  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    res
      .status(401)
      .json({ success: false, message: "Token has been revoked." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.userData = decoded as UserData; // Attach user info to the request object
    next();
  

  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default verifyToken;
