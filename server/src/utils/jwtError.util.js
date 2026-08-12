import jwt from "jsonwebtoken";

import AppError from "./AppError.js";

export function toAuthAppError(error, expiredMessage, invalidMessage) {
  if (error instanceof jwt.TokenExpiredError) {
    return new AppError(expiredMessage, 401);
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return new AppError(invalidMessage, 401);
  }

  return error;
}
