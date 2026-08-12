import AppError from "../utils/AppError.js";
import { emiRepository } from "../repositories/emi.repository.js";
import { loanApplicationRepository } from "../repositories/loanApplication.repository.js";

export const emiService = {
  async getLoanSchedule(loanApplicationId, userId) {
    const application =
      await loanApplicationRepository.findById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    return emiRepository.findByLoanApplication(loanApplicationId);
  },

  async getById(id, userId) {
    const emi = await emiRepository.findById(id);

    if (!emi) {
      throw new AppError("EMI not found", 404);
    }

    if (emi.loanApplication.userId !== userId) {
      throw new AppError("EMI not found", 404);
    }

    return emi;
  },

  async getPendingEmis(userId) {
    return emiRepository.findPendingByUser(userId);
  },
};
