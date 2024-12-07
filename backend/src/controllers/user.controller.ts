import { Request, Response } from "express";
import User from "../models/User.model";
import { generateJWT } from "../utils/jwt-helper";

const userData = async (req: Request, res: Response): Promise<void> => {
  try {
    // `req.userData` contains the user object attached by the verifyToken middleware
    const user = req.userData;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error : any) {
    res.status(500).json({ error: error.message, success: false });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const { fullName, username } = req.body;
  
    // Validation
    if (!fullName || !username) {
      res.status(400).json({ error: "All fields are required.", success: false });
      return;
    }
  
    try {
      const existingUser = await User.findById(req.userData.userId);
      if (!existingUser) {
        res.status(404).json({ error: "User not found.", success: false });
        return;
      }
  
      if (existingUser.username !== username) {
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
          res
            .status(400)
            .json({ error: "Username already exists.", success: false });
          return;
        }
      }
  
      // Update user
      existingUser.fullName = fullName;
      existingUser.username = username;
      await existingUser.save();
  
      // Generate new JWT
      const token = generateJWT(
        existingUser._id as string,
        existingUser.fullName,
        existingUser.email,
        existingUser.username,
        existingUser.emailVerifiedAt,
        existingUser.avatar,
        existingUser.createdAt
      );
  
      // Set JWT in cookie
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
  
      // Send response
      res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        user: {
          fullName: existingUser.fullName,
          username: existingUser.username,
          email: existingUser.email,
          avatar: existingUser.avatar,
        },
      });
    } catch (error : any) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: error.message, success: false });
    }
  };
  

export { userData , updateProfile };