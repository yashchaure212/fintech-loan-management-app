import { kycService } from "../services/kyc.service.js";

export const kycController = {
  async upload(req, res, next) {
    try {
      const result = await kycService.uploadDocument(
        req.user.id,

        req.body,

        req.file,
      );

      res.status(201).json({
        success: true,

        message: "Document uploaded",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const result = await kycService.getDocuments(req.user.id);

      res.status(200).json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
