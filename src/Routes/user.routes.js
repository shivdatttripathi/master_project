import express from "express";

const userRouter = express.Router();
import { userRegister, verifyEmail } from "../controller/user.controller.js";
import { userRegistrationValidator } from "../validators/index.js";
import { validate } from "../Middleware/validatorMiddleware.js";

userRouter.post(
  "/register",
  userRegistrationValidator(),
  validate,
  userRegister
);

userRouter.get("/verify-email/:token", verifyEmail);
console.log("User registration request received");

export default userRouter;
