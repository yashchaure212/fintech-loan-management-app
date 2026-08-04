import { dashboardRepository } from "../repositories/dashboard.repository.js";
import AppError from "../utils/AppError.js";

export const dashboardService = {
  // ==========================
  // CUSTOMER DASHBOARD
  // ==========================

  async getCustomerDashboard(userId) {
    const [
      user,
      activeLoans,
      pendingApplications,
      borrowedAmount,
      outstandingAmount,
      nextEmi,
      pendingKycDocuments,
      recentApplications,
    ] = await Promise.all([
      dashboardRepository.getCustomer(userId),

      dashboardRepository.countActiveLoans(userId),

      dashboardRepository.countPendingApplications(userId),

      dashboardRepository.sumBorrowedAmount(userId),

      dashboardRepository.sumOutstandingAmount(userId),

      dashboardRepository.findNextEmi(userId),

      dashboardRepository.countPendingKyc(userId),

      dashboardRepository.recentApplications(userId),
    ]);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      profileCompletion: this.calculateProfileCompletion(user),

      activeLoans,

      pendingApplications,

      totalBorrowed: Number(borrowedAmount._sum.loanAmount || 0),

      totalOutstanding:
        Number(outstandingAmount._sum.emiAmount || 0) -
        Number(outstandingAmount._sum.paidAmount || 0),

      nextEmi: nextEmi
        ? {
            dueDate: nextEmi.dueDate,
            amount: Number(nextEmi.emiAmount),
          }
        : null,

      pendingKycDocuments,

      recentApplications,
    };
  },

  calculateProfileCompletion(user) {
    let completed = 0;

    const totalSections = 4;

    // Customer Profile
    if (user.customerProfile) {
      completed++;
    }

    // Address
    if (user.addresses?.length > 0) {
      completed++;
    }

    // Employment
    if (user.employment) {
      completed++;
    }

    // KYC
    if (user.kycDocuments?.length > 0) {
      completed++;
    }

    return Math.round((completed / totalSections) * 100);
  },

  // ==========================
  // ADMIN DASHBOARD
  // ==========================

  async getAdminDashboard() {
    const [
      totalCustomers,
      activeCustomers,
      loanApplications,
      submittedLoans,
      underReviewLoans,
      approvedLoans,
      rejectedLoans,
      disbursedLoans,
      closedLoans,
      pendingKyc,
      totalLoanAmount,
      totalDisbursed,
    ] = await Promise.all([
      dashboardRepository.countCustomers(),

      dashboardRepository.countActiveCustomers(),

      dashboardRepository.countLoans(),

      dashboardRepository.countLoanByStatus("SUBMITTED"),

      dashboardRepository.countLoanByStatus("UNDER_REVIEW"),

      dashboardRepository.countLoanByStatus("APPROVED"),

      dashboardRepository.countLoanByStatus("REJECTED"),

      dashboardRepository.countLoanByStatus("DISBURSED"),

      dashboardRepository.countLoanByStatus("CLOSED"),

      dashboardRepository.countPendingKycDocuments(),

      dashboardRepository.sumLoanAmount(),

      dashboardRepository.sumDisbursedAmount(),
    ]);

    return {
      totalCustomers,

      activeCustomers,

      loanApplications,

      submittedLoans,

      underReviewLoans,

      approvedLoans,

      rejectedLoans,

      disbursedLoans,

      closedLoans,

      pendingKyc,

      totalLoanAmount: Number(totalLoanAmount._sum.loanAmount || 0),

      totalDisbursed: Number(totalDisbursed._sum.loanAmount || 0),
    };
  },
};
