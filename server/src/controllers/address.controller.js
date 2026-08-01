import { addressService } from "../services/address.service.js";

export const addressController = {
  async create(req, res, next) {
    try {
      const result = await addressService.createAddress(req.user.id, req.body);

      res.status(201).json({
        success: true,

        message: "Address created successfully",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const result = await addressService.getAddresses(req.user.id);

      res.status(200).json({
        success: true,

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result = await addressService.updateAddress(
        req.user.id,
        req.params.id,
        req.body,
      );

      res.status(200).json({
        success: true,

        message: "Address updated",

        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      await addressService.deleteAddress(req.user.id, req.params.id);

      res.status(200).json({
        success: true,

        message: "Address deleted",
      });
    } catch (error) {
      next(error);
    }
  },
};
