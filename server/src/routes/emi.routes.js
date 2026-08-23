import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { emiController } from "../controllers/emi.controller.js";

const router = Router();

router.use(protect, authorize("CUSTOMER"));

router.get("/pending", emiController.getPending);

router.get("/loan/:loanId", emiController.getLoanSchedule);

router.get("/:id", emiController.getById);

export default router;
