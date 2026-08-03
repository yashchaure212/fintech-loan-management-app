import { loanWorkflowService } from "../services/loanWorkflow.service.js";

export const loanWorkflowController = {
  async updateStatus(req, res, next) {
    try {
      const { loanApplicationId } = req.params;

      const { status, remarks } = req.body;

      const result = await loanWorkflowService.updateStatus(
        loanApplicationId,
        status,
        remarks,
        req.user.id,
      );

      return res.status(200).json({
        success: true,
        message: "Loan status updated successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
