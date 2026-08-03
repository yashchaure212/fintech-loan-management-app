import { loanRequiredDocumentService } from "../services/loanRequiredDocument.service.js";

export const loanRequiredDocumentController = {
  async create(req, res, next) {
    try {
      const result = await loanRequiredDocumentService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Required document created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const result = await loanRequiredDocumentService.getAll();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const result = await loanRequiredDocumentService.getById(req.params.id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await loanRequiredDocumentService.update(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Required document updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await loanRequiredDocumentService.delete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Required document deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
