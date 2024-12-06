import { Request, Response } from "express";
import User from "../models/User.model";
import generateCode from "../utils/code-generator";
import { sendVerificationEmail } from "../nodemailer/email.nodermailer";
import { generateTokenExpireTime } from "../utils/generateTokenExpireTime";

const signup = async (req: Request, res: Response): Promise<void> => {
  const { fullName, email, password, confirmPassword } = req.body;

  // Validate input
  if (!fullName) {
    res.status(400).json({
      error: "Enter your full name.",
      success: false,
      statusCode: 400,
    });
    return;
  }
  if (confirmPassword !== password) {
    res.status(400).json({
      error: "Passwords do not match.",
      success: false,
      statusCode: 400,
    });
    return;
  }

  try {
    // Check if the user already exists
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
      res.status(400).json({ error: "User already exists.", success: false });
      return;
    }

    // Generate unique username
    let usernameGenerated = fullName.split(" ").join("_").toLowerCase();
    let isUsernameTaken = await User.findOne({ username: usernameGenerated });
    let attempts = 0;

    while (isUsernameTaken && attempts < 5) {
      usernameGenerated = `${fullName
        .split(" ")
        .join("_")
        .toLowerCase()}${generateCode("random", true, false, false, false)}`;
      isUsernameTaken = await User.findOne({ username: usernameGenerated });
      attempts++;
    }

    if (isUsernameTaken) {
      res.status(500).json({
        error: "Could not generate a unique username. Please try again.",
        success: false,
      });
      return;
    }

    // Generate token and expiration time
    const verificationToken = generateCode(6, true, false, true, false);
    const verificationTokenExpireTime = generateTokenExpireTime();

    // Create the user
    await User.create({
      fullName,
      username: usernameGenerated,
      email,
      password: password,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
      verificationToken,
      verificationTokenExpireTime,
    });

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email for verification.",
    });
  } catch (error : any) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const {email , token } = req.body;

  if (!token) {
    res.status(400).json({ error: "Verification token is required.", success: false });
    return;
  }

  try {

    // Find user by token
    const user = await User.findOne({email, verificationToken: token });

    if (!user) {
      res.status(400).json({ error: "Invalid or expired code.", success: false });
      return;
    }

    // Check if the token is expired
    if (user.verificationTokenExpireTime && user.verificationTokenExpireTime < new Date()) {
      res.status(400).json({
        error: "Verification token has expired. Please request a new one.",
        success: false,
      });
      return;
    }

    // Mark user as verified
    user.emailVerifiedAt = new Date();
    user.verificationToken = undefined;
    user.verificationTokenExpireTime = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", success: false });
  }
};


const resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      res.status(404).json({ error: "User not found.", success: false });
      return;
    }

    //check if user is already verified
    if (user.emailVerifiedAt) {
      res.status(400).json({ error: "User is already verified.", success: false });
      return;
    }

    // Generate a new token and expiration time
    const verificationToken = generateCode(6, true, false, true, false);
    const verificationTokenExpireTime = generateTokenExpireTime();

    user.verificationToken = verificationToken;
    user.verificationTokenExpireTime = verificationTokenExpireTime as Date;
    await user.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully.",
    });
  } catch (error) {
    console.error("Error during resend email:", error);
    res.status(500).json({ error: "Internal server error", success: false });
  }
};


export { signup , verifyEmail , resendVerificationEmail };