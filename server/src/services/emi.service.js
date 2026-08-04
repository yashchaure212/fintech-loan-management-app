import AppError from "../utils/AppError.js";
import { emiRepository } from "../repositories/emi.repository.js";

export const emiService = {
  async getLoanSchedule(loanApplicationId) {
    return emiRepository.findByLoanApplication(loanApplicationId);
  },

  async getById(id) {
    const emi = await emiRepository.findById(id);

    if (!emi) {
      throw new AppError("EMI not found", 404);
    }

    return emi;
  },

  async getPendingEmis(userId) {
    return emiRepository.findPendingByUser(userId);
  },
};
