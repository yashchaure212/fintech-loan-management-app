import { loanInterestConfigurationRepository } from "../repositories/loanInterestConfiguration.repository.js";
import {
  SCHOOL_STUDENT_LOAN_CODE,
  isSupportedLoanTypeCode,
} from "../constants/loanProducts.js";
import AppError from "../utils/AppError.js";

const ONE_SECOND_MS = 1000;

function assertRanges(data) {
  if (data.maxAmount < data.minAmount) {
    throw new AppError(
      "Maximum loan amount must be greater than or equal to the minimum loan amount",
      400,
    );
  }

  if (data.maxTenure < data.minTenure) {
    throw new AppError(
      "Maximum tenure must be greater than or equal to the minimum tenure",
      400,
    );
  }

  if (data.effectiveTo && data.effectiveTo <= data.effectiveFrom) {
    throw new AppError(
      "Effective To must be after Effective From",
      400,
    );
  }
}

function normalizeVersionInput(data) {
  const effectiveFrom = data.effectiveFrom
    ? new Date(data.effectiveFrom)
    : new Date();

  const normalized = {
    loanTypeId: data.loanTypeId,
    minAmount: Number(data.minAmount),
    maxAmount: Number(data.maxAmount),
    minTenure: Number(data.minTenure),
    maxTenure: Number(data.maxTenure),
    interestRate: Number(data.interestRate),
    processingFee: Number(data.processingFee),
    processingFeeType: data.processingFeeType,
    gstPercentage: Number(data.gstPercentage),
    latePenalty:
      data.latePenalty === undefined || data.latePenalty === null
        ? null
        : Number(data.latePenalty),
    foreclosureCharge:
      data.foreclosureCharge === undefined ||
      data.foreclosureCharge === null
        ? null
        : Number(data.foreclosureCharge),
    effectiveFrom,
    effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
    isActive: true,
  };

  assertRanges(normalized);

  return normalized;
}

export const loanInterestConfigurationService = {
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

  async getHistory(loanTypeId) {
    const loanType =
      await loanInterestConfigurationRepository.findLoanType(loanTypeId);

    if (!loanType) {
      throw new AppError("Loan type not found", 404);
    }

    const versions =
      await loanInterestConfigurationRepository.findHistoryByLoanType(
        loanTypeId,
      );

    const now = new Date();

    const applicableId = versions.find(
      (version) =>
        version.isActive &&
        version.effectiveFrom <= now &&
        (version.effectiveTo === null ||
          version.effectiveTo >= now),
    )?.id;

    return {
      loanType,
      versions: versions.map((version, index) => ({
        ...version,
        version: versions.length - index,
        isApplicable: version.id === applicableId,
      })),
    };
  },

  async getApplicable(loanTypeId, at = new Date()) {
    const configuration =
      await loanInterestConfigurationRepository.findApplicable(
        loanTypeId,
        at,
      );

    if (!configuration) {
      throw new AppError(
        "No pricing configuration is currently available for this loan product",
        404,
      );
    }

    return configuration;
  },

  /*
   * Customer-facing pricing lookup.
   *
   * This intentionally throws when no applicable configuration exists.
   */
  async getApplicableForSupportedProduct(at = new Date()) {
    const loanType =
      await loanInterestConfigurationRepository.findLoanTypeByCode(
        SCHOOL_STUDENT_LOAN_CODE,
      );

    if (!loanType || !loanType.isActive) {
      throw new AppError(
        "This loan product is not available",
        404,
      );
    }

    const configuration = await this.getApplicable(
      loanType.id,
      at,
    );

    return {
      loanType,
      configuration,
    };
  },

  /*
   * Admin-facing configuration history.
   *
   * Unlike getApplicableForSupportedProduct(), this method does
   * NOT require an active pricing configuration to exist.
   *
   * This allows the admin to open the configuration page and
   * create the very first pricing version.
   */
  async getSupportedProductHistory() {
    const loanType =
      await loanInterestConfigurationRepository.findLoanTypeByCode(
        SCHOOL_STUDENT_LOAN_CODE,
      );

    if (!loanType || !loanType.isActive) {
      throw new AppError(
        "This loan product is not available",
        404,
      );
    }

    return this.getHistory(loanType.id);
  },

  async createVersion(data) {
    const input = normalizeVersionInput(data);

    return loanInterestConfigurationRepository.transaction(
      async (tx) => {
        const loanType =
          await loanInterestConfigurationRepository.findLoanType(
            input.loanTypeId,
            tx,
          );

        if (!loanType) {
          throw new AppError("Loan type not found", 404);
        }

        if (!isSupportedLoanTypeCode(loanType.code)) {
          throw new AppError(
            "Pricing can only be configured for supported loan products",
            400,
          );
        }

        const future =
          await loanInterestConfigurationRepository.findFutureVersion(
            input.loanTypeId,
            input.effectiveFrom,
            tx,
          );

        if (future) {
          throw new AppError(
            "A configuration version already starts on or after this effective date. Choose a later effective date.",
            409,
          );
        }

        const openVersions =
          await loanInterestConfigurationRepository.findOpenVersions(
            input.loanTypeId,
            input.effectiveFrom,
            tx,
          );

        const closesAt = new Date(
          input.effectiveFrom.getTime() - ONE_SECOND_MS,
        );

        for (const version of openVersions) {
          if (version.effectiveFrom >= input.effectiveFrom) {
            throw new AppError(
              "A configuration version already starts on or after this effective date. Choose a later effective date.",
              409,
            );
          }

          await loanInterestConfigurationRepository.closeVersion(
            version.id,
            closesAt,
            tx,
          );
        }

        return loanInterestConfigurationRepository.createIn(
          tx,
          input,
        );
      },
    );
  },

  async create(data) {
    return this.createVersion(data);
  },

  async update() {
    throw new AppError(
      "Loan pricing cannot be edited in place. Create a new configuration version instead.",
      409,
    );
  },

  async updateStatus(id, isActive) {
    const configuration =
      await loanInterestConfigurationRepository.findById(id);

    if (!configuration || configuration.isDeleted) {
      throw new AppError(
        "Interest configuration not found",
        404,
      );
    }

    if (isActive) {
      throw new AppError(
        "A historical configuration version cannot be reactivated. Create a new version instead.",
        409,
      );
    }

    return loanInterestConfigurationRepository.updateStatus(
      id,
      false,
    );
  },

  async delete(id) {
    const configuration =
      await loanInterestConfigurationRepository.findById(id);

    if (!configuration || configuration.isDeleted) {
      throw new AppError(
        "Interest configuration not found",
        404,
      );
    }

    const usageCount =
      await loanInterestConfigurationRepository.countApplicationsUsingConfiguration(
        id,
      );

    if (usageCount > 0) {
      throw new AppError(
        "This configuration version has priced existing loan applications and must be retained for historical accuracy.",
        409,
      );
    }

    return loanInterestConfigurationRepository.softDelete(id);
  },
};