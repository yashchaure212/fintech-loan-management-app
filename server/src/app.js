import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import prisma from "./config/prisma.js";

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
import studentLoanRoutes from "./routes/studentLoan.routes.js";
import schoolLoanRoutes from "./routes/schoolLoan.routes.js";
import institutionRoutes from "./routes/institution.routes.js";
import existingLoanRoutes from "./routes/existingLoan.routes.js";
import businessRegistrationRoutes from "./routes/businessRegistration.routes.js";
import emiRoutes from "./routes/emi.routes.js";
import emiPaymentRoutes from "./routes/emiPayment.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();
const API_PREFIX = "/api/v1";

const allowedOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(cookieParser());
app.use(
  morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
    skip: (req) => req.path === "/health" || req.path === "/ready",
  }),
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use(globalLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
  });
});

app.get("/ready", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      status: "ready",
    });
  } catch {
    return res.status(503).json({
      success: false,
      status: "not_ready",
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FinTech Loan Management API is running",
  });
});

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/profile`, profileRoutes);
app.use(`${API_PREFIX}/address`, addressRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/loan-types`, loanTypeRoutes);
app.use(
  `${API_PREFIX}/loan-interest-configurations`,
  loanInterestConfigurationRoutes,
);
app.use(`${API_PREFIX}/loan-eligibilities`, loanEligibilityRoutes);
app.use(`${API_PREFIX}/loan-required-documents`, loanRequiredDocumentRoutes);
app.use(`${API_PREFIX}/loan-applications`, loanApplicationRoutes);
app.use(`${API_PREFIX}/loan-status-history`, loanStatusHistoryRoutes);
app.use(`${API_PREFIX}/loan-workflow`, loanWorkflowRoutes);
app.use(`${API_PREFIX}/loan-documents`, loanDocumentRoutes);
app.use(`${API_PREFIX}/student-loans`, studentLoanRoutes);
app.use(`${API_PREFIX}/school-loans`, schoolLoanRoutes);
app.use(`${API_PREFIX}/school-loans`, businessRegistrationRoutes);
app.use(`${API_PREFIX}/institutions`, institutionRoutes);
app.use(`${API_PREFIX}/loan-applications`, existingLoanRoutes);
app.use(`${API_PREFIX}/emi`, emiRoutes);
app.use(`${API_PREFIX}/emi-payments`, emiPaymentRoutes);
app.use(`${API_PREFIX}/admin/loans`, adminLoanRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

export default app;
