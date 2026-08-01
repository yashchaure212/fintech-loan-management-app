import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/upload.middleware.js";

import { kycController } from "../controllers/kyc.controller.js";

const router = Router();

router.post(
  "/upload",
  protect,
  upload.single("document"),
  kycController.upload,
);

router.get("/", protect, kycController.getAll);

export default router;
