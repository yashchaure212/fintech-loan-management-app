import { existingLoanRepository } from "../repositories/existingLoan.repository.js";
import AppError from "../utils/AppError.js";

function ensureDraft(application) {
  if (application.status !== "DRAFT") {
    throw new AppError(
      "Existing loans can only be modified while the application is in draft",
      400,
    );
  }
}

export const existingLoanService = {
  async list(userId, loanApplicationId) {
    const application =
      await existingLoanRepository.findLoanApplicationById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    return existingLoanRepository.findByApplication(loanApplicationId);
  },

  async create(userId, loanApplicationId, data) {
    const application =
      await existingLoanRepository.findLoanApplicationById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    ensureDraft(application);

    return existingLoanRepository.create({
      loanApplicationId,
      ...data,
    });
  },

  async update(userId, existingLoanId, data) {
    const existingLoan = await existingLoanRepository.findById(
      existingLoanId,
    );

    if (!existingLoan || existingLoan.loanApplication.userId !== userId) {
      throw new AppError("Existing loan not found", 404);
    }

    ensureDraft(existingLoan.loanApplication);

    return existingLoanRepository.update(existingLoanId, data);
  },

  async delete(userId, existingLoanId) {
    const existingLoan = await existingLoanRepository.findById(
      existingLoanId,
    );

    if (!existingLoan || existingLoan.loanApplication.userId !== userId) {
      throw new AppError("Existing loan not found", 404);
    }

    ensureDraft(existingLoan.loanApplication);

    await existingLoanRepository.delete(existingLoanId);

    return true;
  },
};
