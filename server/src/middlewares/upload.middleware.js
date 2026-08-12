import multer from "multer";
import path from "path";
import AppError from "../utils/AppError.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".pdf"]);

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname || "").toLowerCase();
  const mimeType = (file.mimetype || "").toLowerCase();

  if (!allowedMimeTypes.has(mimeType) || !allowedExtensions.has(extension)) {
    return cb(
      new AppError(
        "Only JPG, JPEG, PNG, and PDF files are allowed",
        400,
      ),
      false,
    );
  }

  return cb(null, true);
};

export const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter,
});
