import { loanRequiredDocumentRepository } from "../repositories/loanRequiredDocument.repository.js";
import { loanApplicationRepository } from "../repositories/loanApplication.repository.js";
import AppError from "../utils/AppError.js";

/*
 * ============================================================
 * BUILD EMPLOYMENT CONTEXT
 * ============================================================
 *
 * Instead of only collecting employment types globally,
 * keep the relationship:
 *
 * ownerType -> employmentType
 *
 * Example:
 *
 * FATHER -> SALARIED
 * MOTHER -> FARMER
 * STUDENT -> null
 */

function buildEmploymentContext(application) {
  const context = new Map();

  /*
   * Education loan
   */

  if (application.educationLoan?.parents?.length) {
    for (const parent of application.educationLoan.parents) {
      if (!parent.employment?.employmentType) {
        continue;
      }

      const ownerType =
        parent.relation === "FATHER"
          ? "FATHER"
          : parent.relation === "MOTHER"
            ? "MOTHER"
            : null;

      if (!ownerType) {
        continue;
      }

      context.set(ownerType, parent.employment.employmentType);

      /*
       * Co-applicant requirements use ownerType CO_APPLICANT.
       * Map the co-applicant parent's own employment type so
       * FATHER salaried does not unlock MOTHER/CO_APPLICANT
       * employment-specific docs incorrectly.
       */
      if (parent.isCoApplicant) {
        context.set("CO_APPLICANT", parent.employment.employmentType);
      }
    }
  }

  /*
   * Personal loan
   *
   * Personal loan employment belongs to the applicant.
   */

  if (application.personalLoan?.employment?.employmentType) {
    context.set(
      "APPLICANT",
      application.personalLoan.employment.employmentType,
    );
  }

  return context;
}

function buildOwnerContext(application) {
  const owners = new Set();

  if (application.educationLoan) {
    owners.add("STUDENT");

    for (const parent of application.educationLoan.parents || []) {
      if (parent.relation === "FATHER") {
        owners.add("FATHER");
      }

      if (parent.relation === "MOTHER") {
        owners.add("MOTHER");
      }

      if (parent.isCoApplicant) {
        owners.add("CO_APPLICANT");
      }
    }
  }

  if (application.personalLoan) {
    owners.add("APPLICANT");
  }

  return owners;
}

/*
 * ============================================================
 * RESOLVE REQUIREMENTS
 * ============================================================
 *
 * Rules:
 *
 * 1. owner must exist on the application
 * 2. employmentType = null → always applicable for that owner
 * 3. employmentType exists → only when that owner's employment matches
 */

function resolveRequirements(allRequirements, employmentContext, ownerContext) {
  return allRequirements.filter((requirement) => {
    if (!ownerContext.has(requirement.ownerType)) {
      return false;
    }

    if (requirement.employmentType == null) {
      return true;
    }

    const ownerEmploymentType = employmentContext.get(requirement.ownerType);

    return ownerEmploymentType === requirement.employmentType;
  });
}

export const loanRequiredDocumentService = {
  /*
   * ============================================================
   * CREATE
   * ============================================================
   */

  async create(data) {
    const loanType = await loanRequiredDocumentRepository.findLoanType(
      data.loanTypeId,
    );

    if (!loanType) {
      throw new AppError("Loan type not found", 404);
    }

    const employmentType = data.employmentType ?? null;

    const existing = await loanRequiredDocumentRepository.findDuplicate({
      loanTypeId: data.loanTypeId,
      documentType: data.documentType,
      ownerType: data.ownerType,
      employmentType,
    });

    if (existing) {
      throw new AppError(
        "Document already configured for this loan type, owner, and employment type",
        409,
      );
    }

    return loanRequiredDocumentRepository.create({
      ...data,
      employmentType,
    });
  },

  /*
   * ============================================================
   * GET ALL
   * ============================================================
   */

  async getAll() {
    return loanRequiredDocumentRepository.findAll();
  },

  /*
   * ============================================================
   * GET BY ID
   * ============================================================
   */

  async getById(id) {
    const document = await loanRequiredDocumentRepository.findById(id);

    if (!document) {
      throw new AppError("Required document not found", 404);
    }

    return document;
  },

  /*
   * ============================================================
   * UPDATE
   * ============================================================
   */

  async update(id, data) {
    const document = await loanRequiredDocumentRepository.findById(id);

    if (!document) {
      throw new AppError("Required document not found", 404);
    }

    /*
     * If loan type is changing, make sure the new loan type exists.
     */

    if (data.loanTypeId && data.loanTypeId !== document.loanTypeId) {
      const loanType = await loanRequiredDocumentRepository.findLoanType(
        data.loanTypeId,
      );

      if (!loanType) {
        throw new AppError("Loan type not found", 404);
      }
    }

    const loanTypeId = data.loanTypeId ?? document.loanTypeId;

    const documentType = data.documentType ?? document.documentType;

    const ownerType = data.ownerType ?? document.ownerType;

    const employmentType =
      data.employmentType !== undefined
        ? data.employmentType
        : document.employmentType;

    /*
     * Prevent duplicate configuration.
     */

    const existing = await loanRequiredDocumentRepository.findDuplicate({
      loanTypeId,
      documentType,
      ownerType,
      employmentType,
    });

    if (existing && existing.id !== id) {
      throw new AppError(
        "Document already configured for this loan type, owner, and employment type",
        409,
      );
    }

    return loanRequiredDocumentRepository.update(id, {
      ...data,
      ...(data.employmentType !== undefined
        ? {
            employmentType: data.employmentType,
          }
        : {}),
    });
  },

  /*
   * ============================================================
   * DELETE
   * ============================================================
   */

  async delete(id) {
    const document = await loanRequiredDocumentRepository.findById(id);

    if (!document) {
      throw new AppError("Required document not found", 404);
    }

    return loanRequiredDocumentRepository.delete(id);
  },

  /*
   * ============================================================
   * RESOLVE DOCUMENT REQUIREMENTS
   * ============================================================
   */

  async resolveForApplication(loanApplicationId) {
    const application =
      await loanApplicationRepository.findById(loanApplicationId);

    if (!application) {
      throw new AppError("Loan application not found", 404);
    }

    /*
     * Get every configured requirement for this loan type.
     */

    const allRequirements = await loanRequiredDocumentRepository.findByLoanType(
      application.loanTypeId,
    );

    /*
     * Build owner-specific employment context.
     */

    const employmentContext = buildEmploymentContext(application);

    const ownerContext = buildOwnerContext(application);

    /*
     * Resolve only requirements applicable to this
     * particular application.
     */

    return resolveRequirements(
      allRequirements,
      employmentContext,
      ownerContext,
    );
  },

  /*
   * ============================================================
   * FIND MISSING MANDATORY DOCUMENTS
   * ============================================================
   */

  findMissingMandatoryDocuments(requiredDocuments, uploadedDocuments) {
    const uploadedKeys = new Set(
      uploadedDocuments
        .filter((doc) => doc.status !== "REJECTED")
        .map((doc) => `${doc.ownerType}:${doc.documentType}`),
    );

    return requiredDocuments
      .filter((doc) => doc.isMandatory)
      .filter(
        (doc) => !uploadedKeys.has(`${doc.ownerType}:${doc.documentType}`),
      )
      .map((doc) => `${doc.ownerType}:${doc.documentType}`);
  },
};
