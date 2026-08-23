import { institutionService } from "../services/institution.service.js";
import { searchInstitutionSchema } from "../validations/institution.validation.js";
import AppError from "../utils/AppError.js";

export const institutionController = {
  async search(req, res, next) {
    try {
      const parsed = searchInstitutionSchema.safeParse(req.query);

      if (!parsed.success) {
        throw new AppError(
          parsed.error.issues[0]?.message || "Invalid search query",
          400,
        );
      }

      const result = await institutionService.search(
        parsed.data.q,
        parsed.data.city,
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.pageSize) || 20;

      const result = await institutionService.list(page, pageSize);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const result = await institutionService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Institution created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await institutionService.update(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Institution updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
