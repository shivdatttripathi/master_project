import express from "express";
import { healthcheck } from "../controller/healthcheck.controller.js";
const healthcheckRouter = express.Router();

healthcheckRouter.get("/", healthcheck);

export default healthcheckRouter;
