import { businessRegistrationRepository } from "../repositories/businessRegistration.repository.js";
import AppError from "../utils/AppError.js";

function resolveOwningApplication(parent) {
  return (
    parent?.schoolLoanApplication?.loanApplication ||
    parent?.studentLoanApplication?.loanApplication ||
    null
  );
}

function ensureAccess(userId, parentEmployment) {
  const application = resolveOwningApplication(parentEmployment?.parent);

  if (!parentEmployment || !application || application.userId !== userId) {
    throw new AppError("Employment record not found", 404);
  }

  if (application.status !== "DRAFT") {
    throw new AppError(
      "Business registrations can only be modified while the application is in draft",
      400,
    );
  }

  return application;
}

export const businessRegistrationService = {
  async list(userId, parentEmploymentId) {
    const parentEmployment =
      await businessRegistrationRepository.findParentEmploymentById(
        parentEmploymentId,
      );

    ensureAccess(userId, parentEmployment);

    return businessRegistrationRepository.findByEmployment(
      parentEmploymentId,
    );
  },

  async create(userId, parentEmploymentId, data) {
    const parentEmployment =
      await businessRegistrationRepository.findParentEmploymentById(
        parentEmploymentId,
      );

    ensureAccess(userId, parentEmployment);

    return businessRegistrationRepository.create({
      parentEmploymentId,
      ...data,
    });
  },

  async update(userId, registrationId, data) {
    const registration = await businessRegistrationRepository.findById(
      registrationId,
    );

    if (!registration) {
      throw new AppError("Business registration not found", 404);
    }

    ensureAccess(userId, registration.parentEmployment);

    return businessRegistrationRepository.update(registrationId, data);
  },

  async delete(userId, registrationId) {
    const registration = await businessRegistrationRepository.findById(
      registrationId,
    );

    if (!registration) {
      throw new AppError("Business registration not found", 404);
    }

    ensureAccess(userId, registration.parentEmployment);

    await businessRegistrationRepository.delete(registrationId);

    return true;
  },
};
