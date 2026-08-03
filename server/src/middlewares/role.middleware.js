import AppError from "../utils/AppError.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    const userRole = req.user.role?.name;

    if (!userRole || !roles.includes(userRole)) {
      return next(
        new AppError("You are not authorized to perform this action", 403),
      );
    }

    next();
  };
};
