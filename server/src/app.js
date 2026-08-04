import express from "express";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import addressRoutes from "./routes/address.routes.js";
import employmentRoutes from "./routes/employment.routes.js";
import kycRoutes from "./routes/kyc.routes.js";
import loanTypeRoutes from "./routes/loanType.routes.js";
import loanRoutes from "./routes/loan.routes.js";
import loanStatusHistoryRoutes from "./routes/loanStatusHistory.routes.js";
import loanWorkflowRoutes from "./routes/loanWorkflow.routes.js";
import loanInterestConfigurationRoutes from "./routes/loanInterestConfiguration.routes.js";
import loanEligibilityRoutes from "./routes/loanEligibility.routes.js";
import loanRequiredDocumentRoutes from "./routes/loanRequiredDocument.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/employment", employmentRoutes);
app.use("/api/v1/kyc", kycRoutes);
app.use("/api/v1/loan-types", loanTypeRoutes);
app.use("/api/v1/loans", loanRoutes);
app.use("/api/v1/loan-status-history", loanStatusHistoryRoutes);
app.use("/api/v1/loan-workflow", loanWorkflowRoutes);
app.use("/api/loan-interest-configurations", loanInterestConfigurationRoutes);
app.use("/api/loan-eligibilities", loanEligibilityRoutes);
app.use("/api/loan-required-documents", loanRequiredDocumentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FinTech Loan Management API is running 🚀",
  });
});
export default app;
