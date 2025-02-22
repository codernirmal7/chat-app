import { Request, Response, NextFunction } from "express";

// Middleware to block browser access and require authentication
export const secureEndpointAccess = (req: Request, res: Response, next: NextFunction) => {
  const acceptHeader = req.headers["accept"] || "";

  // Block browser access based on the Accept header
  if (acceptHeader.includes("text/html")) {
    res.status(403).json({
      success: false,
      error: "Access to this endpoint is forbidden.",
    });
    return;
  }
  next(); // Proceed if all checks pass
};