import { Router } from "express";
import { profileController } from "../controllers/profile.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createProfileSchema } from "../validations/profile.validation.js";

const router = Router();

router.post(
  "/",
  protect,
  validate(createProfileSchema),
  profileController.create,
);

router.get("/", protect, profileController.get);

router.put(
  "/",
  protect,
  validate(createProfileSchema),
  profileController.update,
);

export default router;
