import { Request, Response } from "express";
import User from "../models/User.model";
import generateCode from "../utils/code-generator";
import { sendPasswordResetEmail, sendPasswordResetSuccessfulEmail, sendVerificationEmail } from "../nodemailer/email.nodermailer";
import { generateTokenExpireTime } from "../utils/generateTokenExpireTime";
import argon2 from "argon2";
import { generateJWT } from "../utils/jwt-helper";
import "dotenv/config";
import { escape } from "validator";
import isPasswordStrong from "../utils/isPasswordStrong";

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
      error: "Confirm password does not match with password.",
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
      message:
        "User Sign Up successfully. Please check your email for verification.",
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { email, token } = req.body;

  if (!token) {
    res
      .status(400)
      .json({ error: "Verification token is required.", success: false });
    return;
  }

  try {
    // Find user by token
    const user = await User.findOne({ email, verificationToken: token });

    if (!user) {
      res
        .status(400)
        .json({ error: "Invalid or expired code.", success: false });
      return;
    }

    // Check if the token is expired
    if (
      user.verificationTokenExpireTime &&
      user.verificationTokenExpireTime < new Date()
    ) {
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

const resendVerificationEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      res
        .status(400)
        .json({ error: "User is already verified.", success: false });
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

const signin = async (req: Request, res: Response): Promise<void> => {
  const { identifier, password } = req.body;

  // Validate input
  if (!identifier || !password) {
    res.status(400).json({
      error: "All fields are required.",
      success: false,
    });
    return;
  }

  try {
    // Sanitize inputs
    const sanitizedIdentifier = escape(identifier);
    const sanitizedPassword = escape(password);

    // Find user by email or username
    const user: any = await User.findOne({
      $or: [{ email: sanitizedIdentifier }, { username: sanitizedIdentifier }],
    }).select("+password");

    if (!user) {
      res.status(401).json({
        error: "Invalid email/username or password.",
        success: false,
      });
      return;
    }

    // Compare password
    const isPasswordValid = await argon2.verify(
      user.password,
      sanitizedPassword
    );

    if (!isPasswordValid) {
      res.status(401).json({
        error: "Invalid email/username or password.",
        success: false,
      });
      return;
    }

    // Check if email is verified
    if (!user.emailVerifiedAt) {

     // Send verification email
      const verificationToken = generateCode(6, true, false, true, false);
      await User.updateOne(
        { _id: user._id },
        { verificationToken: verificationToken, verificationTokenExpireTime: generateTokenExpireTime() }
      );
      await sendVerificationEmail(user.email, verificationToken);

      res.status(401).json({
        error:
          "Please verify your email before logging in. Verification code has been sent.",
        success: false,
      });

      return;
    }

    // Generate JWT
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
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV !== "development", // Set to true in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Update last login details
    await User.updateOne(
      { _id: user._id },
      { lastSignInAt: new Date(), lastSignInIP: req.ip }
    );

    // Send response
    res.status(200).json({
      success: true,
      message: "Sign In successful.",
    });
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      success: false,
    });
  }
};

const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  //validation
  if (!email) {
    res.status(400).json({ error: "Email is required.", success: false });
    return;
  }

  try {
    const user = await User.findOne({ email });

    //check if user exists
    if (!user) {
      res.status(404).json({ error: "User not found.", success: false });
      return;
    }

    // Generate a new token and expiration time
    const resetToken = generateCode(10 , true, false, true, false);
    const resetTokenExpireTime = generateTokenExpireTime();

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpireTime = resetTokenExpireTime as Date;
    await user.save();


    await sendPasswordResetEmail(email, resetToken);

    res.status(200).json({
      success: true,
      message: "Password reset email sent.",
    });
  } catch (error) {
    console.error("Error in requestPasswordReset:", error);
    res.status(500).json({ error: "Internal server error.", success: false });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const {email, token, newPassword , newConfirmPassword} = req.body;

  // Validation
  if (!token || !newPassword || !newConfirmPassword || !email) {
    res.status(400).json({ error: "All fields are required.", success: false });
    return;
  }

   // Password validation
   if (newConfirmPassword !== newPassword) {
    res
      .status(400)
      .json({ error: "Confirm password does not match with password.", success: false });
    return;
  }

  if (!isPasswordStrong(newPassword)) {
    res.status(400).json({ 
      error: "Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.", 
      success: false 
    });
    return;
  }
  

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordTokenExpireTime: { $gt: new Date() },
    });

    //check if user exists
    if (!user) {
      res.status(400).json({ error: "Invalid or expired token.", success: false });
      return;
    }

    const hashedPassword = await argon2.hash(newPassword, {
      type: argon2.argon2id, // Use Argon2id for enhanced security
    });

    await User.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordTokenExpireTime: undefined,
      }
    );

    // Send password reset successful email
    sendPasswordResetSuccessfulEmail(email)

    res.status(200).json({
      success: true,
      message: "Password reset successful.",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ error: "Internal server error.", success: false });
  }
};



export { signup, verifyEmail, resendVerificationEmail, signin , requestPasswordReset , resetPassword };