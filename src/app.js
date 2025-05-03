import express from "express";
const app = express();
import cors from "cors";

// Config CORS properly
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON middleware
app.use(express.json());

// URL-encoded middleware
app.use(express.urlencoded({ extended: true }));

// Import routes
import healthcheckRouter from "./Routes/healthchecks.routes.js";
import userRouter from "./Routes/user.routes.js";

// Use routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);

// If you want an API version prefix:
app.use("/api/v1/healthcheck", healthcheckRouter); // Optional

export default app;
