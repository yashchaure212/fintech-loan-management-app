import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  logoutSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/logout", validate(logoutSchema), authController.logout);
router.get("/me", protect, authController.getMe);
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  authController.changePassword,
);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken,
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

export default router;
