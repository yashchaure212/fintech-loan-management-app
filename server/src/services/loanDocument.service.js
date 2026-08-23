import { loanDocumentRepository } from "../repositories/loanDocument.repository.js";
import { loanApplicationRepository } from "../repositories/loanApplication.repository.js";
import { loanRequiredDocumentService } from "./loanRequiredDocument.service.js";
import { loanValidationService } from "./loanValidation.service.js";
import { uploadFile, deleteFile, withSignedDocumentUrl } from "./file.service.js";
import AppError from "../utils/AppError.js";

export const loanDocumentService = {
  async upload(userId, file, data) {
    if (!file) {
      throw new AppError("Document file is required", 400);
    }

    const application = await loanApplicationRepository.findById(
      data.loanApplicationId,
    );

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    const requiredDocuments =
      await loanRequiredDocumentService.resolveForApplication(
        data.loanApplicationId,
      );

    const matchingRequirement = requiredDocuments.find(
      (requirement) =>
        requirement.ownerType === data.ownerType &&
        requirement.documentType === data.documentType,
    );

    if (!matchingRequirement) {
      throw new AppError(
        "This document is not required for this loan application",
        400,
      );
    }

    const existingDocuments = await loanDocumentRepository.findByRequirement({
      loanApplicationId: data.loanApplicationId,
      ownerType: data.ownerType,
      documentType: data.documentType,
    });

    if (
      !loanValidationService.canCustomerUploadDocument(
        application,
        existingDocuments,
      )
    ) {
      throw new AppError(
        application.status === "DRAFT"
          ? "Documents can only be uploaded while the application is in draft"
          : "Only rejected documents can be replaced after submission",
        400,
      );
    }

    const activeDocument = existingDocuments.find(
      (document) => document.status !== "REJECTED",
    );

    if (activeDocument) {
      if (activeDocument.status === "VERIFIED") {
        throw new AppError(
          "Verified documents cannot be replaced",
          400,
        );
      }

      throw new AppError(
        "A document for this requirement has already been uploaded",
        409,
      );
    }

    const rejectedDocuments = existingDocuments.filter(
      (document) => document.status === "REJECTED",
    );

    /*
     * ============================================================
     * VERIFY DOCUMENT REQUIREMENT
     * ============================================================
     *
     * Never trust ownerType/documentType coming from the frontend.
     *
     * The backend checks whether this exact document is required
     * for this loan application.
     */

    /*
     * ============================================================
     * CHECK EXISTING DOCUMENT
     * ============================================================
     *
     * Only one active document should exist for a particular
     * application + owner + document type.
     *
     * If the previous document was rejected, allow replacement.
     */

    /*
     * ============================================================
     * UPLOAD FILE
     * ============================================================
     */

    const uploadedFile = await uploadFile(
      file,
      `fintech/loan-documents/${data.loanApplicationId}`,
    );

    /*
     * ============================================================
     * CREATE DATABASE RECORD
     *
     * Upload the replacement first. Only after the new record
     * exists do we remove rejected predecessors and their files.
     * ============================================================
     */

    try {
      const document = await loanDocumentRepository.create({
        loanApplicationId: data.loanApplicationId,
        ownerType: data.ownerType,
        documentType: data.documentType,
        documentUrl: "authenticated",
        publicId: uploadedFile.publicId,
        resourceType: uploadedFile.resourceType,
        status: "PENDING",
        rejectionReason: null,
      });

      for (const rejectedDocument of rejectedDocuments) {
        await loanDocumentRepository.delete(rejectedDocument.id).catch(() => {});

        if (rejectedDocument.publicId) {
          await deleteFile(
            rejectedDocument.publicId,
            rejectedDocument.resourceType,
          ).catch(() => {});
        }
      }

      return withSignedDocumentUrl(document);
    } catch (error) {
      /*
       * If database creation fails, remove the uploaded
       * Cloudinary file so we don't leave orphaned files.
       */

      if (uploadedFile.publicId) {
        await deleteFile(uploadedFile.publicId, uploadedFile.resourceType).catch(
          () => {},
        );
      }

      throw error;
    }
  },

  async getMyDocuments(userId, loanApplicationId) {
    const application =
      await loanApplicationRepository.findById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    const documents =
      await loanDocumentRepository.findByApplicationId(loanApplicationId);

    return documents.map(withSignedDocumentUrl);
  },

  async getById(userId, documentId) {
    const document = await loanDocumentRepository.findById(documentId);

    if (!document) {
      throw new AppError("Document not found", 404);
    }

    if (document.loanApplication.userId !== userId) {
      throw new AppError("You are not allowed to access this document", 403);
    }

    return withSignedDocumentUrl(document);
  },

  async verify(documentId) {
    const document = await loanDocumentRepository.findById(documentId);

    if (!document) {
      throw new AppError("Document not found", 404);
    }

    if (document.status === "VERIFIED") {
      throw new AppError("Document is already verified", 400);
    }

    return withSignedDocumentUrl(
      await loanDocumentRepository.update(documentId, {
        status: "VERIFIED",
        rejectionReason: null,
      }),
    );
  },

  async reject(documentId, rejectionReason) {
    const document = await loanDocumentRepository.findById(documentId);

    if (!document) {
      throw new AppError("Document not found", 404);
    }

    if (document.status === "VERIFIED") {
      throw new AppError("Verified documents cannot be rejected", 400);
    }

    return withSignedDocumentUrl(
      await loanDocumentRepository.update(documentId, {
        status: "REJECTED",
        rejectionReason,
      }),
    );
  },

  async delete(userId, documentId) {
    const document = await loanDocumentRepository.findById(documentId);

    if (!document) {
      throw new AppError("Document not found", 404);
    }

    if (document.loanApplication.userId !== userId) {
      throw new AppError("You are not allowed to delete this document", 403);
    }

    if (
      !loanValidationService.canCustomerDeleteDocument(
        document.loanApplication,
        document,
      )
    ) {
      throw new AppError(
        "This document cannot be deleted in the current application state",
        400,
      );
    }

    if (document.publicId) {
      await deleteFile(document.publicId, document.resourceType);
    }

    return loanDocumentRepository.delete(documentId);
  },

  async getRequiredDocuments(userId, loanApplicationId) {
    const application =
      await loanApplicationRepository.findById(loanApplicationId);

    if (!application || application.userId !== userId) {
      throw new AppError("Loan application not found", 404);
    }

    return loanRequiredDocumentService.resolveForApplication(loanApplicationId);
  },
};
