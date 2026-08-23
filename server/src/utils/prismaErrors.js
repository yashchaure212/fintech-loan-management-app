import AppError from "./AppError.js";

export function toPrismaAppError(error) {
  if (error?.code === "P2002") {
    return new AppError("A record with those unique details already exists", 409);
  }

  if (error?.code === "P2025") {
    return new AppError("Record not found", 404);
  }

  if (error?.code === "P2003") {
    return new AppError("Related record was not found", 400);
  }

  if (error?.code === "P1001" || error?.code === "P1017") {
    return new AppError("Database is unavailable", 503);
  }

  return null;
}
