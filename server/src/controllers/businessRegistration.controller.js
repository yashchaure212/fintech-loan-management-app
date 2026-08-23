import { businessRegistrationService } from "../services/businessRegistration.service.js";

export const businessRegistrationController = {
  async list(req, res, next) {
    try {
      const result = await businessRegistrationService.list(
        req.user.id,
        req.params.parentEmploymentId,
      );

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
      const result = await businessRegistrationService.create(
        req.user.id,
        req.params.parentEmploymentId,
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: "Business registration added successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await businessRegistrationService.update(
        req.user.id,
        req.params.registrationId,
        req.body,
      );

      return res.status(200).json({
        success: true,
        message: "Business registration updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await businessRegistrationService.delete(
        req.user.id,
        req.params.registrationId,
      );

      return res.status(200).json({
        success: true,
        message: "Business registration removed successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};
