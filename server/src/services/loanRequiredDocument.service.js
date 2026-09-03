import { loanRequiredDocumentRepository } from "../repositories/loanRequiredDocument.repository.js";
import { loanApplicationRepository } from "../repositories/loanApplication.repository.js";
import {
  CUSTOMER_DOCUMENT_STATES,
  CUSTOMER_DOCUMENT_STATE_LABELS,
  SCHOOL_STUDENT_LOAN_CODE,
  documentLabel,
  documentOwnerLabel,
  isAllowedSchoolLoanRequirement,
  isSatisfiedCustomerDocumentState,
  requirementKey,
  toCustomerDocumentState,
} from "../constants/loanProducts.js";
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

  if (application.studentLoan?.parents?.length) {
    for (const parent of application.studentLoan.parents) {
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

  if (application.schoolLoan?.coApplicants?.length) {
    for (const person of application.schoolLoan.coApplicants) {
      if (!person.employment?.employmentType) {
        continue;
      }

      const ownerType =
        person.relation === "FATHER"
          ? "FATHER"
          : person.relation === "MOTHER"
            ? "MOTHER"
            : person.relation === "GUARDIAN"
              ? "GUARDIAN"
              : null;

      if (ownerType) {
        context.set(ownerType, person.employment.employmentType);
      }

      if (person.isCoApplicant) {
        context.set("CO_APPLICANT", person.employment.employmentType);
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

  if (application.studentLoan) {
    owners.add("STUDENT");

    for (const parent of application.studentLoan.parents || []) {
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

  if (application.schoolLoan) {
    owners.add("STUDENT");

    for (const person of application.schoolLoan.coApplicants || []) {
      if (person.relation === "FATHER") {
        owners.add("FATHER");
      }

      if (person.relation === "MOTHER") {
        owners.add("MOTHER");
      }

      if (person.relation === "GUARDIAN") {
        owners.add("GUARDIAN");
      }

      if (person.isCoApplicant) {
        owners.add("CO_APPLICANT");
      }
    }

    owners.add("APPLICANT");
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

function applySchoolLoanConditionalRequirements(application, resolved) {
  if (!application.schoolLoan) {
    return resolved;
  }

  const coApplicants = application.schoolLoan.coApplicants || [];

  const findByOwnerType = (ownerType) =>
    coApplicants.find((person) => person.relation === ownerType) ||
    (ownerType === "CO_APPLICANT"
      ? coApplicants.find((person) => person.isCoApplicant)
      : null);

  return resolved
    .map((requirement) => {
      if (requirement.documentType === "EXISTING_LOAN_STATEMENT") {
        return application.schoolLoan.hasExistingLoans
          ? { ...requirement, isMandatory: true }
          : null;
      }

      if (
        requirement.documentType === "GST_CERTIFICATE" ||
        requirement.documentType === "UDYAM_CERTIFICATE"
      ) {
        const owner = findByOwnerType(requirement.ownerType);
        const registrations = owner?.employment?.registrations || [];
        const matchType =
          requirement.documentType === "GST_CERTIFICATE" ? "GST" : "UDYAM";
        const hasMatchingRegistration = registrations.some(
          (registration) => registration.registrationType === matchType,
        );

        return hasMatchingRegistration
          ? { ...requirement, isMandatory: true }
          : null;
      }

      if (requirement.documentType === "LAND_LEASE_PROOF") {
        const owner = findByOwnerType(requirement.ownerType);
        const landOwnership = owner?.employment?.landOwnership;

        return landOwnership === "LEASED" ||
          landOwnership === "PARTIALLY_OWNED_LEASED"
          ? { ...requirement, isMandatory: true }
          : null;
      }

      return requirement;
    })
    .filter(Boolean);
}

/*
 * ============================================================
 * ONE SOURCE OF TRUTH
 * ============================================================
 *
 * Every requirement returned here is:
 *   - applicable to this application (owner + employment context)
 *   - part of the supported document vocabulary
 *   - labelled for the customer by the backend
 *
 * The customer UI renders exactly this list and submission validates
 * exactly this list, so a requirement can never be hidden in one
 * place while still blocking in another.
 */

function filterToSupportedSlots(application, requirements) {
  if (application.loanType?.code !== SCHOOL_STUDENT_LOAN_CODE) {
    return requirements;
  }

  return requirements.filter((requirement) =>
    isAllowedSchoolLoanRequirement(
      requirement.ownerType,
      requirement.documentType,
    ),
  );
}

function enrichRequirement(requirement) {
  return {
    ...requirement,
    key: requirementKey(requirement.ownerType, requirement.documentType),
    label: documentLabel(requirement.documentType),
    ownerLabel: documentOwnerLabel(requirement.ownerType),
  };
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

    if (
      loanType.code === SCHOOL_STUDENT_LOAN_CODE &&
      !isAllowedSchoolLoanRequirement(data.ownerType, data.documentType)
    ) {
      throw new AppError(
        "This document is not part of the School Student Loan document set",
        400,
      );
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

    const resolved = applySchoolLoanConditionalRequirements(
      application,
      resolveRequirements(allRequirements, employmentContext, ownerContext),
    );

    return filterToSupportedSlots(application, resolved).map(enrichRequirement);
  },

  /*
   * ============================================================
   * CUSTOMER DOCUMENT CHECKLIST
   * ============================================================
   *
   * The exact list the customer sees, each slot carrying its own
   * customer-facing state. An uploaded-but-unreviewed document is
   * reported as AWAITING_REVIEW, never as missing.
   */

  async buildChecklist(loanApplicationId) {
    const application =
      await loanApplicationRepository.findById(loanApplicationId);

    if (!application) {
      throw new AppError("Loan application not found", 404);
    }

    const requirements = await this.resolveForApplication(loanApplicationId);
    const uploadedDocuments = application.documents || [];
    const isDraft = application.status === "DRAFT";
    const canCorrect =
      isDraft ||
      application.status === "SUBMITTED" ||
      application.status === "UNDER_REVIEW";

    const items = requirements.map((requirement) => {
      const documentsForSlot = uploadedDocuments.filter(
        (document) =>
          document.ownerType === requirement.ownerType &&
          document.documentType === requirement.documentType,
      );

      const customerState = toCustomerDocumentState(documentsForSlot);

      const activeDocument =
        documentsForSlot.find((document) => document.status === "VERIFIED") ||
        documentsForSlot.find((document) => document.status === "PENDING") ||
        documentsForSlot.find((document) => document.status === "REJECTED") ||
        null;

      return {
        key: requirement.key,
        ownerType: requirement.ownerType,
        ownerLabel: requirement.ownerLabel,
        documentType: requirement.documentType,
        label: requirement.label,
        isMandatory: requirement.isMandatory,
        customerState,
        stateLabel: CUSTOMER_DOCUMENT_STATE_LABELS[customerState],
        isSatisfied: isSatisfiedCustomerDocumentState(customerState),
        documentId: activeDocument?.id ?? null,
        uploadedAt: activeDocument?.createdAt ?? null,
        rejectionReason:
          customerState === CUSTOMER_DOCUMENT_STATES.REJECTED
            ? (activeDocument?.rejectionReason ?? null)
            : null,
        canUpload:
          customerState === CUSTOMER_DOCUMENT_STATES.MISSING
            ? isDraft
            : customerState === CUSTOMER_DOCUMENT_STATES.REJECTED && canCorrect,
        canDelete:
          isDraft && customerState === CUSTOMER_DOCUMENT_STATES.AWAITING_REVIEW,
      };
    });

    const mandatory = items.filter((item) => item.isMandatory);

    return {
      loanApplicationId,
      status: application.status,
      items,
      summary: {
        total: items.length,
        mandatory: mandatory.length,
        mandatorySatisfied: mandatory.filter((item) => item.isSatisfied).length,
        missingMandatory: mandatory
          .filter((item) => !item.isSatisfied)
          .map((item) => ({
            key: item.key,
            label: item.label,
            ownerLabel: item.ownerLabel,
          })),
        isComplete: mandatory.every((item) => item.isSatisfied),
      },
    };
  },

  /*
   * ============================================================
   * FIND MISSING MANDATORY DOCUMENTS
   * ============================================================
   */

  /*
   * A document that has been uploaded but not yet reviewed (PENDING)
   * counts as supplied. Only a REJECTED document leaves the slot open.
   */
  findMissingMandatoryDocuments(requiredDocuments, uploadedDocuments) {
    const uploadedKeys = new Set(
      uploadedDocuments
        .filter((doc) => doc.status !== "REJECTED")
        .map((doc) => requirementKey(doc.ownerType, doc.documentType)),
    );

    return requiredDocuments
      .filter((doc) => doc.isMandatory)
      .filter(
        (doc) => !uploadedKeys.has(requirementKey(doc.ownerType, doc.documentType)),
      )
      .map((doc) => requirementKey(doc.ownerType, doc.documentType));
  },

  describeMissingMandatoryDocuments(requiredDocuments, uploadedDocuments) {
    const missingKeys = new Set(
      this.findMissingMandatoryDocuments(requiredDocuments, uploadedDocuments),
    );

    return requiredDocuments
      .filter((doc) =>
        missingKeys.has(requirementKey(doc.ownerType, doc.documentType)),
      )
      .map(
        (doc) =>
          `${doc.label || documentLabel(doc.documentType)} for the ${(
            doc.ownerLabel || documentOwnerLabel(doc.ownerType)
          ).toLowerCase()}`,
      );
  },
};
