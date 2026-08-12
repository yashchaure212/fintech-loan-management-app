import { loanWorkflowRepository } from "../repositories/loanWorkflow.repository.js";
import { emiRepository } from "../repositories/emi.repository.js";
import { generateEmiSchedule } from "../utils/generateEmiSchedule.js";
import AppError from "../utils/AppError.js";

const allowedTransitions = {
  DRAFT: [],
  SUBMITTED: ["UNDER_REVIEW", "REJECTED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
  APPROVED: ["DISBURSED"],
  DISBURSED: ["CLOSED"],
  REJECTED: [],
  CLOSED: [],
};

export const loanWorkflowService = {
  async updateStatus(
    loanApplicationId,
    status,
    remarks,
    changedById,
  ) {
    const application =
      await loanWorkflowRepository.findById(
        loanApplicationId,
      );

    if (!application) {
      throw new AppError(
        "Loan application not found",
        404,
      );
    }

    const currentStatus = application.status;

    const allowedStatuses =
      allowedTransitions[currentStatus] || [];

    if (!allowedStatuses.includes(status)) {
      throw new AppError(
        `Cannot change loan application status from ${currentStatus} to ${status}`,
        400,
      );
    }

    return loanWorkflowRepository.transaction(
      async (tx) => {
        const now = new Date();

        const updateData = {
          status,
        };

        if (status === "SUBMITTED") {
          updateData.submittedAt = now;
        }

        if (status === "APPROVED") {
          updateData.approvedAt = now;
        }

        if (status === "REJECTED") {
          updateData.rejectedAt = now;
        }

        if (status === "DISBURSED") {
          updateData.disbursedAt = now;
        }

        const updated =
          await loanWorkflowRepository.updateStatus(
            tx,
            loanApplicationId,
            updateData,
          );

        await loanWorkflowRepository.createStatusHistory(
          tx,
          {
            loanApplicationId,
            status,
            remarks: remarks || null,
            changedById,
          },
        );

        if (status === "DISBURSED") {
          if (
            updated.loanAmount === null ||
            updated.tenureMonths === null ||
            updated.interestRate === null ||
            updated.emi === null
          ) {
            throw new AppError(
              "Loan calculation details are incomplete for disbursement",
              400,
            );
          }

          const existingSchedule =
            await tx.emiSchedule.findFirst({
              where: {
                loanApplicationId,
              },
              select: {
                id: true,
              },
            });

          if (!existingSchedule) {
            const schedule = generateEmiSchedule({
              principal: Number(updated.loanAmount),
              annualInterestRate: Number(
                updated.interestRate,
              ),
              tenureMonths: updated.tenureMonths,
              disbursedAt: updated.disbursedAt ?? now,
            }).map((row) => ({
              ...row,
              loanApplicationId,
            }));

            if (schedule.length) {
              await emiRepository.createMany(tx, schedule);
            }
          }
        }

        return updated;
      },
    );
  },
};

