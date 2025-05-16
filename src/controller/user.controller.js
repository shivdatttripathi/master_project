import { asyncHandler } from "../utils/async_Handler.js";
import { User } from "../Model/user.models.js";
import {
  userLoginValidator,
  userRegistrationValidator,
} from "../validators/index.js";
import {
  forgotPasswordSendEmail,
  registerUserSendEmail,
} from "../utils/emailCall.js";
import { ApiResponse } from "../utils/api.response.js";
import { ApiError } from "../utils/api.error.js";
import crypto from "crypto";

const userRegister = asyncHandler(async (req, res) => {
  console.log("User registration request received");
  const { fullname, username, email, password, address, phone } = req.body;

  userRegistrationValidator(req.body);

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  ``;

  const user = new User({
    fullname,
    username,
    email,
    password,
    address,
    phone,
  });

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save();
  await registerUserSendEmail(unHashedToken, user.fullname, user.email);

  const response = new ApiResponse(
    201,
    {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      address: user.address,
      phone: user.phone,
    },
    "User  successfully"
  );

  return res.status(response.statusCode).json(response);
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired token");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  await user.save();

  const response = new ApiResponse(200, null, "Email verified successfully");
  return res.status(response.statusCode).json(response);
});

// const login = asyncHandler(async (req, res) => {
//   const { email, password, username } = req.body;
//   userLoginValidator(req.body);

//   const passCompare = isPasswordCorrect(password);

//   if (!passCompare) {
//     throw new ApiError(400, "Invalid password", passCompare);
//   }

//   const user = await User.findOne({ email, username });

//   if (!user) {
//     throw new ApiError(400, "User not found", user);
//   }

//   if (!user.isEmailVerified) {
//     throw new ApiError(400, "Please first verify email", user.isEmailVerified);
//   }

//   const token = user.generateAuthToken();
//   const response = new ApiResponse(200, { token }, "Login successful");
//   return res.status(response.statusCode).json(response);
// });

// Login function to authenticate users

const login = asyncHandler(async (req, res) => {
  console.log("User login request received");
  const { email, password } = req.body;

  // Validate request body

  userLoginValidator(req.body);

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User not found");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in");
  }

  const isMatch = await user.isPasswordCorrect(password);
  if (!isMatch) {
    throw new ApiError(401, "Incorrect password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set tokens in cookies
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 1000 * 60 * 15, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  const response = new ApiResponse(
    200,
    {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
        avatar: user.avatar,
      },
    },
    "Login successful"
  );

  return res.status(200).json(response);
});

const logout = asyncHandler(async (req, res) => {
  //check expire and find

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  //clear  cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "Strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "Strict",
  });

  const response = new ApiResponse(200, null, "Logout successful");
  return res.status(response.statusCode).json(response);
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.find({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.passwordResetToken = hashedToken;
  user.passwordResetExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });
  //send email
  await forgotPasswordSendEmail(unHashedToken, user.fullname, user.email);

  const response = new ApiResponse(200, null, "Password reset email sent");
  return res.status(response.statusCode).json(response);
});
const resetPassword = asyncHandler(async (req, res) => {});

export { userRegister, verifyEmail, login, logout };
