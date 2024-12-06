import { Request, Response } from "express";
import User from "../models/User.model";
import generateText from "../utils/text-generator";

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
        .toLowerCase()}${generateText("random", true, false, false, false)}`;
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

    // Create the user
    await User.create({
      fullName,
      username: usernameGenerated,
      email,
      password: password,
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
    });

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "User created successfully.",
    });
  } catch (error) {
    res.status(500).json({
      error: "Something went wrong. Please try again later.",
      success: false,
    });
  }
};

export { signup };