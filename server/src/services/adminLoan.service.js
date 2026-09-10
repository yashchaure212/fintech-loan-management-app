import { adminLoanRepository } from "../repositories/adminLoan.repository.js";
import AppError from "../utils/AppError.js";

export const adminLoanService = {
  async getApplications({ page, limit, status, search }) {
    return adminLoanRepository.getAllApplications({
      page,
      limit,
      status,
      search,
    });
  },

  async getApplication(id) {
    const application = await adminLoanRepository.getApplicationById(id);

    if (!application) {
      throw new AppError("Application not found", 404);
    }

    return application;
  },

  async dashboard() {
    return adminLoanRepository.getDashboard();
  },
};
