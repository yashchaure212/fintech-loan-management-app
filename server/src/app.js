import express from "express";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import addressRoutes from "./routes/address.routes.js";
import employmentRoutes from "./routes/employment.routes.js";
import kycRoutes from "./routes/kyc.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/employment", employmentRoutes);
app.use("/api/v1/kyc", kycRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FinTech Loan Management API is running 🚀",
  });
});
export default app;
