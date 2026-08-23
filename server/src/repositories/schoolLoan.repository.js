import prisma from "../config/prisma.js";

const coApplicantInclude = {
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
};

export const schoolLoanRepository = {
  findLoanApplicationById(loanApplicationId) {
    return prisma.loanApplication.findUnique({
      where: {
        id: loanApplicationId,
      },
      include: {
        loanType: true,
        schoolLoan: {
          include: {
            institution: true,
            coApplicants: {
              include: coApplicantInclude,
            },
          },
        },
        existingLoans: true,
      },
    });
  },

  createSchoolLoan(tx, data) {
    return tx.schoolStudentLoanApplication.create({
      data,
      include: {
        institution: true,
        coApplicants: {
          include: coApplicantInclude,
        },
      },
    });
  },

  updateSchoolLoan(tx, id, data) {
    return tx.schoolStudentLoanApplication.update({
      where: {
        id,
      },
      data,
      include: {
        institution: true,
        coApplicants: {
          include: coApplicantInclude,
        },
      },
    });
  },

  findSchoolLoanById(id) {
    return prisma.schoolStudentLoanApplication.findUnique({
      where: {
        id,
      },
      include: {
        institution: true,
        coApplicants: {
          include: coApplicantInclude,
        },
      },
    });
  },

  findCoApplicantById(coApplicantId) {
    return prisma.parentDetails.findUnique({
      where: {
        id: coApplicantId,
      },
      include: {
        ...coApplicantInclude,
        schoolLoanApplication: {
          include: {
            loanApplication: true,
          },
        },
      },
    });
  },

  // ------------------------------------------------------------
  // Generic parent/employment CRUD, shared with educationLoan.repository.js's
  // equivalents -- reused as-is here rather than duplicated, since these
  // operate on tx.parentDetails / tx.parentEmployment generically and take
  // no education-loan-specific arguments.
  // ------------------------------------------------------------

  createCoApplicant(tx, data) {
    return tx.parentDetails.create({
      data,
      include: coApplicantInclude,
    });
  },

  updateCoApplicant(tx, id, data) {
    return tx.parentDetails.update({
      where: {
        id,
      },
      data,
      include: coApplicantInclude,
    });
  },

  deleteCoApplicant(tx, id) {
    return tx.parentDetails.delete({
      where: {
        id,
      },
    });
  },

  createEmployment(tx, data) {
    return tx.parentEmployment.create({
      data,
      include: {
        employerAddress: true,
        businessAddress: true,
        landAddress: true,
        registrations: true,
      },
    });
  },

  updateEmployment(tx, id, data) {
    return tx.parentEmployment.update({
      where: {
        id,
      },
      data,
      include: {
        employerAddress: true,
        businessAddress: true,
        landAddress: true,
        registrations: true,
      },
    });
  },

  findEmploymentByParentId(parentId) {
    return prisma.parentEmployment.findUnique({
      where: {
        parentId,
      },
    });
  },

  createAddress(tx, address) {
    if (!address) {
      return null;
    }

    // These addresses belong to a co-applicant / employer / business /
    // land, not directly to the logged-in customer's own profile, so they
    // are created without a `type` and without the generic
    // /api/v1/addresses endpoint's user-scoping. `userId` is still
    // recorded (pointing at the applicant/customer who submitted this
    // application) purely for traceability; the Address model already
    // requires it.
    return tx.address.create({
      data: address,
    });
  },

  transaction(callback) {
    return prisma.$transaction(callback);
  },
};
