import { Router } from "express";

import { protect } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

import { employmentSchema } from "../validations/employment.validation.js";

import { employmentController } from "../controllers/employment.controller.js";

const router = Router();

router.post(
  "/",
  protect,
  validate(employmentSchema),
  employmentController.create,
);

router.get("/", protect, employmentController.get);

router.put(
  "/",
  protect,
  validate(employmentSchema),
  employmentController.update,
);

export default router;
