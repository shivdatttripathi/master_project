import mongoose from "mongoose";

// Define the schema for the User collection in MongoDB
const userSchema = new mongoose.Schema(
  {
    // Avatar object to store profile image URL and its local path
    avatar: {
      type: {
        url: String, // URL of the user's avatar image
        localPath: String, // Local path (if stored on server)
        required: false, // Optional field
        trim: true, // Trims whitespace
      },
      // Default avatar image if user doesn't upload one
      default: {
        url: "https://placehold.co/600x400",
        localPath: "",
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
      required: false,
      trim: true,
    },

    // Optional address field
    address: {
      type: String,
      required: false,
      trim: true,
    },

    // Role of the user: can either be 'admin' or 'user'
    role: {
      type: String,
      enum: ["admin", "user"], // Only these values allowed
      default: "user", // Default role is 'user'
    },

    // Whether the user's email is verified
    isVerified: {
      type: Boolean,
      default: false,
    },

    // Token sent to user email for verification
    emailVerificationToken: {
      type: String,
      required: false,
      trim: true,
    },

    // // Token expiry time (e.g., 1 hour from generation)
    // emailVerificationTokenExpiry: {
    //   type: Date,
    //   required: false,
    // },

    // Token sent to email for resetting password
    forgotPasswordToken: {
      type: String,
      required: false,
      trim: true,
    },

    // Expiry for the forgot password token
    forgotPasswordTokenExpiry: {
      type: Date,
      required: false,
    },

    // Refresh token for maintaining login session
    refreshToken: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
  }
);

mongoose.pre("save", async function () {
  // Hash the password before saving the user document
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // Hashing with bcrypt
  }
  next(); // Proceed to save the document
});
userSchema.methods.comparePassword = async function (password) {
  // Compare the provided password with the hashed password in the database
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET, // Use the same secret for refresh token
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );
};
//email token crypto
userSchema.methods.generateEmailVerificationToken = function () {
  const unHashed = crypto.randomBytes(20).toString("hex"); // Generate a random token for email verification
  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashed)
    .digest("hex"); // Hash the token for storage
  const expires = Date.now() + 30 * 60 * 1000; // Set expiration time (e.g., 30 minutes from now)
  return { hashedToken, unHashed, expires }; // Return both hashed and unhashed tokens along with expiration time
};


userSchema.methods.generateForgotPasswordToken = function () {
// Export the User model for use in other parts of the app
export const User = mongoose.model("User", userSchema);
