import { randomUUID } from "crypto";
import { loanApplicationRepository } from "../repositories/loanApplication.repository.js";
import { loanCalculationService } from "./loanCalculation.service.js";
import AppError from "../utils/AppError.js";

export const loanApplicationService = {
  async create(userId, data) {
    // 1. Validate Loan Type
    const loanType = await loanApplicationRepository.findLoanType(
      data.loanTypeId,
    );

    if (!loanType) {
      throw new AppError("Loan type not found", 404);
    }

    // 2. Load Interest Configuration
    const configuration =
      await loanApplicationRepository.findInterestConfiguration(
        loanType.id,
        data.loanAmount,
        data.tenureMonths,
      );

    if (!configuration) {
      throw new AppError(
        "No interest configuration found for the selected amount and tenure",
        400,
      );
    }

    // 3. Calculate Loan
    const calculation = loanCalculationService.calculateLoan(
      data.loanAmount,
      data.tenureMonths,
      configuration,
    );

    // 4. Generate Application Number
    const applicationNumber = `APP-${Date.now()}-${randomUUID().slice(0, 6).toUpperCase()}`;

    // 5. Snapshot
    const snapshot = {
      loanType: {
        id: loanType.id,
        name: loanType.name,
        code: loanType.code,
      },

      interestConfiguration: {
        interestRate: calculation.interestRate,
        processingFee: configuration.processingFee,
        processingFeeType: configuration.processingFeeType,
        gstPercentage: configuration.gstPercentage,
        minAmount: configuration.minAmount,
        maxAmount: configuration.maxAmount,
        minTenure: configuration.minTenure,
        maxTenure: configuration.maxTenure,
      },
    };

    // 6. Transaction
    return loanApplicationRepository.transaction(async (tx) => {
      const application = await loanApplicationRepository.create(tx, {
        userId,

        loanTypeId: loanType.id,

        applicationNumber,

        loanAmount: data.loanAmount,

        tenureMonths: data.tenureMonths,

        interestRate: calculation.interestRate,

        processingFee: calculation.processingFee,

        emi: calculation.emi,

        totalInterest: calculation.totalInterest,

        totalAmount: calculation.totalAmount,

        configurationSnapshot: snapshot,
      });

      await loanApplicationRepository.createStatusHistory(tx, {
        loanApplicationId: application.id,

        status: "SUBMITTED",

        changedById: userId,

        remarks: "Loan application submitted",
      });

      return application;
    });
  },

  async getMyApplications(userId) {
    return loanApplicationRepository.findByUser(userId);
  },

  async getById(id) {
    const application = await loanApplicationRepository.findById(id);

    if (!application) {
      throw new AppError("Loan application not found", 404);
    }

    return application;
  },
};
