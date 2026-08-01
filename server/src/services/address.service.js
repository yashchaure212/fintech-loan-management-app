import { addressRepository } from "../repositories/address.repository.js";
import AppError from "../utils/AppError.js";

export const addressService = {
  async createAddress(userId, data) {
    return addressRepository.createAddress({
      userId,

      ...data,
    });
  },

  async getAddresses(userId) {
    return addressRepository.getAddressesByUserId(userId);
  },

  async updateAddress(userId, id, data) {
    const address = await addressRepository.getAddressById(id, userId);

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    return addressRepository.updateAddress(id, userId, data);
  },

  async deleteAddress(userId, id) {
    const address = await addressRepository.getAddressById(id, userId);

    if (!address) {
      throw new AppError("Address not found", 404);
    }

    await addressRepository.deleteAddress(id, userId);

    return true;
  },
};
