import express from "express";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FinTech Loan Management API is running 🚀",
  });
});
export default app;
