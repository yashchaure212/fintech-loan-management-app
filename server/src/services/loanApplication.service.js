import { loanApplicationRepository } from "../repositories/loanApplication.repository.js";
import { loanCalculationService } from "./loanCalculation.service.js";
import { loanValidationService } from "./loanValidation.service.js";
import { loanRequiredDocumentService } from "./loanRequiredDocument.service.js";
import { generateApplicationNumber } from "../utils/application-number.util.js";
import { withSignedDocumentUrl } from "./file.service.js";
import AppError from "../utils/AppError.js";

function withSignedDocuments(application) {
  if (!application?.documents) {
    return application;
  }

  return {
    ...application,
    documents: application.documents.map(withSignedDocumentUrl),
  };
}

export const loanApplicationService = {
  async create(userId, data) {
    const { loanTypeId } = data;

    const loanType = await loanApplicationRepository.findLoanType(loanTypeId);

    if (!loanType) {
      throw new AppError("Loan type not found or inactive", 404);
    }

    const applicationNumber = generateApplicationNumber();

    return loanApplicationRepository.transaction(async (tx) => {
      const application = await loanApplicationRepository.create(tx, {
        userId,
        loanTypeId,
        applicationNumber,
        status: "DRAFT",
        currentStep: 1,
      });

      await loanApplicationRepository.createStatusHistory(tx, {
        loanApplicationId: application.id,
        status: "DRAFT",
        remarks: "Loan application draft created",
        changedById: userId,
      });

      return application;
    });
  },

  async getMyApplications(userId) {
    return loanApplicationRepository.findByUser(userId);
  },

  async getById(userId, loanApplicationId) {
    const application =
      await loanApplicationRepository.findById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    return withSignedDocuments(application);
  },

  async updateDraft(userId, loanApplicationId, data) {
    const application =
      await loanApplicationRepository.findById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    const updateData = {};

    const nextAmount =
      data.loanAmount !== undefined
        ? data.loanAmount
        : application.loanAmount
          ? Number(application.loanAmount)
          : null;

    const nextTenure =
      data.tenureMonths !== undefined
        ? data.tenureMonths
        : (application.tenureMonths ?? null);

    if (data.currentStep !== undefined) {
      const projectedApplication = {
        ...application,
        loanAmount: nextAmount,
        tenureMonths: nextTenure,
      };

      const requiredDocuments =
        await loanRequiredDocumentService.resolveForApplication(application.id);

      updateData.currentStep = loanValidationService.assertAllowedCurrentStep(
        projectedApplication,
        data.currentStep,
        requiredDocuments,
        application.documents || [],
      );
    }

    const amountChanged = data.loanAmount !== undefined;
    const tenureChanged = data.tenureMonths !== undefined;

    if (amountChanged || tenureChanged) {
      if (nextAmount === null || nextTenure === null) {
        updateData.loanAmount = nextAmount;
        updateData.tenureMonths = nextTenure;

        updateData.interestRate = null;
        updateData.processingFee = null;
        updateData.emi = null;
        updateData.totalInterest = null;
        updateData.totalAmount = null;
        updateData.configurationSnapshot = null;
      } else {
        const configuration =
          await loanApplicationRepository.findInterestConfiguration(
            application.loanTypeId,
            nextAmount,
            nextTenure,
          );

        if (!configuration) {
          throw new AppError(
            "No active loan configuration is available for the selected amount and tenure",
            400,
          );
        }

        loanValidationService.validateLoanAmount(configuration, nextAmount);

        loanValidationService.validateTenure(configuration, nextTenure);

        const calculation = loanCalculationService.calculateLoan(
          nextAmount,
          nextTenure,
          configuration,
        );

        updateData.loanAmount = nextAmount;
        updateData.tenureMonths = nextTenure;
        updateData.interestRate = calculation.interestRate;
        updateData.processingFee = calculation.processingFee;
        updateData.emi = calculation.emi;
        updateData.totalInterest = calculation.totalInterest;
        updateData.totalAmount = calculation.totalAmount;

        // Configuration is finalized again during submit.
        updateData.configurationSnapshot = null;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return application;
    }

    return loanApplicationRepository.transaction(async (tx) => {
      return loanApplicationRepository.update(tx, application.id, updateData);
    });
  },

  async submit(userId, loanApplicationId, consent = {}) {
    const application =
      await loanApplicationRepository.findById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    if (!application.loanAmount) {
      throw new AppError("Loan amount is required before submission", 400);
    }

    if (!application.tenureMonths) {
      throw new AppError("Tenure is required before submission", 400);
    }

    const loanAmount = Number(application.loanAmount);
    const tenureMonths = application.tenureMonths;

    const configuration =
      await loanApplicationRepository.findInterestConfiguration(
        application.loanTypeId,
        loanAmount,
        tenureMonths,
      );

    if (!configuration) {
      throw new AppError(
        "No active loan configuration is available for the selected amount and tenure",
        400,
      );
    }

    const eligibilityRule = await loanApplicationRepository.findEligibilityRule(
      application.loanTypeId,
    );

    const requiredDocuments =
      await loanRequiredDocumentService.resolveForApplication(application.id);

    const uploadedDocuments = application.documents || [];

    const customerProfile =
      await loanApplicationRepository.findCustomerProfile(userId);

    loanValidationService.validateApplicationReadyForSubmit(
      {
        ...application,
        ...consent,
        user: {
          customerProfile,
        },
      },
      configuration,
      eligibilityRule,
      requiredDocuments,
      uploadedDocuments,
    );

    const calculation = loanCalculationService.calculateLoan(
      loanAmount,
      tenureMonths,
      configuration,
    );

    const configurationSnapshot = {
      loanTypeId: application.loanTypeId,
      configurationId: configuration.id,
      minAmount: Number(configuration.minAmount),
      maxAmount: Number(configuration.maxAmount),
      minTenure: configuration.minTenure,
      maxTenure: configuration.maxTenure,
      interestRate: Number(configuration.interestRate),
      processingFee: Number(configuration.processingFee),
      processingFeeType: configuration.processingFeeType,
      gstPercentage: Number(configuration.gstPercentage),
      latePenalty:
        configuration.latePenalty !== null
          ? Number(configuration.latePenalty)
          : null,
      foreclosureCharge:
        configuration.foreclosureCharge !== null
          ? Number(configuration.foreclosureCharge)
          : null,
      effectiveFrom: configuration.effectiveFrom,
      effectiveTo: configuration.effectiveTo,
      capturedAt: new Date(),
    };

    return loanApplicationRepository.transaction(async (tx) => {
      /*
       * Re-read inside the transaction so two simultaneous
       * submit requests cannot both successfully submit the
       * same draft.
       */
      const current = await tx.loanApplication.findUnique({
        where: {
          id: application.id,
        },
      });

      if (!current || current.userId !== userId) {
        throw new AppError("Loan application not found", 404);
      }

      if (current.status !== "DRAFT") {
        throw new AppError("Loan application has already been submitted", 400);
      }

      const updated = await tx.loanApplication.update({
        where: {
          id: application.id,
        },
        data: {
          loanAmount,
          tenureMonths,
          interestRate: calculation.interestRate,
          processingFee: calculation.processingFee,
          emi: calculation.emi,
          totalInterest: calculation.totalInterest,
          totalAmount: calculation.totalAmount,
          configurationSnapshot,
          status: "SUBMITTED",
          submittedAt: new Date(),
          infoAccuracyConsent: Boolean(consent.infoAccuracyConsent),
          infoVerificationConsent: Boolean(consent.infoVerificationConsent),
          documentVerificationConsent: Boolean(
            consent.documentVerificationConsent,
          ),
          termsAccepted: Boolean(consent.termsAccepted),
          privacyPolicyAccepted: Boolean(consent.privacyPolicyAccepted),
          consentedAt: new Date(),
        },
        include: {
          loanType: true,
        },
      });

      await tx.loanApplicationStatusHistory.create({
        data: {
          loanApplicationId: application.id,
          status: "SUBMITTED",
          remarks: "Loan application submitted",
          changedById: userId,
        },
      });

      return updated;
    });
  },
};
