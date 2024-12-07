import { Request, Response } from "express";
import User from "../models/User.model";
import { uploadToCloudinary } from "../cloudinary/cloudinary.config";
import { deleteLocalFile } from "../utils/deleteLocalFile";
import jwt from "jsonwebtoken";
import { blacklistToken } from "../utils/handelBlackListJWT";
import regenerateJWTAndSetCookie from "../utils/regenerateJWTAndSetCookie";

const userData = async (req: Request, res: Response): Promise<void> => {
  try {
    // `req.userData` contains the user object attached by the verifyToken middleware
    const user = req.userData;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message, success: false });
  }
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { fullName, username } = req.body;
  const oldToken = req.cookies.accessToken; // Retrieve the accessToken from cookies

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

    // Check for username conflicts (case-insensitive)
    if (existingUser.username.toLowerCase() !== username.toLowerCase()) {
      const usernameExists = await User.findOne({
        username: { $regex: `^${username}$`, $options: "i" },
      });
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

    // Blacklist old token
    const decoded = jwt.decode(oldToken) as { exp: number };
    if (decoded) {
      const timeToExpire = decoded.exp - Math.floor(Date.now() / 1000);
      await blacklistToken(oldToken, timeToExpire);
    }

    // Generate new JWT and set in cookie
    regenerateJWTAndSetCookie(res, existingUser);

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
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: error.message, success: false });
  }
};

const updateProfileImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const oldToken = req.cookies.accessToken; // Retrieve the accessToken from cookies

  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No file uploaded." });
      return;
    }

    // Validate file type
    if (!req.file.mimetype.startsWith("image/")) {
      deleteLocalFile(req.file.path);
      res
        .status(400)
        .json({ success: false, error: "Only image files are allowed." });
      return;
    }

    // Upload to Cloudinary
    const uploadedImageUrl = await uploadToCloudinary(req.file.path);

    // Update user's profile with the image URL
    const updatedUser = await User.findByIdAndUpdate(
      req.userData.userId, // Assuming authentication middleware sets `req.userData`
      { avatar: uploadedImageUrl },
      { new: true }
    );

    if (!updatedUser) {
      deleteLocalFile(req.file.path); // Clean up local file
      res.status(404).json({ success: false, error: "User not found." });
      return;
    }

    // Delete local file after successful upload
    deleteLocalFile(req.file.path);

    // Blacklist old token
    const decoded = jwt.decode(oldToken) as { exp: number };
    if (decoded) {
      const timeToExpire = decoded.exp - Math.floor(Date.now() / 1000);
      await blacklistToken(oldToken, timeToExpire);
    }

    // Generate new JWT and set in cookie
    regenerateJWTAndSetCookie(res, updatedUser);

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully!",
      data: { avatar: updatedUser.avatar },
    });
  } catch (error: any) {
    // Delete local file in case of failure
    if (req.file) deleteLocalFile(req.file.path);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { userData, updateProfile, updateProfileImage };
