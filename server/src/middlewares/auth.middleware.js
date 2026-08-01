import { verifyAccessToken } from "../services/jwt.service.js";
import { authRepository } from "../repositories/auth.repository.js";
import AppError from "../utils/AppError.js";

export const protect = async (req, res, next) => {
  try {
    // Get Authorization Header

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authentication required", 401);
    }

    // Expected format:
    // Bearer token

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Access token missing", 401);
    }

    // Verify JWT

    const decoded = verifyAccessToken(token);

    // Find user

    const user = await authRepository.findUserById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Attach user to request

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
