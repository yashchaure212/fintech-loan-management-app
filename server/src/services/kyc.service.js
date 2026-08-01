import { kycRepository } from "../repositories/kyc.repository.js";
import { deleteFile, uploadFile } from "./file.service.js";
import AppError from "../utils/AppError.js";

export const kycService = {
  async uploadDocument(userId, data, file) {
    if (!file) {
      throw new AppError("Document file required", 400);
    }

    const existingDocument = await kycRepository.findDocumentByType(
      userId,
      data.documentType,
    );

    if (existingDocument) {
      // Delete old file
      try {
        await deleteFile(existingDocument.publicId);
      } catch (error) {
        console.error("Failed to delete old document:", error);
      }

      // Upload new file
      const uploaded = await uploadFile(file);

      // Update existing record
      return kycRepository.update(existingDocument.id, {
        documentUrl: uploaded.url,
        publicId: uploaded.publicId,
        status: "PENDING",
        rejectionReason: null,
        updatedAt: new Date(),
      });
    }

    const uploaded = await uploadFile(file);

    return kycRepository.create({
      userId,

      documentType: data.documentType,

      documentUrl: uploaded.url,

      publicId: uploaded.publicId,
    });
  },

  async getDocuments(userId) {
    return kycRepository.findByUser(userId);
  },
};
