import express from "express";

const userRouter = express.Router();
import {
  logout,
  userRegister,
  verifyEmail,
  login,
} from "../controller/user.controller.js";
import {
  userRegistrationValidator,
  userLoginValidator,
} from "../validators/index.js";
import { validate } from "../Middleware/validatorMiddleware.js";
import { checkUserLogin } from "../Middleware/checkLogin.js";

userRouter.post(
  "/register",
  userRegistrationValidator(),
  validate,
  userRegister
);

userRouter.get("/verify-email/:token", verifyEmail);

userRouter.post("/login", userLoginValidator(), validate, login);
userRouter.get("/logout", checkUserLogin, logout);

export default userRouter;
