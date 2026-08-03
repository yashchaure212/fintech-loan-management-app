import { loanInterestConfigurationRepository } from "../repositories/loanInterestConfiguration.repository.js";
import AppError from "../utils/AppError.js";

export const loanInterestConfigurationService = {
  async create(data) {
    // Validate Loan Type
    const loanType = await loanInterestConfigurationRepository.findLoanType(
      data.loanTypeId,
    );

    if (!loanType) {
      throw new AppError("Loan type not found", 404);
    }

    // Prevent overlapping configurations
    const existing =
      await loanInterestConfigurationRepository.findOverlappingConfiguration(
        data,
      );

    if (existing) {
      throw new AppError(
        "An overlapping interest configuration already exists",
        409,
      );
    }

    return loanInterestConfigurationRepository.create(data);
  },

  async getAll() {
    return loanInterestConfigurationRepository.findAll();
  },

  async getById(id) {
    const configuration =
      await loanInterestConfigurationRepository.findById(id);

    if (!configuration || configuration.isDeleted) {
      throw new AppError("Interest configuration not found", 404);
    }

    return configuration;
  },

  async update(id, data) {
    const configuration =
      await loanInterestConfigurationRepository.findById(id);

    if (!configuration || configuration.isDeleted) {
      throw new AppError("Interest configuration not found", 404);
    }

    // Validate Loan Type if changed
    if (data.loanTypeId) {
      const loanType = await loanInterestConfigurationRepository.findLoanType(
        data.loanTypeId,
      );

      if (!loanType) {
        throw new AppError("Loan type not found", 404);
      }
    }

    // Check overlapping if range fields changed
    if (
      data.minAmount ||
      data.maxAmount ||
      data.minTenure ||
      data.maxTenure ||
      data.loanTypeId
    ) {
      const overlap =
        await loanInterestConfigurationRepository.findOverlappingConfiguration({
          loanTypeId: data.loanTypeId ?? configuration.loanTypeId,
          minAmount: data.minAmount ?? configuration.minAmount,
          maxAmount: data.maxAmount ?? configuration.maxAmount,
          minTenure: data.minTenure ?? configuration.minTenure,
          maxTenure: data.maxTenure ?? configuration.maxTenure,
        });

      if (overlap && overlap.id !== id) {
        throw new AppError(
          "An overlapping interest configuration already exists",
          409,
        );
      }
    }

    return loanInterestConfigurationRepository.update(id, data);
  },

  async updateStatus(id, isActive) {
    const configuration =
      await loanInterestConfigurationRepository.findById(id);

    if (!configuration || configuration.isDeleted) {
      throw new AppError("Interest configuration not found", 404);
    }

    return loanInterestConfigurationRepository.updateStatus(id, isActive);
  },

  async delete(id) {
    const configuration =
      await loanInterestConfigurationRepository.findById(id);

    if (!configuration || configuration.isDeleted) {
      throw new AppError("Interest configuration not found", 404);
    }

    return loanInterestConfigurationRepository.softDelete(id);
  },
};
