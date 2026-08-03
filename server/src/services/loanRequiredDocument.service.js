import { loanRequiredDocumentRepository } from "../repositories/loanRequiredDocument.repository.js";
import AppError from "../utils/AppError.js";

export const loanRequiredDocumentService = {
  async create(data) {
    // Validate Loan Type
    const loanType = await loanRequiredDocumentRepository.findLoanType(
      data.loanTypeId,
    );

    if (!loanType) {
      throw new AppError("Loan type not found", 404);
    }

    // Prevent duplicate document type
    const existing =
      await loanRequiredDocumentRepository.findByLoanTypeAndDocumentType(
        data.loanTypeId,
        data.documentType,
      );

    if (existing) {
      throw new AppError("Document already configured for this loan type", 409);
    }

    return loanRequiredDocumentRepository.create(data);
  },

  async getAll() {
    return loanRequiredDocumentRepository.findAll();
  },

  async getById(id) {
    const document = await loanRequiredDocumentRepository.findById(id);

    if (!document) {
      throw new AppError("Required document not found", 404);
    }

    return document;
  },

  async update(id, data) {
    const document = await loanRequiredDocumentRepository.findById(id);

    if (!document) {
      throw new AppError("Required document not found", 404);
    }

    // Loan Type changed
    if (data.loanTypeId && data.loanTypeId !== document.loanTypeId) {
      const loanType = await loanRequiredDocumentRepository.findLoanType(
        data.loanTypeId,
      );

      if (!loanType) {
        throw new AppError("Loan type not found", 404);
      }
    }

    // Check duplicate if loan type or document type changes
    if (data.loanTypeId || data.documentType) {
      const loanTypeId = data.loanTypeId ?? document.loanTypeId;
      const documentType = data.documentType ?? document.documentType;

      const existing =
        await loanRequiredDocumentRepository.findByLoanTypeAndDocumentType(
          loanTypeId,
          documentType,
        );

      if (existing && existing.id !== id) {
        throw new AppError(
          "Document already configured for this loan type",
          409,
        );
      }
    }

    return loanRequiredDocumentRepository.update(id, data);
  },

  async delete(id) {
    const document = await loanRequiredDocumentRepository.findById(id);

    if (!document) {
      throw new AppError("Required document not found", 404);
    }

    return loanRequiredDocumentRepository.delete(id);
  },
};
