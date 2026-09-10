import { loanInterestConfigurationService } from "../services/loanInterestConfiguration.service.js";

export const loanInterestConfigurationController = {
  async create(req, res, next) {
    try {
      const result =
        await loanInterestConfigurationService.createVersion(
          req.body,
        );

      return res.status(201).json({
        success: true,
        message: "New configuration version created successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const result =
        await loanInterestConfigurationService.getAll();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /*
   * Admin endpoint.
   *
   * This must work even when the product has no pricing
   * configuration yet. The admin needs to be able to open
   * the page and create the first version.
   */
  async getSupportedProductConfiguration(req, res, next) {
    try {
      const history =
        await loanInterestConfigurationService.getSupportedProductHistory();

      return res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req, res, next) {
    try {
      const result =
        await loanInterestConfigurationService.getHistory(
          req.params.loanTypeId,
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  /*
   * Customer-facing endpoint.
   *
   * Unlike the admin endpoint above, this requires an
   * actually applicable pricing configuration.
   */
  async getApplicableForCustomer(req, res, next) {
    try {
      const { loanType, configuration } =
        await loanInterestConfigurationService.getApplicableForSupportedProduct();

      return res.status(200).json({
        success: true,
        data: {
          loanTypeId: loanType.id,
          loanTypeCode: loanType.code,
          loanTypeName: loanType.name,
          configurationId: configuration.id,

          minAmount: Number(configuration.minAmount),
          maxAmount: Number(configuration.maxAmount),

          minTenure: configuration.minTenure,
          maxTenure: configuration.maxTenure,

          interestRate: Number(configuration.interestRate),

          processingFee: Number(
            configuration.processingFee,
          ),

          processingFeeType:
            configuration.processingFeeType,

          gstPercentage: Number(
            configuration.gstPercentage,
          ),

          latePenalty:
            configuration.latePenalty === null
              ? null
              : Number(configuration.latePenalty),

          foreclosureCharge:
            configuration.foreclosureCharge === null
              ? null
              : Number(configuration.foreclosureCharge),

          effectiveFrom:
            configuration.effectiveFrom,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const result =
        await loanInterestConfigurationService.getById(
          req.params.id,
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const result =
        await loanInterestConfigurationService.update(
          req.params.id,
          req.body,
        );

      return res.status(200).json({
        success: true,
        message:
          "Interest configuration updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req, res, next) {
    try {
      const result =
        await loanInterestConfigurationService.updateStatus(
          req.params.id,
          req.body.isActive,
        );

      return res.status(200).json({
        success: true,
        message:
          "Interest configuration status updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await loanInterestConfigurationService.delete(
        req.params.id,
      );

      return res.status(200).json({
        success: true,
        message:
          "Interest configuration deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  },
};