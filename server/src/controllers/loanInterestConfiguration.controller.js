import { loanInterestConfigurationService } from "../services/loanInterestConfiguration.service.js";

export const loanInterestConfigurationController = {
  async create(req, res, next) {
    try {
      const result = await loanInterestConfigurationService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Interest configuration created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const result = await loanInterestConfigurationService.getAll();

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
      const result = await loanInterestConfigurationService.getById(
        req.params.id,
      );

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
      const result = await loanInterestConfigurationService.update(
        req.params.id,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Interest configuration updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const result = await loanInterestConfigurationService.updateStatus(
        req.params.id,
        req.body.isActive,
      );

      return res.status(200).json({
        success: true,
        message: "Interest configuration status updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await loanInterestConfigurationService.delete(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Interest configuration deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
