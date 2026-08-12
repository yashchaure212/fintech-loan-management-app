import prisma from "../config/prisma.js";

export const adminLoanRepository = {
  getAllApplications() {
    return prisma.loanApplication.findMany({
      include: {
        loanType: true,

        user: {
          select: {
            id: true,
            email: true,
            phone: true,

            customerProfile: true,
          },
        },

        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });
  },

  getApplicationById(id) {
    return prisma.loanApplication.findUnique({
      where: {
        id,
      },

      include: {
        loanType: true,

        user: {
          select: {
            id: true,
            email: true,
            phone: true,

            customerProfile: true,
          },
        },

        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },

        emiSchedules: true,

        // --------------------------------
        // Education Loan
        // --------------------------------

        educationLoan: {
          include: {
            parents: {
              include: {
                employment: true,
              },
            },
          },
        },

        // --------------------------------
        // Loan Documents
        // --------------------------------

        documents: true,

        // --------------------------------
        // Personal Loan
        // --------------------------------

        personalLoan: {
          include: {
            employment: true,
          },
        },
      },
    });
  },

  getDashboard() {
    return prisma.loanApplication.groupBy({
      by: ["status"],

      _count: {
        status: true,
      },
    });
  },
};
