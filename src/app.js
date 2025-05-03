import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
// Config CORS properly
app.use(
  cors({
    origin: "http://localhost:4000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON middleware
app.use(express.json());

// URL-encoded middleware
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// Import routes
import healthcheckRouter from "./Routes/healthchecks.routes.js";
import userRouter from "./Routes/user.routes.js";

// Use routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);

// If you want an API version prefix:
app.use("/api/v1/healthcheck", healthcheckRouter); // Optional

export default app;
