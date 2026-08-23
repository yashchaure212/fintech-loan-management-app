import cloudinary from "../config/cloudinary.js";

const SIGNED_URL_TTL_SECONDS = 5 * 60;

export const uploadFile = async (file, folder = "fintech/kyc") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
          type: "authenticated",
          access_mode: "authenticated",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Cloudinary upload failed"));
          }

          resolve({
            publicId: result.public_id,
            resourceType: result.resource_type || "image",
          });
        },
      )
      .end(file.buffer);
  });
};

export const getSignedFileUrl = (
  publicId,
  resourceType = "image",
  ttlSeconds = SIGNED_URL_TTL_SECONDS,
) => {
  if (!publicId) {
    return null;
  }

  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: "authenticated",
    sign_url: true,
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + ttlSeconds,
  });
};

export const withSignedDocumentUrl = (document) => {
  if (!document) {
    return document;
  }

  const { documentUrl, ...rest } = document;

  void documentUrl;

  return {
    ...rest,
    documentUrl: getSignedFileUrl(
      document.publicId,
      document.resourceType || "image",
    ),
  };
};

export const deleteFile = async (publicId, resourceType = "image") => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: "authenticated",
  });
};
