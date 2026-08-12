import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { adminLoanController } from "../controllers/adminLoan.controller.js";

const router = Router();

router.use(protect, authorize("ADMIN"));

// Static routes first
router.get("/dashboard", adminLoanController.dashboard);

router.get("/", adminLoanController.getApplications);

// Dynamic route last
router.get("/:id", adminLoanController.getById);

export default router;
