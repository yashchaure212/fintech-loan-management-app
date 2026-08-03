import AppError from "../utils/AppError.js";
import { loanWorkflowRepository } from "../repositories/loanWorkflow.repository.js";

const allowedTransitions = {
  DRAFT: ["SUBMITTED"],

  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],

  UNDER_REVIEW: ["APPROVED", "REJECTED"],

  APPROVED: ["DISBURSED"],

  DISBURSED: ["CLOSED"],

  REJECTED: [],

  CLOSED: [],
};

export const loanWorkflowService = {
  async updateStatus(loanApplicationId, status, remarks, changedById) {
    const loan = await loanWorkflowRepository.findById(loanApplicationId);

    if (!loan) {
      throw new AppError("Loan application not found", 404);
    }

    const allowed = allowedTransitions[loan.status] || [];

    if (!allowed.includes(status)) {
      throw new AppError(
        `Cannot move loan from ${loan.status} to ${status}`,
        400,
      );
    }

    return loanWorkflowRepository.transaction(async (tx) => {
      const updatedLoan = await loanWorkflowRepository.updateStatus(
        tx,
        loanApplicationId,
        status,
      );

      await loanWorkflowRepository.createStatusHistory(tx, {
        loanApplicationId,
        status,
        remarks,
        changedById,
      });

      return updatedLoan;
    });
  },
};
