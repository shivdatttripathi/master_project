import mongoose from "mongoose";
import bcrypt from "bcrypt"; // For hashing passwords
import jwt from "jsonwebtoken"; // For generating JWT tokens
import crypto from "crypto"; // For generating secure random tokens

// Define the schema for the User collection in MongoDB
const userSchema = new mongoose.Schema(
  {
    // Avatar object to store profile image URL and its local path
    avatar: {
      url: {
        type: String,
        trim: true,
        default: "https://placehold.co/600x400",
      },
      localPath: {
        type: String,
        trim: true,
        default: "",
      },
    },

    // Unique username for the user
    username: {
      type: String,
      required: true, // Must be provided
      trim: true,
      unique: true, // No duplicate usernames allowed
    },

    // User's email address
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Email must be unique
    },

    // Password for the user account (should be hashed before saving)
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6, // Minimum length requirement
    },

    // Full name of the user
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional phone number of the user
    phone: {
      type: String,
      trim: true,
    },

    // Optional address field
    address: {
      type: String,
      trim: true,
    },

    // Role of the user: can either be 'admin' or 'user'
    role: {
      type: String,
      enum: ["admin", "user"], // Only these values allowed
      default: "user", // Default role is 'user'
    },

    // Whether the user's email is verified
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Token sent to user email for verification
    emailVerificationToken: {
      type: String,
      trim: true,
    },

    // Token expiry time for email verification
    emailVerificationExpiry: {
      type: Date,
    },

    // Token sent to email for resetting password
    forgotPasswordToken: {
      type: String,
      trim: true,
    },

    // Expiry for the forgot password token
    forgotPasswordExpiry: {
      type: Date,
    },

    // Refresh token for maintaining login session
    refreshToken: {
      type: String,
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// Method to generate temporary token (e.g., for email verification or password reset)
userSchema.methods.generateTemporaryToken = function () {
  const unHashedToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");
  const tokenExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes
  this.emailVerificationToken = hashedToken;
  this.emailVerificationExpiry = tokenExpiry;

  return { hashedToken, unHashedToken, tokenExpiry };
};

// Export the User model for use in other parts of the app
export const User = mongoose.model("User", userSchema);
