import { loanEligibilityRepository } from "../repositories/loanEligibility.repository.js";
import AppError from "../utils/AppError.js";

export const loanEligibilityService = {
  async create(data) {
    // Check Loan Type
    const loanType = await loanEligibilityRepository.findLoanType(
      data.loanTypeId,
    );

    if (!loanType) {
      throw new AppError("Loan type not found", 404);
    }

    // Only one eligibility per loan type
    const existing = await loanEligibilityRepository.findByLoanTypeId(
      data.loanTypeId,
    );

    if (existing) {
      throw new AppError("Eligibility already exists for this loan type", 409);
    }

    return loanEligibilityRepository.create(data);
  },

  async getAll() {
    return loanEligibilityRepository.findAll();
  },

  async getById(id) {
    const eligibility = await loanEligibilityRepository.findById(id);

    if (!eligibility) {
      throw new AppError("Eligibility not found", 404);
    }

    return eligibility;
  },

  async update(id, data) {
    const eligibility = await loanEligibilityRepository.findById(id);

    if (!eligibility) {
      throw new AppError("Eligibility not found", 404);
    }

    // If loan type is changed
    if (data.loanTypeId && data.loanTypeId !== eligibility.loanTypeId) {
      const loanType = await loanEligibilityRepository.findLoanType(
        data.loanTypeId,
      );

      if (!loanType) {
        throw new AppError("Loan type not found", 404);
      }

      const existing = await loanEligibilityRepository.findByLoanTypeId(
        data.loanTypeId,
      );

      if (existing) {
        throw new AppError(
          "Eligibility already exists for this loan type",
          409,
        );
      }
    }

    return loanEligibilityRepository.update(id, data);
  },

  async delete(id) {
    const eligibility = await loanEligibilityRepository.findById(id);

    if (!eligibility) {
      throw new AppError("Eligibility not found", 404);
    }

    return loanEligibilityRepository.delete(id);
  },
};
