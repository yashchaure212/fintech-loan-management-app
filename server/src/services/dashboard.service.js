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
      recentApplications,
    ] = await Promise.all([
      dashboardRepository.getCustomer(userId),

      dashboardRepository.countActiveLoans(userId),

      dashboardRepository.countPendingApplications(userId),

      dashboardRepository.sumBorrowedAmount(userId),

      dashboardRepository.sumOutstandingAmount(userId),

      dashboardRepository.findNextEmi(userId),

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

      totalOutstanding: Math.max(
        0,
        Number(outstandingAmount._sum.emiAmount || 0) -
          Number(outstandingAmount._sum.paidAmount || 0),
      ),

      nextEmi: nextEmi
        ? {
            dueDate: nextEmi.dueDate,
            amount: Math.max(
              0,
              Number(nextEmi.emiAmount) - Number(nextEmi.paidAmount || 0),
            ),
          }
        : null,

      recentApplications,
    };
  },

  calculateProfileCompletion(user) {
    const sections = [
      !!user.customerProfile,
      user.addresses?.length > 0,
    ];

    const completed = sections.filter(Boolean).length;

    return Math.round((completed / sections.length) * 100);
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

      totalLoanAmount: Number(totalLoanAmount._sum.loanAmount || 0),

      totalDisbursed: Number(totalDisbursed._sum.loanAmount || 0),
    };
  },
};
