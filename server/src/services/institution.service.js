import { institutionRepository } from "../repositories/institution.repository.js";
import AppError from "../utils/AppError.js";

export const institutionService = {
  async search(query, city) {
    return institutionRepository.search(query, city);
  },

  async list(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    return institutionRepository.findAll({ skip, take: pageSize });
  },

  async create(data) {
    return institutionRepository.create(data);
  },

  async update(id, data) {
    const institution = await institutionRepository.findById(id);

    if (!institution) {
      throw new AppError("Institution not found", 404);
    }

    return institutionRepository.update(id, data);
  },
};
