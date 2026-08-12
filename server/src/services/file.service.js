import cloudinary from "../config/cloudinary.js";

export const uploadFile = async (file, folder = "fintech/kyc") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          if (!result) {
            return reject(new Error("Cloudinary upload failed"));
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      )
      .end(file.buffer);
  });
};

export const deleteFile = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
