import { employmentService } from "../services/employment.service.js";

export const employmentController = {
  async create(req, res, next) {
    try {
      const result = await employmentService.create(req.user.id, req.body);

      res.status(201).json({
        success: true,

        message: "Employment details created",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async get(req, res, next) {
    try {
      const result = await employmentService.get(req.user.id);

      res.status(200).json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await employmentService.update(req.user.id, req.body);

      res.status(200).json({
        success: true,

        message: "Employment updated",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
