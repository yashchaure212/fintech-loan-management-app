import express from "express";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import addressRoutes from "./routes/address.routes.js";
import loanTypeRoutes from "./routes/loanType.routes.js";
import loanApplicationRoutes from "./routes/loanApplication.routes.js";
import loanStatusHistoryRoutes from "./routes/loanStatusHistory.routes.js";
import loanWorkflowRoutes from "./routes/loanWorkflow.routes.js";
import loanInterestConfigurationRoutes from "./routes/loanInterestConfiguration.routes.js";
import loanEligibilityRoutes from "./routes/loanEligibility.routes.js";
import loanRequiredDocumentRoutes from "./routes/loanRequiredDocument.routes.js";
import loanDocumentRoutes from "./routes/loanDocument.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import adminLoanRoutes from "./routes/adminLoan.routes.js";
import educationLoanRoutes from "./routes/educationLoan.routes.js";
import emiRoutes from "./routes/emi.routes.js";
import emiPaymentRoutes from "./routes/emiPayment.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";
import cors from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://fintech-loan-management-app-nine.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware
app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/address", addressRoutes);
app.use("/api/v1/loan-types", loanTypeRoutes);
app.use("/api/v1/loan-applications", loanApplicationRoutes);
app.use("/api/v1/loan-status-history", loanStatusHistoryRoutes);
app.use("/api/v1/loan-workflow", loanWorkflowRoutes);
app.use(
  "/api/v1/loan-interest-configurations",
  loanInterestConfigurationRoutes,
);
app.use("/api/v1/loan-eligibilities", loanEligibilityRoutes);
app.use("/api/v1/loan-required-documents", loanRequiredDocumentRoutes);
app.use("/api/v1/loan-documents", loanDocumentRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin/loans", adminLoanRoutes);
app.use("/api/v1/education-loans", educationLoanRoutes);
app.use("/api/v1/emi", emiRoutes);
app.use("/api/v1/emi-payments", emiPaymentRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "FinTech Loan Management API is running 🚀",
  });
});
export default app;
