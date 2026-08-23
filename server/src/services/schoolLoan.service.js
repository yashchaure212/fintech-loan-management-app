import { schoolLoanRepository } from "../repositories/schoolLoan.repository.js";
import { loanValidationService } from "./loanValidation.service.js";
import AppError from "../utils/AppError.js";

function normalizeOptional(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return value;
}

function addressCreateData(address, userId, type) {
  if (!address) {
    return undefined;
  }

  const data = {
    userId,
    type,
    line1: address.line1,
    city: address.city,
    state: address.state,
    pincode: address.pincode,
  };

  const line2 = normalizeOptional(address.line2);
  const taluka = normalizeOptional(address.taluka);
  const district = normalizeOptional(address.district);

  if (line2) data.line2 = line2;
  if (taluka) data.taluka = taluka;
  if (district) data.district = district;

  return {
    create: data,
  };
}

function buildEmploymentScalarData(employment) {
  return {
    employmentType: employment.employmentType,

    // Salaried
    companyName: normalizeOptional(employment.companyName),
    designation: normalizeOptional(employment.designation),
    monthlyIncome: normalizeOptional(employment.monthlyIncome),
    experienceYears: normalizeOptional(employment.experienceYears),
    industryType: normalizeOptional(employment.industryType),
    dateOfJoining: normalizeOptional(employment.dateOfJoining),
    salaryFrequency: normalizeOptional(employment.salaryFrequency),
    previousYearIncome: normalizeOptional(employment.previousYearIncome),
    salaryAccountBank: normalizeOptional(employment.salaryAccountBank),

    // Business
    businessName: normalizeOptional(employment.businessName),
    businessType: normalizeOptional(employment.businessType),
    annualTurnover: normalizeOptional(employment.annualTurnover),
    annualIncome: normalizeOptional(employment.annualIncome),
    businessCategory: normalizeOptional(employment.businessCategory),
    businessStartDate: normalizeOptional(employment.businessStartDate),
    numberOfEmployees: normalizeOptional(employment.numberOfEmployees),
    numberOfBranches: normalizeOptional(employment.numberOfBranches),
    yearsAtBusinessLocation: normalizeOptional(
      employment.yearsAtBusinessLocation,
    ),
    currentYearEstimatedIncome: normalizeOptional(
      employment.currentYearEstimatedIncome,
    ),

    // Farmer
    landHoldingAcres: normalizeOptional(employment.landHoldingAcres),
    cropType: normalizeOptional(employment.cropType),
    agriculturalIncome: normalizeOptional(employment.agriculturalIncome),
    landArea: normalizeOptional(employment.landArea),
    landUnit: normalizeOptional(employment.landUnit),
    landOwnership: normalizeOptional(employment.landOwnership),
    cultivatedArea: normalizeOptional(employment.cultivatedArea),
    otherCropTypes: normalizeOptional(employment.otherCropTypes),
    irrigationType: normalizeOptional(employment.irrigationType),
    landLocationVillage: normalizeOptional(employment.landLocationVillage),

    // Contract
    employerName: normalizeOptional(employment.employerName),
    contractDurationMonths: normalizeOptional(
      employment.contractDurationMonths,
    ),

    // Other
    occupation: normalizeOptional(employment.occupation),
  };
}

function buildEmploymentNestedCreateData(employment, userId) {
  return {
    ...buildEmploymentScalarData(employment),

    ...(employment.employerAddress
      ? { employerAddress: addressCreateData(employment.employerAddress, userId, "OFFICE") }
      : {}),

    ...(employment.businessAddress
      ? { businessAddress: addressCreateData(employment.businessAddress, userId, "OFFICE") }
      : {}),

    ...(employment.landAddress
      ? { landAddress: addressCreateData(employment.landAddress, userId, "OFFICE") }
      : {}),

    ...(employment.registrations?.length
      ? {
          registrations: {
            create: employment.registrations.map((registration) => ({
              registrationType: registration.registrationType,
              registrationNumber: registration.registrationNumber,
              issueDate: registration.issueDate ?? null,
              expiryDate: registration.expiryDate ?? null,
            })),
          },
        }
      : {}),
  };
}

function buildCoApplicantScalarData(person) {
  return {
    relation: person.relation,
    fullName: person.fullName,
    mobile: person.mobile,
    aadhaarNumber: normalizeOptional(person.aadhaarNumber),
    panNumber: normalizeOptional(person.panNumber),
    isCoApplicant: person.isCoApplicant ?? false,
    bankAccountNumber: normalizeOptional(person.bankAccountNumber),
    ifscCode: normalizeOptional(person.ifscCode),

    gender: normalizeOptional(person.gender),
    dateOfBirth: normalizeOptional(person.dateOfBirth),
    maritalStatus: normalizeOptional(person.maritalStatus),
    numberOfDependents: normalizeOptional(person.numberOfDependents),
    numberOfEarningMembers: normalizeOptional(person.numberOfEarningMembers),
    familyMonthlyIncome: normalizeOptional(person.familyMonthlyIncome),
    sameAsCurrentAddress: person.sameAsCurrentAddress ?? false,
    yearsAtCurrentAddress: normalizeOptional(person.yearsAtCurrentAddress),
  };
}

function ensureDraft(application) {
  if (application.status !== "DRAFT") {
    throw new AppError(
      "School loan details can only be modified while the application is in draft",
      400,
    );
  }
}

function ensureSchoolLoan(application) {
  if (!loanValidationService.isSchoolLoan(application)) {
    throw new AppError(
      "This application is not a school student loan application",
      400,
    );
  }
}

const SCHOOL_LOAN_SCALAR_FIELDS = [
  "studentName",
  "dateOfBirth",
  "gender",
  "mobile",
  "email",
  "aadhaarNumber",
  "panNumber",
  "currentSchoolName",
  "institutionId",
  "schoolType",
  "currentClass",
  "academicYear",
  "continuingSameSchool",
  "previousSchoolName",
  "newSchoolName",
  "newInstitutionId",
  "expectedJoiningDate",
  "previousClass",
  "previousAcademicYear",
  "previousClassPercentage",
  "loanPurpose",
  "expectedDisbursementDate",
  "tuitionFees",
  "admissionFees",
  "examinationFees",
  "booksAmount",
  "uniformAmount",
  "equipmentAmount",
  "transportAmount",
  "hostelAmount",
  "otherExpensesAmount",
  "familyContribution",
  "scholarshipAmount",
  "otherFundingAmount",
  "hasExistingLoans",
];

function pickSchoolLoanUpdateData(data) {
  const result = {};

  for (const field of SCHOOL_LOAN_SCALAR_FIELDS) {
    if (data[field] !== undefined) {
      result[field] = data[field];
    }
  }

  return result;
}

export const schoolLoanService = {
  async getByApplicationId(userId, loanApplicationId) {
    const application =
      await schoolLoanRepository.findLoanApplicationById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    ensureSchoolLoan(application);

    return application.schoolLoan;
  },

  async create(userId, loanApplicationId, data) {
    const application =
      await schoolLoanRepository.findLoanApplicationById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    ensureSchoolLoan(application);
    ensureDraft(application);

    if (application.schoolLoan) {
      throw new AppError(
        "Student details already exist for this application",
        409,
      );
    }

    if (data.coApplicants?.length) {
      loanValidationService.validateParentRelations(data.coApplicants);

      for (const person of data.coApplicants) {
        if (person.employment) {
          loanValidationService.validateParentEmployment(person.employment);
        }
      }
    }

    return schoolLoanRepository.transaction(async (tx) => {
      const schoolLoan = await tx.schoolStudentLoanApplication.create({
        data: {
          loanApplicationId,
          ...pickSchoolLoanUpdateData(data),

          ...(data.coApplicants?.length
            ? {
                coApplicants: {
                  create: data.coApplicants.map((person) => ({
                    ...buildCoApplicantScalarData(person),

                    ...(person.currentAddress
                      ? {
                          currentAddress: addressCreateData(
                            person.currentAddress,
                            userId,
                            "CURRENT",
                          ),
                        }
                      : {}),

                    ...(person.permanentAddress && !person.sameAsCurrentAddress
                      ? {
                          permanentAddress: addressCreateData(
                            person.permanentAddress,
                            userId,
                            "PERMANENT",
                          ),
                        }
                      : {}),

                    ...(person.employment
                      ? {
                          employment: {
                            create: buildEmploymentNestedCreateData(
                              person.employment,
                              userId,
                            ),
                          },
                        }
                      : {}),
                  })),
                },
              }
            : {}),
        },

        include: {
          institution: true,
          coApplicants: {
            include: {
              currentAddress: true,
              permanentAddress: true,
              employment: {
                include: {
                  employerAddress: true,
                  businessAddress: true,
                  landAddress: true,
                  registrations: true,
                },
              },
            },
          },
        },
      });

      await tx.loanApplication.update({
        where: {
          id: loanApplicationId,
        },
        data: {
          currentStep: 2,
        },
      });

      return schoolLoan;
    });
  },

  async update(userId, loanApplicationId, data) {
    const application =
      await schoolLoanRepository.findLoanApplicationById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    ensureSchoolLoan(application);
    ensureDraft(application);

    if (!application.schoolLoan) {
      throw new AppError(
        "Student details have not been created yet",
        404,
      );
    }

    if (data.coApplicants) {
      loanValidationService.validateParentRelations(data.coApplicants);

      for (const person of data.coApplicants) {
        if (person.employment) {
          loanValidationService.validateParentEmployment(person.employment);
        }
      }
    }

    return schoolLoanRepository.transaction(async (tx) => {
      await tx.schoolStudentLoanApplication.update({
        where: {
          id: application.schoolLoan.id,
        },
        data: pickSchoolLoanUpdateData(data),
      });

      // Loan amount / tenure live on LoanApplication itself (Step 5 of the
      // school-loan wizard) -- same fields the (Step 1) education-loan
      // flow already writes via loanApplicationService.updateDraft().
      if (data.loanAmount !== undefined || data.tenureMonths !== undefined) {
        await tx.loanApplication.update({
          where: {
            id: loanApplicationId,
          },
          data: {
            ...(data.loanAmount !== undefined
              ? { loanAmount: data.loanAmount }
              : {}),
            ...(data.tenureMonths !== undefined
              ? { tenureMonths: data.tenureMonths }
              : {}),
          },
        });
      }

      if (data.coApplicants) {
        const existing = await tx.parentDetails.findMany({
          where: {
            schoolLoanApplicationId: application.schoolLoan.id,
          },
        });

        const incomingRelations = new Set(
          data.coApplicants.map((person) => person.relation),
        );

        for (const person of existing) {
          if (!incomingRelations.has(person.relation)) {
            await tx.parentDetails.delete({
              where: {
                id: person.id,
              },
            });
          }
        }

        for (const person of data.coApplicants) {
          const existingRow = await tx.parentDetails.findFirst({
            where: {
              schoolLoanApplicationId: application.schoolLoan.id,
              relation: person.relation,
            },
          });

          if (!existingRow) {
            await tx.parentDetails.create({
              data: {
                schoolLoanApplication: {
                  connect: { id: application.schoolLoan.id },
                },
                ...buildCoApplicantScalarData(person),

                ...(person.currentAddress
                  ? {
                      currentAddress: addressCreateData(
                        person.currentAddress,
                        userId,
                        "CURRENT",
                      ),
                    }
                  : {}),

                ...(person.permanentAddress && !person.sameAsCurrentAddress
                  ? {
                      permanentAddress: addressCreateData(
                        person.permanentAddress,
                        userId,
                        "PERMANENT",
                      ),
                    }
                  : {}),

                ...(person.employment
                  ? {
                      employment: {
                        create: buildEmploymentNestedCreateData(
                          person.employment,
                          userId,
                        ),
                      },
                    }
                  : {}),
              },
            });

            continue;
          }

          await tx.parentDetails.update({
            where: {
              id: existingRow.id,
            },
            data: buildCoApplicantScalarData(person),
          });

          if (person.currentAddress) {
            if (existingRow.currentAddressId) {
              await tx.address.update({
                where: { id: existingRow.currentAddressId },
                data: {
                  line1: person.currentAddress.line1,
                  line2: normalizeOptional(person.currentAddress.line2),
                  city: person.currentAddress.city,
                  taluka: normalizeOptional(person.currentAddress.taluka),
                  district: normalizeOptional(person.currentAddress.district),
                  state: person.currentAddress.state,
                  pincode: person.currentAddress.pincode,
                },
              });
            } else {
              const created = await tx.address.create({
                data: {
                  userId,
                  type: "CURRENT",
                  ...person.currentAddress,
                },
              });

              await tx.parentDetails.update({
                where: { id: existingRow.id },
                data: { currentAddressId: created.id },
              });
            }
          }

          if (person.permanentAddress && !person.sameAsCurrentAddress) {
            if (existingRow.permanentAddressId) {
              await tx.address.update({
                where: { id: existingRow.permanentAddressId },
                data: {
                  line1: person.permanentAddress.line1,
                  line2: normalizeOptional(person.permanentAddress.line2),
                  city: person.permanentAddress.city,
                  taluka: normalizeOptional(person.permanentAddress.taluka),
                  district: normalizeOptional(
                    person.permanentAddress.district,
                  ),
                  state: person.permanentAddress.state,
                  pincode: person.permanentAddress.pincode,
                },
              });
            } else {
              const created = await tx.address.create({
                data: {
                  userId,
                  type: "PERMANENT",
                  ...person.permanentAddress,
                },
              });

              await tx.parentDetails.update({
                where: { id: existingRow.id },
                data: { permanentAddressId: created.id },
              });
            }
          }

          if (person.employment) {
            const existingEmployment = await tx.parentEmployment.findUnique({
              where: {
                parentId: existingRow.id,
              },
            });

            if (existingEmployment) {
              await tx.parentEmployment.update({
                where: {
                  id: existingEmployment.id,
                },
                data: buildEmploymentScalarData(person.employment),
              });

              if (person.employment.registrations) {
                await tx.businessRegistration.deleteMany({
                  where: { parentEmploymentId: existingEmployment.id },
                });

                if (person.employment.registrations.length) {
                  await tx.businessRegistration.createMany({
                    data: person.employment.registrations.map((r) => ({
                      parentEmploymentId: existingEmployment.id,
                      registrationType: r.registrationType,
                      registrationNumber: r.registrationNumber,
                      issueDate: r.issueDate ?? null,
                      expiryDate: r.expiryDate ?? null,
                    })),
                  });
                }
              }
            } else {
              await tx.parentEmployment.create({
                data: {
                  parentId: existingRow.id,
                  ...buildEmploymentNestedCreateData(
                    person.employment,
                    userId,
                  ),
                },
              });
            }
          }
        }
      }

      return tx.schoolStudentLoanApplication.findUnique({
        where: {
          id: application.schoolLoan.id,
        },
        include: {
          institution: true,
          coApplicants: {
            include: {
              currentAddress: true,
              permanentAddress: true,
              employment: {
                include: {
                  employerAddress: true,
                  businessAddress: true,
                  landAddress: true,
                  registrations: true,
                },
              },
            },
          },
        },
      });
    });
  },

  async updateCoApplicant(userId, coApplicantId, data) {
    const person = await schoolLoanRepository.findCoApplicantById(
      coApplicantId,
    );

    if (
      !person?.schoolLoanApplication ||
      person.schoolLoanApplication.loanApplication.userId !== userId
    ) {
      throw new AppError("Co-applicant not found", 404);
    }

    ensureDraft(person.schoolLoanApplication.loanApplication);

    if (data.employment) {
      loanValidationService.validateParentEmployment(data.employment);
    }

    return schoolLoanRepository.transaction(async (tx) => {
      await tx.parentDetails.update({
        where: {
          id: coApplicantId,
        },
        data: buildCoApplicantScalarData({ ...person, ...data }),
      });

      if (data.employment) {
        const existingEmployment = await tx.parentEmployment.findUnique({
          where: {
            parentId: coApplicantId,
          },
        });

        if (existingEmployment) {
          await tx.parentEmployment.update({
            where: {
              id: existingEmployment.id,
            },
            data: buildEmploymentScalarData(data.employment),
          });

          if (data.employment.registrations) {
            await tx.businessRegistration.deleteMany({
              where: { parentEmploymentId: existingEmployment.id },
            });

            if (data.employment.registrations.length) {
              await tx.businessRegistration.createMany({
                data: data.employment.registrations.map((r) => ({
                  parentEmploymentId: existingEmployment.id,
                  registrationType: r.registrationType,
                  registrationNumber: r.registrationNumber,
                  issueDate: r.issueDate ?? null,
                  expiryDate: r.expiryDate ?? null,
                })),
              });
            }
          }
        } else {
          await tx.parentEmployment.create({
            data: {
              parentId: coApplicantId,
              ...buildEmploymentNestedCreateData(data.employment, userId),
            },
          });
        }
      }

      return tx.parentDetails.findUnique({
        where: {
          id: coApplicantId,
        },
        include: {
          currentAddress: true,
          permanentAddress: true,
          employment: {
            include: {
              employerAddress: true,
              businessAddress: true,
              landAddress: true,
              registrations: true,
            },
          },
        },
      });
    });
  },
};
