import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { emiController } from "../controllers/emi.controller.js";

const router = Router();

router.get("/pending", protect, emiController.getPending);

router.get("/loan/:loanId", protect, emiController.getLoanSchedule);

router.get("/:id", protect, emiController.getById);

export default router;
