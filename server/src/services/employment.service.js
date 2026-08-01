import { employmentRepository } from "../repositories/employment.repository.js";
import AppError from "../utils/AppError.js";

export const employmentService = {
  async create(userId, data) {
    const existing = await employmentRepository.findByUserId(userId);

    if (existing) {
      throw new AppError("Employment details already exists", 409);
    }

    return employmentRepository.createEmployment({
      userId,

      ...data,
    });
  },

  async get(userId) {
    const employment = await employmentRepository.findByUserId(userId);

    if (!employment) {
      throw new AppError("Employment details not found", 404);
    }

    return employment;
  },

  async update(userId, data) {
    return employmentRepository.updateEmployment(userId, data);
  },
};
