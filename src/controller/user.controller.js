import { asyncHandler } from "../utils/async_Handler.js";
import { User } from "../Model/user.models.js";
import { userRegistrationValidator } from "../validators/index.js";
import { registerUserSendEmail } from "../utils/emailCall.js";
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

const login = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  userLoginValidator(req.body);

  const passCompare = isPasswordCorrect(password);

  if (!passCompare) {
    throw new ApiError(400, "Invalid password", passCompare);
  }

  const user = await User.findOne({ email, username });

  if (!user) {
    throw new ApiError(400, "User not found", user);
  }

  if (!user.isEmailVerified) {
    throw new ApiError(400, "Please first verify email", user.isEmailVerified);
  }

  const token = user.generateAuthToken();
  const response = new ApiResponse(200, { token }, "Login successful");
  return res.status(response.statusCode).json(response);
});

export { userRegister, verifyEmail, login };
