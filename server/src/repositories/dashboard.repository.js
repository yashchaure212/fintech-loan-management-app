import prisma from "../config/prisma.js";

export const dashboardRepository = {
  // ==========================
  // CUSTOMER DASHBOARD
  // ==========================

  getCustomer(userId) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
        customerProfile: true,
        addresses: true,
        employment: true,
        kycDocuments: true,
      },
    });
  },

  countActiveLoans(userId) {
    return prisma.loanApplication.count({
      where: {
        userId,
        status: "DISBURSED",
      },
    });
  },

  countPendingApplications(userId) {
    return prisma.loanApplication.count({
      where: {
        userId,
        status: {
          in: ["SUBMITTED", "UNDER_REVIEW"],
        },
      },
    });
  },

  sumBorrowedAmount(userId) {
    return prisma.loanApplication.aggregate({
      where: {
        userId,
      },
      _sum: {
        loanAmount: true,
      },
    });
  },

  sumOutstandingAmount(userId) {
    return prisma.emiSchedule.aggregate({
      where: {
        status: "PENDING",
        loanApplication: {
          userId,
        },
      },
      _sum: {
        emiAmount: true,
        paidAmount: true,
      },
    });
  },

  findNextEmi(userId) {
    return prisma.emiSchedule.findFirst({
      where: {
        status: "PENDING",
        loanApplication: {
          userId,
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    });
  },

  countPendingKyc(userId) {
    return prisma.kycDocument.count({
      where: {
        userId,
        status: "PENDING",
      },
    });
  },

  recentApplications(userId) {
    return prisma.loanApplication.findMany({
      where: {
        userId,
      },
      include: {
        loanType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });
  },

  // ==========================
  // ADMIN DASHBOARD
  // ==========================

  countCustomers() {
    return prisma.user.count({
      where: {
        role: {
          name: "CUSTOMER",
        },
        isDeleted: false,
      },
    });
  },

  countActiveCustomers() {
    return prisma.user.count({
      where: {
        role: {
          name: "CUSTOMER",
        },
        isActive: true,
        isDeleted: false,
      },
    });
  },

  countLoans() {
    return prisma.loanApplication.count();
  },

  countLoanByStatus(status) {
    return prisma.loanApplication.count({
      where: {
        status,
      },
    });
  },

  countPendingKycDocuments() {
    return prisma.kycDocument.count({
      where: {
        status: "PENDING",
      },
    });
  },

  sumLoanAmount() {
    return prisma.loanApplication.aggregate({
      _sum: {
        loanAmount: true,
      },
    });
  },

  sumDisbursedAmount() {
    return prisma.loanApplication.aggregate({
      where: {
        status: "DISBURSED",
      },
      _sum: {
        loanAmount: true,
      },
    });
  },
};
