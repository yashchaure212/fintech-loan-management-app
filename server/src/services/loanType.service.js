import { loanTypeRepository } from "../repositories/loanType.repository.js";
import AppError from "../utils/AppError.js";

export const loanTypeService = {
  async create(data) {
    // Check duplicate code
    const existingCode = await loanTypeRepository.findByCode(data.code);

    if (existingCode) {
      throw new AppError("Loan code already exists", 409);
    }

    return loanTypeRepository.create(data);
  },

  async getAll() {
    return loanTypeRepository.findAll();
  },

  // Customer-facing: active loan products only
  async getActive() {
    return loanTypeRepository.findAllActive();
  },

  async getById(id) {
    const loanType = await loanTypeRepository.findById(id);

    if (!loanType || loanType.isDeleted) {
      throw new AppError("Loan type not found", 404);
    }

    return loanType;
  },

  async update(id, data) {
    const loanType = await loanTypeRepository.findById(id);

    if (!loanType || loanType.isDeleted) {
      throw new AppError("Loan type not found", 404);
    }

    // If code is changing, ensure uniqueness
    if (data.code && data.code !== loanType.code) {
      const existingCode = await loanTypeRepository.findByCode(data.code);

      if (existingCode) {
        throw new AppError("Loan code already exists", 409);
      }
    }

    return loanTypeRepository.update(id, data);
  },

  async updateStatus(id, isActive) {
    const loanType = await loanTypeRepository.findById(id);

    if (!loanType || loanType.isDeleted) {
      throw new AppError("Loan type not found", 404);
    }

    return loanTypeRepository.update(id, {
      isActive,
    });
  },

  async delete(id) {
    const loanType = await loanTypeRepository.findById(id);

    if (!loanType || loanType.isDeleted) {
      throw new AppError("Loan type not found", 404);
    }

    return loanTypeRepository.softDelete(id);
  },

  async getPublic() {
    return loanTypeRepository.findAllActive();
  },

  async getPublicById(id) {
    const loanType = await loanTypeRepository.findActiveById(id);

    if (!loanType) {
      throw new AppError("Loan type not found", 404);
    }

    return loanType;
  },
};
