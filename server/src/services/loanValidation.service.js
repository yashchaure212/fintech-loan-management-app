import AppError from "../utils/AppError.js";
import { loanRequiredDocumentService } from "./loanRequiredDocument.service.js";

const STUDENT_LOAN_CODE = "STUDENT_LOAN";
const SCHOOL_STUDENT_LOAN_CODE = "SCHOOL_STUDENT_LOAN";
const STUDENT_LOAN_TOTAL_STEPS = 5;
const SCHOOL_LOAN_TOTAL_STEPS = 7;
const DOCUMENT_CORRECTION_STATUSES = new Set(["SUBMITTED", "UNDER_REVIEW"]);

export const loanValidationService = {
  validateLoanAmount(configuration, amount) {
    if (Number(amount) < Number(configuration.minAmount)) {
      throw new AppError(
        `Minimum loan amount is ₹${configuration.minAmount}`,
        400,
      );
    }

    if (Number(amount) > Number(configuration.maxAmount)) {
      throw new AppError(
        `Maximum loan amount is ₹${configuration.maxAmount}`,
        400,
      );
    }
  },

  validateTenure(configuration, tenure) {
    if (tenure < configuration.minTenure) {
      throw new AppError(
        `Minimum tenure is ${configuration.minTenure} months`,
        400,
      );
    }

    if (tenure > configuration.maxTenure) {
      throw new AppError(
        `Maximum tenure is ${configuration.maxTenure} months`,
        400,
      );
    }
  },

  validateEligibility(profile, employment, eligibility) {
    if (!profile) {
      throw new AppError(
        "Please complete your profile before applying for a loan",
        400,
      );
    }

    if (!employment) {
      throw new AppError(
        "Please complete your employment details before applying for a loan",
        400,
      );
    }

    if (!profile.dateOfBirth) {
      throw new AppError("Date of birth is required", 400);
    }

    const today = new Date();

    let age = today.getFullYear() - profile.dateOfBirth.getFullYear();

    const monthDifference = today.getMonth() - profile.dateOfBirth.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < profile.dateOfBirth.getDate())
    ) {
      age--;
    }

    if (age < eligibility.minimumAge) {
      throw new AppError(
        `Minimum eligible age is ${eligibility.minimumAge} years`,
        400,
      );
    }

    if (age > eligibility.maximumAge) {
      throw new AppError(
        `Maximum eligible age is ${eligibility.maximumAge} years`,
        400,
      );
    }

    if (Number(employment.monthlyIncome) < Number(eligibility.minimumIncome)) {
      throw new AppError(
        `Minimum monthly income required is ₹${eligibility.minimumIncome}`,
        400,
      );
    }

    if (
      eligibility.minimumExperience !== null &&
      eligibility.minimumExperience !== undefined &&
      employment.experienceYears !== null &&
      employment.experienceYears !== undefined &&
      employment.experienceYears < eligibility.minimumExperience
    ) {
      throw new AppError(
        `Minimum ${eligibility.minimumExperience} years of experience required`,
        400,
      );
    }

    // Credit score validation will be added when credit score is implemented.
  },

  validateParentEmployment(employment) {
    if (!employment?.employmentType) {
      throw new AppError(
        "Employment information is required for each parent",
        400,
      );
    }

    const { employmentType } = employment;

    if (employmentType === "SALARIED") {
      if (
        !employment.companyName ||
        !employment.designation ||
        employment.monthlyIncome === undefined ||
        employment.monthlyIncome === null
      ) {
        throw new AppError(
          "Company name, designation and monthly income are required for salaried employment",
          400,
        );
      }
    }

    if (employmentType === "BUSINESS") {
      if (
        !employment.businessName ||
        !employment.businessType ||
        employment.annualIncome === undefined ||
        employment.annualIncome === null
      ) {
        throw new AppError(
          "Business name, business type and annual income are required for business employment",
          400,
        );
      }
    }

    if (employmentType === "FARMER") {
      const hasLand =
        (employment.landHoldingAcres !== undefined &&
          employment.landHoldingAcres !== null) ||
        (employment.landArea !== undefined && employment.landArea !== null);

      if (
        !hasLand ||
        !employment.cropType ||
        employment.agriculturalIncome === undefined ||
        employment.agriculturalIncome === null
      ) {
        throw new AppError(
          "Land holding, crop type and agricultural income are required for farmer employment",
          400,
        );
      }
    }

    if (employmentType === "CONTRACT") {
      if (
        !employment.employerName ||
        employment.contractDurationMonths === undefined ||
        employment.contractDurationMonths === null
      ) {
        throw new AppError(
          "Employer name and contract duration are required for contract employment",
          400,
        );
      }
    }

    if (employmentType === "OTHER") {
      if (!employment.occupation) {
        throw new AppError("Occupation is required for other employment", 400);
      }
    }
  },

  validateParentRelations(parents) {
    const relations = parents.map((parent) => parent.relation);
    const uniqueRelations = new Set(relations);

    if (uniqueRelations.size !== relations.length) {
      throw new AppError(
        "Each co-applicant relation (Father, Mother, Guardian, Other) can only be added once",
        400,
      );
    }

    const coApplicantRelations = ["FATHER", "MOTHER", "GUARDIAN", "OTHER"];

    if (!relations.some((relation) => coApplicantRelations.includes(relation))) {
      throw new AppError("At least one parent or guardian is required", 400);
    }
  },

  isStudentLoan(application) {
    return application?.loanType?.code === STUDENT_LOAN_CODE;
  },

  isSchoolLoan(application) {
    return application?.loanType?.code === SCHOOL_STUDENT_LOAN_CODE;
  },

  totalStepsFor(application) {
    return this.isSchoolLoan(application)
      ? SCHOOL_LOAN_TOTAL_STEPS
      : STUDENT_LOAN_TOTAL_STEPS;
  },

  isStep1Complete(application) {
    return Boolean(application.loanAmount && application.tenureMonths);
  },

  isStudentLoanDetailsComplete(studentLoan) {
    if (!studentLoan) {
      return false;
    }

    return Boolean(
      studentLoan.studentName &&
        studentLoan.dateOfBirth &&
        studentLoan.gender &&
        studentLoan.mobile &&
        studentLoan.email &&
        studentLoan.courseName &&
        studentLoan.collegeName &&
        studentLoan.universityName &&
        studentLoan.studyCountry &&
        studentLoan.courseDurationMonths &&
        studentLoan.admissionStatus &&
        studentLoan.estimatedCourseFee,
    );
  },

  isStep2Complete(application) {
    if (!this.isStudentLoan(application)) {
      return true;
    }

    return this.isStudentLoanDetailsComplete(application.studentLoan);
  },

  isStep3Complete(application) {
    if (!this.isStudentLoan(application)) {
      return true;
    }

    const parents = application.studentLoan?.parents || [];

    if (parents.length === 0) {
      return false;
    }

    try {
      this.validateParentRelations(parents);

      for (const parent of parents) {
        if (!parent.fullName || !parent.mobile) {
          return false;
        }

        this.validateParentEmployment(parent.employment);
      }
    } catch {
      return false;
    }

    return true;
  },

  isStep4Complete(application, requiredDocuments, uploadedDocuments) {
    const missingDocuments =
      loanRequiredDocumentService.findMissingMandatoryDocuments(
        requiredDocuments,
        uploadedDocuments,
      );

    return missingDocuments.length === 0;
  },

  isSchoolStudentDetailsComplete(application) {
    return Boolean(application.schoolLoan);
  },

  isSchoolCoApplicantsComplete(application) {
    const coApplicants = application.schoolLoan?.coApplicants || [];

    if (coApplicants.length === 0) {
      return false;
    }

    try {
      this.validateParentRelations(coApplicants);

      for (const person of coApplicants) {
        if (
          !person.fullName ||
          !person.mobile ||
          !person.gender ||
          !person.dateOfBirth ||
          !person.currentAddressId ||
          (!person.sameAsCurrentAddress && !person.permanentAddressId)
        ) {
          return false;
        }
      }
    } catch {
      return false;
    }

    return true;
  },

  isSchoolEmploymentComplete(application) {
    const coApplicants = application.schoolLoan?.coApplicants || [];

    if (coApplicants.length === 0) {
      return false;
    }

    try {
      for (const person of coApplicants) {
        this.validateParentEmployment(person.employment);
      }
    } catch {
      return false;
    }

    return true;
  },

  isSchoolExistingLoansComplete(application) {
    if (!application.schoolLoan?.hasExistingLoans) {
      return true;
    }

    return (application.existingLoans || []).length > 0;
  },

  isSchoolLoanRequirementComplete(application) {
    return this.isStep1Complete(application);
  },

  isSchoolDocumentsComplete(application, requiredDocuments, uploadedDocuments) {
    return this.isStep4Complete(
      application,
      requiredDocuments,
      uploadedDocuments,
    );
  },

  getCompletenessState(application, requiredDocuments, uploadedDocuments) {
    if (this.isSchoolLoan(application)) {
      return {
        step1: this.isSchoolStudentDetailsComplete(application),
        step2: this.isSchoolCoApplicantsComplete(application),
        step3: this.isSchoolEmploymentComplete(application),
        step4: this.isSchoolExistingLoansComplete(application),
        step5: this.isSchoolLoanRequirementComplete(application),
        step6: this.isSchoolDocumentsComplete(
          application,
          requiredDocuments,
          uploadedDocuments,
        ),
      };
    }

    return {
      step1: this.isStep1Complete(application),
      step2: this.isStep2Complete(application),
      step3: this.isStep3Complete(application),
      step4: this.isStep4Complete(
        application,
        requiredDocuments,
        uploadedDocuments,
      ),
    };
  },

  getMaxAllowedStep(application, requiredDocuments, uploadedDocuments) {
    const state = this.getCompletenessState(
      application,
      requiredDocuments,
      uploadedDocuments,
    );

    if (this.isSchoolLoan(application)) {
      if (!state.step1) return 1;
      if (!state.step2) return 2;
      if (!state.step3) return 3;
      if (!state.step4) return 4;
      if (!state.step5) return 5;
      if (!state.step6) return 6;
      return 7;
    }

    if (!state.step1) {
      return 1;
    }

    if (!state.step2) {
      return 2;
    }

    if (!state.step3) {
      return 3;
    }

    if (!state.step4) {
      return 4;
    }

    return 5;
  },

  assertAllowedCurrentStep(
    application,
    requestedStep,
    requiredDocuments,
    uploadedDocuments,
  ) {
    const ceiling = this.totalStepsFor(application);
    const normalizedStep = Math.min(Math.max(Number(requestedStep), 1), ceiling);
    const maxAllowedStep = this.getMaxAllowedStep(
      application,
      requiredDocuments,
      uploadedDocuments,
    );

    if (normalizedStep > maxAllowedStep) {
      throw new AppError(
        `Step ${normalizedStep} is not available until previous application steps are completed`,
        400,
      );
    }

    return normalizedStep;
  },

  resolveEligibilitySubject(application) {
    if (this.isSchoolLoan(application)) {
      const schoolLoan = application.schoolLoan;

      if (!schoolLoan) {
        throw new AppError(
          "School details are required before submission",
          400,
        );
      }

      const coApplicants = schoolLoan.coApplicants || [];
      const primaryCoApplicant =
        coApplicants.find((person) => person.isCoApplicant) ||
        coApplicants.find((person) => person.employment) ||
        null;

      if (!primaryCoApplicant?.employment) {
        throw new AppError(
          "Co-applicant employment details are required for eligibility checks",
          400,
        );
      }

      if (!primaryCoApplicant.dateOfBirth) {
        throw new AppError(
          "Co-applicant date of birth is required for eligibility checks",
          400,
        );
      }

      const employment = primaryCoApplicant.employment;
      let monthlyIncome = 0;

      if (
        employment.monthlyIncome !== null &&
        employment.monthlyIncome !== undefined
      ) {
        monthlyIncome = Number(employment.monthlyIncome);
      } else if (
        employment.annualIncome !== null &&
        employment.annualIncome !== undefined
      ) {
        monthlyIncome = Number(employment.annualIncome) / 12;
      } else if (
        employment.agriculturalIncome !== null &&
        employment.agriculturalIncome !== undefined
      ) {
        monthlyIncome = Number(employment.agriculturalIncome) / 12;
      } else if (
        employment.currentYearEstimatedIncome !== null &&
        employment.currentYearEstimatedIncome !== undefined
      ) {
        monthlyIncome = Number(employment.currentYearEstimatedIncome) / 12;
      }

      return {
        profile: {
          dateOfBirth: primaryCoApplicant.dateOfBirth,
        },
        employment: {
          monthlyIncome,
          experienceYears: employment.experienceYears ?? null,
        },
      };
    }

    if (this.isStudentLoan(application)) {
      const studentLoan = application.studentLoan;

      if (!studentLoan) {
        throw new AppError(
          "Student loan details are required before submission",
          400,
        );
      }

      const parents = studentLoan.parents || [];
      const coApplicant = parents.find((parent) => parent.isCoApplicant);
      const incomeParent =
        coApplicant || parents.find((parent) => parent.employment) || null;

      if (!incomeParent?.employment) {
        throw new AppError(
          "Parent employment details are required for eligibility checks",
          400,
        );
      }

      const employment = incomeParent.employment;
      let monthlyIncome = 0;

      if (
        employment.monthlyIncome !== null &&
        employment.monthlyIncome !== undefined
      ) {
        monthlyIncome = Number(employment.monthlyIncome);
      } else if (
        employment.annualIncome !== null &&
        employment.annualIncome !== undefined
      ) {
        monthlyIncome = Number(employment.annualIncome) / 12;
      } else if (
        employment.agriculturalIncome !== null &&
        employment.agriculturalIncome !== undefined
      ) {
        monthlyIncome = Number(employment.agriculturalIncome) / 12;
      }

      return {
        profile: {
          dateOfBirth: studentLoan.dateOfBirth,
        },
        employment: {
          monthlyIncome,
          experienceYears: employment.experienceYears ?? null,
        },
      };
    }

    if (application.personalLoan?.employment) {
      const employment = application.personalLoan.employment;

      return {
        profile: application.user?.customerProfile || null,
        employment: {
          monthlyIncome:
            employment.monthlyIncome !== null &&
            employment.monthlyIncome !== undefined
              ? Number(employment.monthlyIncome)
              : employment.annualIncome !== null &&
                  employment.annualIncome !== undefined
                ? Number(employment.annualIncome) / 12
                : 0,
          experienceYears: employment.experienceYears ?? null,
        },
      };
    }

    return {
      profile: application.user?.customerProfile || null,
      employment: null,
    };
  },

  validateApplicationEligibility(application, eligibilityRule) {
    if (!eligibilityRule) {
      return;
    }

    const subject = this.resolveEligibilitySubject(application);

    this.validateEligibility(
      subject.profile,
      subject.employment,
      eligibilityRule,
    );
  },

  validateStudentLoanCompleteness(application) {
    if (!this.isStudentLoan(application)) {
      return;
    }

    if (!application.studentLoan) {
      throw new AppError(
        "Student loan details are required before submission",
        400,
      );
    }

    if (!this.isStudentLoanDetailsComplete(application.studentLoan)) {
      throw new AppError(
        "Complete all student loan student details before submission",
        400,
      );
    }

    const parents = application.studentLoan.parents || [];

    this.validateParentRelations(parents);

    for (const parent of parents) {
      if (!parent.fullName || !parent.mobile) {
        throw new AppError(
          "Each parent must include full name and mobile number",
          400,
        );
      }

      this.validateParentEmployment(parent.employment);
    }
  },

  validateSchoolLoanCompleteness(application) {
    if (!this.isSchoolLoan(application)) {
      return;
    }

    if (!application.schoolLoan) {
      throw new AppError(
        "Student and school details are required before submission",
        400,
      );
    }

    const coApplicants = application.schoolLoan.coApplicants || [];

    this.validateParentRelations(coApplicants);

    for (const person of coApplicants) {
      if (!person.fullName || !person.mobile) {
        throw new AppError(
          "Each co-applicant must include full name and mobile number",
          400,
        );
      }

      if (!person.dateOfBirth) {
        throw new AppError(
          "Each co-applicant's date of birth is required",
          400,
        );
      }

      this.validateParentEmployment(person.employment);
    }

    if (
      application.schoolLoan.hasExistingLoans &&
      (application.existingLoans || []).length === 0
    ) {
      throw new AppError(
        "At least one existing loan is required when existing loans are declared",
        400,
      );
    }

    const consentFields = [
      "infoAccuracyConsent",
      "infoVerificationConsent",
      "documentVerificationConsent",
      "termsAccepted",
      "privacyPolicyAccepted",
    ];

    const missingConsent = consentFields.some(
      (field) => application[field] !== true,
    );

    if (missingConsent) {
      throw new AppError(
        "All declarations and consents must be accepted before submission",
        400,
      );
    }
  },

  validateApplicationReadyForSubmit(
    application,
    configuration,
    eligibilityRule,
    requiredDocuments,
    uploadedDocuments,
  ) {
    if (this.isSchoolLoan(application)) {
      if (!this.isSchoolLoanRequirementComplete(application)) {
        throw new AppError(
          "Loan amount and tenure are required before submission",
          400,
        );
      }

      this.validateLoanAmount(configuration, Number(application.loanAmount));
      this.validateTenure(configuration, application.tenureMonths);

      this.validateSchoolLoanCompleteness(application);
      this.validateApplicationEligibility(application, eligibilityRule);

      const state = this.getCompletenessState(
        application,
        requiredDocuments,
        uploadedDocuments,
      );

      if (!state.step6) {
        throw new AppError(
          "Upload all required documents before submission",
          400,
        );
      }

      this.validateDocuments(requiredDocuments, uploadedDocuments);
      return;
    }

    if (!this.isStep1Complete(application)) {
      throw new AppError("Loan amount and tenure are required before submission", 400);
    }

    this.validateLoanAmount(configuration, Number(application.loanAmount));
    this.validateTenure(configuration, application.tenureMonths);

    this.validateStudentLoanCompleteness(application);
    this.validateApplicationEligibility(application, eligibilityRule);

    const state = this.getCompletenessState(
      application,
      requiredDocuments,
      uploadedDocuments,
    );

    if (!state.step4) {
      throw new AppError(
        "Upload all required documents before submission",
        400,
      );
    }

    this.validateDocuments(requiredDocuments, uploadedDocuments);
  },

  canCustomerUploadDocument(application, existingDocuments) {
    if (application.status === "DRAFT") {
      return true;
    }

    if (!DOCUMENT_CORRECTION_STATUSES.has(application.status)) {
      return false;
    }

    const activeDocument = existingDocuments.find(
      (document) => document.status !== "REJECTED",
    );

    if (activeDocument) {
      return false;
    }

    return existingDocuments.some(
      (document) => document.status === "REJECTED",
    );
  },

  canCustomerDeleteDocument(application, document) {
    if (document.status === "VERIFIED") {
      return false;
    }

    if (application.status === "DRAFT") {
      return true;
    }

    return (
      DOCUMENT_CORRECTION_STATUSES.has(application.status) &&
      document.status === "REJECTED"
    );
  },

  validateDocuments(requiredDocuments, uploadedDocuments) {
    const uploadedKeys = new Set(
      uploadedDocuments
        .filter((doc) => doc.status !== "REJECTED")
        .map((doc) => `${doc.ownerType}:${doc.documentType}`),
    );

    const missingDocuments = requiredDocuments
      .filter((doc) => doc.isMandatory)
      .filter(
        (doc) => !uploadedKeys.has(`${doc.ownerType}:${doc.documentType}`),
      )
      .map((doc) => `${doc.ownerType}:${doc.documentType}`);

    if (missingDocuments.length > 0) {
      throw new AppError(
        `Missing required documents: ${missingDocuments.join(", ")}`,
        400,
      );
    }
  },

  calculateProcessingFee(configuration, amount) {
    if (configuration.processingFeeType === "FIXED") {
      return Number(configuration.processingFee);
    }

    return (Number(amount) * Number(configuration.processingFee)) / 100;
  },
};
