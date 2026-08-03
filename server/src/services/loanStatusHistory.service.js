import AppError from "../utils/AppError.js";
import { loanStatusHistoryRepository } from "../repositories/loanStatusHistory.repository.js";

export const loanStatusHistoryService = {
  async create(data) {
    const loanApplication =
      await loanStatusHistoryRepository.loanApplicationExists(
        data.loanApplicationId,
      );

    if (!loanApplication) {
      throw new AppError("Loan application not found", 404);
    }

    return loanStatusHistoryRepository.create(data);
  },

  async getTimeline(loanApplicationId) {
    return loanStatusHistoryRepository.findByLoanApplicationId(
      loanApplicationId,
    );
  },
};
