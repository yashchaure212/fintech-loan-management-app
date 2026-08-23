import { verifyAccessToken } from "../services/jwt.service.js";
import { authRepository } from "../repositories/auth.repository.js";
import AppError from "../utils/AppError.js";
import { toAuthAppError } from "../utils/jwtError.util.js";

export const protect = async (req, res, next) => {
  try {
    // Get Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authentication required", 401);
    }

    // Expected format:
    // Bearer token
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authorization header", 401);
    }

    // Verify JWT
    let decoded;

    try {
      decoded = verifyAccessToken(token);
    } catch (error) {
      throw toAuthAppError(
        error,
        "Access token expired",
        "Invalid access token",
      );
    }

    // Find user
    const user = await authRepository.findUserById(decoded.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Block inactive/deleted users
    if (!user.isActive || user.isDeleted) {
      throw new AppError("Account is inactive", 403);
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
