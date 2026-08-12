import { loanTypeService } from "../services/loanType.service.js";

export const loanTypeController = {
  async create(req, res, next) {
    try {
      const result = await loanTypeService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Loan type created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const result = await loanTypeService.getAll();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  // Customer-facing: active loan products only
  async getActive(req, res, next) {
    try {
      const result = await loanTypeService.getActive();

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
      const result = await loanTypeService.getById(req.params.id);

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
      const result = await loanTypeService.update(req.params.id, req.body);

      return res.status(200).json({
        success: true,
        message: "Loan type updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const result = await loanTypeService.updateStatus(
        req.params.id,
        req.body.isActive,
      );

      return res.status(200).json({
        success: true,
        message: "Loan type status updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await loanTypeService.delete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Loan type deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getPublic(req, res, next) {
    try {
      const result = await loanTypeService.getPublic();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPublicById(req, res, next) {
    try {
      const result = await loanTypeService.getPublicById(req.params.id);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
