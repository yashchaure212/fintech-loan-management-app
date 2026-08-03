import { loanRepository } from "../repositories/loan.repository.js";
import AppError from "../utils/AppError.js";
import { calculateEMI } from "../utils/emi.util.js";
import { generateApplicationNumber } from "../utils/application-number.util.js";

export const loanService = {
  async createApplication(userId, data) {
    const { loanTypeId, loanAmount, tenureMonths } = data;

    // 1. Loan Type
    const loanType = await this.getLoanType(loanTypeId);

    // 2. Interest Configuration
    const configuration = await this.getInterestConfiguration(loanTypeId);

    // 3. Eligibility Rules
    const eligibility = await this.getEligibilityRule(loanTypeId);

    // 4. Required Documents
    const requiredDocuments =
      await loanRepository.findRequiredDocuments(loanTypeId);

    // 5. Customer Profile
    const profile = await loanRepository.findCustomerProfile(userId);

    // 6. Employment
    const employment = await loanRepository.findEmployment(userId);

    // 7. Uploaded KYC
    const uploadedDocuments =
      await loanRepository.findVerifiedDocuments(userId);

    // 8. Business Validations
    this.validateLoanAmount(configuration, loanAmount);
    this.validateTenure(configuration, tenureMonths);
    this.validateEligibility(profile, employment, eligibility);
    this.validateDocuments(requiredDocuments, uploadedDocuments);

    // 9. Processing Fee
    const processingFee = this.calculateProcessingFee(
      configuration,
      loanAmount,
    );

    // 10. EMI
    const emiDetails = calculateEMI({
      principal: Number(loanAmount),
      annualInterestRate: Number(configuration.interestRate),
      tenureMonths,
    });

    // 11. Application Number
    const applicationNumber = generateApplicationNumber();

    const configurationSnapshot = {
      loanType: {
        id: loanType.id,
        name: loanType.name,
        code: loanType.code,
        category: loanType.category,
      },

      interestConfiguration: {
        interestRate: Number(configuration.interestRate),

        minAmount: Number(configuration.minAmount),

        maxAmount: Number(configuration.maxAmount),

        minTenure: configuration.minTenure,

        maxTenure: configuration.maxTenure,

        processingFee: Number(configuration.processingFee),

        processingFeeType: configuration.processingFeeType,

        gstPercentage: Number(configuration.gstPercentage),

        latePenalty: configuration.latePenalty
          ? Number(configuration.latePenalty)
          : null,

        foreclosureCharge: configuration.foreclosureCharge
          ? Number(configuration.foreclosureCharge)
          : null,
      },

      eligibility: eligibility,

      requiredDocuments: requiredDocuments,
    };

    // 12. Save Application
    return loanRepository.createLoanApplication({
      userId,

      loanTypeId,

      applicationNumber,

      loanAmount,

      tenureMonths,

      interestRate: configuration.interestRate,

      processingFee,

      emi: emiDetails.emi,

      totalInterest: emiDetails.totalInterest,

      totalAmount: emiDetails.totalAmount,

      configurationSnapshot,
    });
  },

  async getLoanType(id) {
    const loanType = await loanRepository.findLoanTypeById(id);

    if (!loanType) throw new AppError("Loan type not found", 404);

    if (!loanType.isActive || loanType.isDeleted)
      throw new AppError("Loan type is not available", 400);

    return loanType;
  },

  async getInterestConfiguration(loanTypeId) {
    const configuration =
      await loanRepository.findActiveInterestConfiguration(loanTypeId);

    if (!configuration) throw new AppError("Loan configuration not found", 404);

    return configuration;
  },

  async getEligibilityRule(loanTypeId) {
    const eligibility = await loanRepository.findEligibilityRule(loanTypeId);

    if (!eligibility)
      throw new AppError("Eligibility configuration missing", 500);

    return eligibility;
  },

  validateLoanAmount(configuration, amount) {
    if (amount < configuration.minAmount)
      throw new AppError(`Minimum amount is ₹${configuration.minAmount}`, 400);

    if (amount > configuration.maxAmount)
      throw new AppError(`Maximum amount is ₹${configuration.maxAmount}`, 400);
  },

  validateTenure(configuration, tenure) {
    if (tenure < configuration.minTenure)
      throw new AppError(
        `Minimum tenure is ${configuration.minTenure} months`,
        400,
      );

    if (tenure > configuration.maxTenure)
      throw new AppError(
        `Maximum tenure is ${configuration.maxTenure} months`,
        400,
      );
  },

  validateEligibility(profile, employment, eligibility) {
    // We'll implement age, salary, experience,
    // and credit score validation here next.
  },

  validateDocuments(required, uploaded) {
    // We'll compare required vs verified KYC documents.
  },

  calculateProcessingFee(configuration, amount) {
    if (configuration.processingFeeType === "FIXED") {
      return configuration.processingFee;
    }

    return (Number(amount) * Number(configuration.processingFee)) / 100;
  },
};
