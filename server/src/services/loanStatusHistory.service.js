import AppError from "../utils/AppError.js";
import { loanStatusHistoryRepository } from "../repositories/loanStatusHistory.repository.js";

const ALLOWED_TRANSITIONS = {
  DRAFT: ["SUBMITTED"],
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["DISBURSED"],
  REJECTED: [],
  DISBURSED: ["CLOSED"],
  CLOSED: [],
};

export const loanStatusHistoryService = {
  async create(data, user) {
    const loanApplication =
      await loanStatusHistoryRepository.findLoanApplicationForAccess(
        data.loanApplicationId,
      );

    if (!loanApplication) {
      throw new AppError("Loan application not found", 404);
    }

    if (user.role.name !== "ADMIN") {
      throw new AppError("You are not authorized to change loan status", 403);
    }

    const currentStatus = loanApplication.status;
    const nextStatus = data.status;

    const allowedNextStatuses = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${nextStatus}`,
        400,
      );
    }

    return loanStatusHistoryRepository.create(data);
  },

  async getTimeline(loanApplicationId, user) {
    const loanApplication =
      await loanStatusHistoryRepository.findLoanApplicationForAccess(
        loanApplicationId,
      );

    if (!loanApplication) {
      throw new AppError("Loan application not found", 404);
    }

    const isAdmin = user.role.name === "ADMIN";

    const isOwner = loanApplication.userId === user.id;

    if (!isAdmin && !isOwner) {
      throw new AppError("You are not authorized to view this loan", 403);
    }

    return loanStatusHistoryRepository.findByLoanApplicationId(
      loanApplicationId,
    );
  },
};
