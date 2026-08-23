import { ZodError } from "zod";
import { toPrismaAppError } from "../utils/prismaErrors.js";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const prismaError = toPrismaAppError(err);

  if (prismaError) {
    return res.status(prismaError.statusCode).json({
      success: false,
      message: prismaError.message,
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: err.flatten().fieldErrors,
    });
  }

  // Operational application errors
  if (err.isOperational) {
    const statusCode =
      Number.isInteger(err.statusCode) && err.statusCode >= 400
        ? err.statusCode
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unexpected errors
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
