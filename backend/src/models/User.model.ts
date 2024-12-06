import mongoose, { Schema, Document, Model } from "mongoose";
import validator from "validator"; // To add email and other validations
import argon2 from "argon2";

// Define the interface for the User document
export interface IUser extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  verificationToken?: string;
  verificationTokenExpireTime?: Date;
  emailVerifiedAt: Date;
  lastSignInAt?: Date;
  lastSignInIP? : string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the User schema
const UserSchema: Schema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      validate: {
        validator: (value: string) => {
          const nameParts = value.trim().split(/\s+/); // Split by whitespace
          if (nameParts.length < 2) return false; // Must contain at least two parts
          const isValidPart = (part: string) =>
            /^[a-zA-Z]+$/.test(part) && part.length >= 2; // Only letters, min length 2
          return nameParts.every(isValidPart); // Ensure all parts are valid
        },
        message:
          "Full name must include at least a first name and a surname, each at least 2 characters long and containing only letters",
      },
    },

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [20, "Username cannot exceed 20 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please Enter a valid Email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Exclude password field when querying by default
      validate: {
        validator: (value: string) => {
          // Password must include at least one uppercase letter, one number, and one special character
          const strongPasswordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
          return strongPasswordRegex.test(value);
        },
        message:
          "Password must include at least one uppercase letter, one number, and one special character",
      },
    },
    avatar: {
      type: String,
      required: [true, "Please provide an avatar"],
      validate: {
        validator: (value: string) =>
          validator.isURL(value, {
            protocols: ["http", "https"],
            require_protocol: true,
          }),
        message: "Please provide a valid URL for the avatar",
      },
    },
    verificationToken: { type: String },
    verificationTokenExpireTime: { type: Date },
    emailVerifiedAt: { type: Date, default: null },
    lastSignInAt: { type: Date },
    lastSignInIP: { type: String},
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to handle additional logic (optional)
UserSchema.pre<IUser>("save", async function (next) {
  //Password hashing
  if (!this.isModified("password")) return next(); // Only hash if the password is modified
  try {
    const hashedPassword = await argon2.hash(this.password, {
      type: argon2.argon2id, // Use Argon2id for enhanced security
    });
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.log(error);
  }
});

// Create and export the model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
