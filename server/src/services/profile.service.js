import { profileRepository } from "../repositories/profile.repository.js";
import AppError from "../utils/AppError.js";

export const profileService = {
  async createProfile(userId, data) {
    const existingProfile = await profileRepository.findProfileByUserId(userId);

    if (existingProfile) {
      throw new AppError("Profile already exists", 409);
    }

    const profileData = {
      ...data,
      ...(data.dateOfBirth && {
        dateOfBirth: new Date(data.dateOfBirth),
      }),
    };

    return profileRepository.createProfile({
      userId,
      ...profileData,
    });
  },

  async getProfile(userId) {
    const profile = await profileRepository.findProfileByUserId(userId);

    return profile;
  },

  async updateProfile(userId, data) {
    const existingProfile = await profileRepository.findProfileByUserId(userId);

    const profileData = {
      ...data,
      ...(data.dateOfBirth && {
        dateOfBirth: new Date(data.dateOfBirth),
      }),
    };

    // No profile yet → create it
    if (!existingProfile) {
      return profileRepository.createProfile({
        userId,
        ...profileData,
      });
    }

    // Profile exists → update it
    return profileRepository.updateProfile(userId, profileData);
  },
};
