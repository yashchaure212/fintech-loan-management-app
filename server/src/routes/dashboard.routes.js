import { Router } from "express";

import { dashboardController } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = Router();

// Customer Dashboard
router.get(
  "/customer",
  protect,
  authorize("CUSTOMER"),
  dashboardController.customer,
);

// Admin Dashboard
router.get("/admin", protect, authorize("ADMIN"), dashboardController.admin);

export default router;
