import { loanDocumentService } from "../services/loanDocument.service.js";

export const loanDocumentController = {
  async upload(req, res, next) {
    try {
      const result = await loanDocumentService.upload(
        req.user.id,
        req.file,
        req.body,
      );

      return res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getMyDocuments(req, res, next) {
    try {
      const result = await loanDocumentService.getMyDocuments(
        req.user.id,
        req.params.loanApplicationId,
      );

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
      const result = await loanDocumentService.getById(
        req.user.id,
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

  async verify(req, res, next) {
    try {
      const result = await loanDocumentService.verify(req.params.id);

      return res.status(200).json({
        success: true,
        message: "Document verified successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async reject(req, res, next) {
    try {
      const result = await loanDocumentService.reject(
        req.params.id,
        req.body.rejectionReason,
      );

      return res.status(200).json({
        success: true,
        message: "Document rejected successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await loanDocumentService.delete(req.user.id, req.params.id);

      return res.status(200).json({
        success: true,
        message: "Document deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },

  async getRequiredDocuments(req, res, next) {
    try {
      const result = await loanDocumentService.getRequiredDocuments(
        req.user.id,
        req.params.loanApplicationId,
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
