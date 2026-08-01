import { profileRepository } from "../repositories/profile.repository.js";
import AppError from "../utils/AppError.js";

export const profileService = {
  async createProfile(userId, data) {
    const existingProfile = await profileRepository.findProfileByUserId(userId);

    if (existingProfile) {
      throw new AppError("Profile already exists", 409);
    }

    if (data.dateOfBirth) {
      data.dateOfBirth = new Date(data.dateOfBirth);
    }

    return profileRepository.createProfile({
      userId,

      ...data,
    });
  },

  async getProfile(userId) {
    const profile = await profileRepository.findProfileByUserId(userId);

    if (!profile) {
      throw new AppError("Profile not found", 404);
    }

    return profile;
  },

  async updateProfile(userId, data) {
    return profileRepository.updateProfile(userId, data);
  },
};
