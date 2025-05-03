import { validationResult } from "express-validator";
import { ApiError } from "../utils/api.error.js";
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extrctedErrors = [];
    errors.array().map((err) => {
      extrctedErrors.push({
        message: err.msg,
        field: err.param,
      });
    });

    throw new ApiError(
      422,
      "Validation Error",
      "Validation Error",
      extrctedErrors
    );
  }
  next();
};
