import { educationLoanRepository } from "../repositories/educationLoan.repository.js";
import { loanValidationService } from "./loanValidation.service.js";
import AppError from "../utils/AppError.js";

function normalizeOptional(value) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return value;
}

function buildEmploymentData(employment) {
  if (!employment) {
    return null;
  }

  return {
    employmentType: employment.employmentType,

    companyName: normalizeOptional(employment.companyName),

    designation: normalizeOptional(employment.designation),

    monthlyIncome: normalizeOptional(employment.monthlyIncome),

    experienceYears: normalizeOptional(employment.experienceYears),

    businessName: normalizeOptional(employment.businessName),

    businessType: normalizeOptional(employment.businessType),

    annualTurnover: normalizeOptional(employment.annualTurnover),

    annualIncome: normalizeOptional(employment.annualIncome),

    landHoldingAcres: normalizeOptional(employment.landHoldingAcres),

    cropType: normalizeOptional(employment.cropType),

    agriculturalIncome: normalizeOptional(employment.agriculturalIncome),

    employerName: normalizeOptional(employment.employerName),

    contractDurationMonths: normalizeOptional(
      employment.contractDurationMonths,
    ),

    occupation: normalizeOptional(employment.occupation),
  };
}

function buildParentData(parent) {
  return {
    relation: parent.relation,
    fullName: parent.fullName,
    mobile: parent.mobile,
    aadhaarNumber: normalizeOptional(parent.aadhaarNumber),
    panNumber: normalizeOptional(parent.panNumber),

    // Bank Details
    bankAccountNumber: normalizeOptional(parent.bankAccountNumber),
    ifscCode: normalizeOptional(parent.ifscCode),

    isCoApplicant: parent.isCoApplicant ?? false,
  };
}

function ensureDraft(application) {
  if (application.status !== "DRAFT") {
    throw new AppError(
      "Education loan details can only be modified while the application is in draft",
      400,
    );
  }
}

function ensureEducationLoan(application) {
  if (!loanValidationService.isEducationLoan(application)) {
    throw new AppError(
      "This application is not an education loan application",
      400,
    );
  }
}

export const educationLoanService = {
  async getByApplicationId(userId, loanApplicationId) {
    const application =
      await educationLoanRepository.findLoanApplicationById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    ensureEducationLoan(application);

    return application.educationLoan;
  },

  async create(userId, loanApplicationId, data) {
    const application =
      await educationLoanRepository.findLoanApplicationById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    ensureEducationLoan(application);
    ensureDraft(application);

    if (application.educationLoan) {
      throw new AppError(
        "Education loan details already exist for this application",
        409,
      );
    }

    if (data.parents?.length) {
      loanValidationService.validateParentRelations(data.parents);

      for (const parent of data.parents) {
        loanValidationService.validateParentEmployment(parent.employment);
      }
    }

    return educationLoanRepository.transaction(async (tx) => {
      const educationLoan = await tx.educationLoanApplication.create({
        data: {
          loanApplicationId,

          studentName: data.studentName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          mobile: data.mobile,
          email: data.email,

          aadhaarNumber: normalizeOptional(data.aadhaarNumber),

          panNumber: normalizeOptional(data.panNumber),

          courseName: data.courseName,
          collegeName: data.collegeName,
          universityName: data.universityName,
          studyCountry: data.studyCountry,
          courseDurationMonths: data.courseDurationMonths,
          admissionStatus: data.admissionStatus,
          estimatedCourseFee: data.estimatedCourseFee,

          ...(data.parents?.length
            ? {
                parents: {
                  create: data.parents.map((parent) => ({
                    ...buildParentData(parent),

                    ...(parent.employment
                      ? {
                          employment: {
                            create: buildEmploymentData(parent.employment),
                          },
                        }
                      : {}),
                  })),
                },
              }
            : {}),
        },

        include: {
          parents: {
            include: {
              employment: true,
            },
          },
        },
      });

      await tx.loanApplication.update({
        where: {
          id: loanApplicationId,
        },
        data: {
          currentStep: 3,
        },
      });

      return educationLoan;
    });
  },

  async update(userId, loanApplicationId, data) {
    const application =
      await educationLoanRepository.findLoanApplicationById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    ensureEducationLoan(application);
    ensureDraft(application);

    if (!application.educationLoan) {
      throw new AppError(
        "Education loan details have not been created yet",
        404,
      );
    }

    if (data.parents) {
      loanValidationService.validateParentRelations(data.parents);

      for (const parent of data.parents) {
        loanValidationService.validateParentEmployment(parent.employment);
      }
    }

    return educationLoanRepository.transaction(async (tx) => {
      const educationLoan = await tx.educationLoanApplication.update({
        where: {
          id: application.educationLoan.id,
        },

        data: {
          ...(data.studentName !== undefined
            ? {
                studentName: data.studentName,
              }
            : {}),

          ...(data.dateOfBirth !== undefined
            ? {
                dateOfBirth: data.dateOfBirth,
              }
            : {}),

          ...(data.gender !== undefined
            ? {
                gender: data.gender,
              }
            : {}),

          ...(data.mobile !== undefined
            ? {
                mobile: data.mobile,
              }
            : {}),

          ...(data.email !== undefined
            ? {
                email: data.email,
              }
            : {}),

          ...(data.aadhaarNumber !== undefined
            ? {
                aadhaarNumber: data.aadhaarNumber,
              }
            : {}),

          ...(data.panNumber !== undefined
            ? {
                panNumber: data.panNumber,
              }
            : {}),

          ...(data.courseName !== undefined
            ? {
                courseName: data.courseName,
              }
            : {}),

          ...(data.collegeName !== undefined
            ? {
                collegeName: data.collegeName,
              }
            : {}),

          ...(data.universityName !== undefined
            ? {
                universityName: data.universityName,
              }
            : {}),

          ...(data.studyCountry !== undefined
            ? {
                studyCountry: data.studyCountry,
              }
            : {}),

          ...(data.courseDurationMonths !== undefined
            ? {
                courseDurationMonths: data.courseDurationMonths,
              }
            : {}),

          ...(data.admissionStatus !== undefined
            ? {
                admissionStatus: data.admissionStatus,
              }
            : {}),

          ...(data.estimatedCourseFee !== undefined
            ? {
                estimatedCourseFee: data.estimatedCourseFee,
              }
            : {}),
        },

        include: {
          parents: {
            include: {
              employment: true,
            },
          },
        },
      });

      if (data.parents) {
        const existingParents = await tx.parentDetails.findMany({
          where: {
            educationLoanApplicationId: application.educationLoan.id,
          },
        });

        const incomingRelations = new Set(
          data.parents.map((parent) => parent.relation),
        );

        for (const parent of existingParents) {
          if (!incomingRelations.has(parent.relation)) {
            await tx.parentDetails.delete({
              where: {
                id: parent.id,
              },
            });
          }
        }

        for (const parent of data.parents) {
          const existing = await tx.parentDetails.findFirst({
            where: {
              educationLoanApplicationId: application.educationLoan.id,

              relation: parent.relation,
            },
          });

          if (!existing) {
            await tx.parentDetails.create({
              data: {
                educationLoanApplicationId: application.educationLoan.id,

                ...buildParentData(parent),

                ...(parent.employment
                  ? {
                      employment: {
                        create: buildEmploymentData(parent.employment),
                      },
                    }
                  : {}),
              },
            });

            continue;
          }

          await tx.parentDetails.update({
            where: {
              id: existing.id,
            },

            data: {
              ...buildParentData(parent),
            },
          });

          if (parent.employment) {
            const employment = await tx.parentEmployment.findUnique({
              where: {
                parentId: existing.id,
              },
            });

            if (employment) {
              await tx.parentEmployment.update({
                where: {
                  id: employment.id,
                },
                data: buildEmploymentData(parent.employment),
              });
            } else {
              await tx.parentEmployment.create({
                data: {
                  parentId: existing.id,
                  ...buildEmploymentData(parent.employment),
                },
              });
            }
          }
        }

        await tx.loanApplication.update({
          where: {
            id: loanApplicationId,
          },
          data: {
            currentStep: Math.max(application.currentStep || 1, 4),
          },
        });
      } else if ((application.currentStep || 1) < 3) {
        await tx.loanApplication.update({
          where: {
            id: loanApplicationId,
          },
          data: {
            currentStep: 3,
          },
        });
      }

      return tx.educationLoanApplication.findUnique({
        where: {
          id: application.educationLoan.id,
        },
        include: {
          parents: {
            include: {
              employment: true,
            },
          },
        },
      });
    });
  },

  async updateParent(userId, parentId, data) {
    const parent = await educationLoanRepository.findParentById(parentId);

    if (
      !parent ||
      parent.educationLoanApplication.loanApplication.userId !== userId
    ) {
      throw new AppError("Parent details not found", 404);
    }

    ensureDraft(parent.educationLoanApplication.loanApplication);

    loanValidationService.validateParentEmployment(data.employment);

    return educationLoanRepository.transaction(async (tx) => {
      await tx.parentDetails.update({
        where: {
          id: parentId,
        },
        data: {
          ...(data.fullName !== undefined
            ? {
                fullName: data.fullName,
              }
            : {}),

          ...(data.mobile !== undefined
            ? {
                mobile: data.mobile,
              }
            : {}),

          ...(data.aadhaarNumber !== undefined
            ? {
                aadhaarNumber: data.aadhaarNumber,
              }
            : {}),

          ...(data.panNumber !== undefined
            ? {
                panNumber: data.panNumber,
              }
            : {}),

          ...(data.isCoApplicant !== undefined
            ? {
                isCoApplicant: data.isCoApplicant,
              }
            : {}),
          ...(data.bankAccountNumber !== undefined
            ? {
                bankAccountNumber: data.bankAccountNumber,
              }
            : {}),

          ...(data.ifscCode !== undefined
            ? {
                ifscCode: data.ifscCode,
              }
            : {}),
        },
      });

      if (data.employment) {
        const existing = await tx.parentEmployment.findUnique({
          where: {
            parentId,
          },
        });

        if (existing) {
          await tx.parentEmployment.update({
            where: {
              id: existing.id,
            },
            data: buildEmploymentData(data.employment),
          });
        } else {
          await tx.parentEmployment.create({
            data: {
              parentId,
              ...buildEmploymentData(data.employment),
            },
          });
        }
      }

      return tx.parentDetails.findUnique({
        where: {
          id: parentId,
        },
        include: {
          employment: true,
        },
      });
    });
  },
};
