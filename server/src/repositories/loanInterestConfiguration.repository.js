import prisma from "../config/prisma.js";

const ACTIVE_SCOPE = {
  isActive: true,
  isDeleted: false,
};

export const loanInterestConfigurationRepository = {
  create(data) {
    return prisma.loanInterestConfiguration.create({
      data,
      include: {
        loanType: true,
      },
    });
  },

  findById(id) {
    return prisma.loanInterestConfiguration.findUnique({
      where: {
        id,
      },
      include: {
        loanType: true,
      },
    });
  },

  findAll() {
    return prisma.loanInterestConfiguration.findMany({
      where: {
        isDeleted: false,
      },
      include: {
        loanType: true,
      },
      orderBy: [
        {
          loanType: {
            name: "asc",
          },
        },
        {
          minAmount: "asc",
        },
      ],
    });
  },

  /*
   * Full version history for one product, newest first.
   * Includes closed (historical) versions - they are read-only.
   */
  findHistoryByLoanType(loanTypeId) {
    return prisma.loanInterestConfiguration.findMany({
      where: {
        loanTypeId,
        isDeleted: false,
      },
      include: {
        loanType: true,
      },
      orderBy: [
        {
          effectiveFrom: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
    });
  },

  /*
   * The version applicable at a point in time: active, not deleted,
   * already effective, and not yet closed.
   */
  findApplicable(loanTypeId, at = new Date(), client = prisma) {
    return client.loanInterestConfiguration.findFirst({
      where: {
        loanTypeId,
        ...ACTIVE_SCOPE,
        effectiveFrom: {
          lte: at,
        },
        OR: [
          {
            effectiveTo: null,
          },
          {
            effectiveTo: {
              gte: at,
            },
          },
        ],
      },
      include: {
        loanType: true,
      },
      orderBy: {
        effectiveFrom: "desc",
      },
    });
  },

  /*
   * Every version for this product that is still open (or closes after
   * the supplied instant). These are the rows a new version supersedes.
   */
  findOpenVersions(loanTypeId, from, client = prisma) {
    return client.loanInterestConfiguration.findMany({
      where: {
        loanTypeId,
        ...ACTIVE_SCOPE,
        OR: [
          {
            effectiveTo: null,
          },
          {
            effectiveTo: {
              gte: from,
            },
          },
        ],
      },
      orderBy: {
        effectiveFrom: "desc",
      },
    });
  },

  /*
   * A version that already starts at or after the new version's start
   * date would produce an ambiguous/overlapping timeline.
   */
  findFutureVersion(loanTypeId, from, client = prisma) {
    return client.loanInterestConfiguration.findFirst({
      where: {
        loanTypeId,
        isDeleted: false,
        effectiveFrom: {
          gte: from,
        },
      },
      orderBy: {
        effectiveFrom: "asc",
      },
    });
  },

  closeVersion(id, effectiveTo, client = prisma) {
    return client.loanInterestConfiguration.update({
      where: {
        id,
      },
      data: {
        effectiveTo,
        isActive: false,
      },
    });
  },

  createIn(client, data) {
    return client.loanInterestConfiguration.create({
      data,
      include: {
        loanType: true,
      },
    });
  },

  update(id, data) {
    return prisma.loanInterestConfiguration.update({
      where: {
        id,
      },
      data,
      include: {
        loanType: true,
      },
    });
  },

  updateStatus(id, isActive) {
    return prisma.loanInterestConfiguration.update({
      where: {
        id,
      },
      data: {
        isActive,
      },
    });
  },

  softDelete(id) {
    return prisma.loanInterestConfiguration.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        isActive: false,
      },
    });
  },

  findLoanType(id, client = prisma) {
    return client.loanType.findFirst({
      where: {
        id,
        isDeleted: false,
      },
    });
  },

  findLoanTypeByCode(code, client = prisma) {
    return client.loanType.findFirst({
      where: {
        code,
        isDeleted: false,
      },
    });
  },

  countApplicationsUsingConfiguration(configurationId) {
    return prisma.loanApplication.count({
      where: {
        configurationSnapshot: {
          path: ["configurationId"],
          equals: configurationId,
        },
      },
    });
  },

  transaction(callback) {
    return prisma.$transaction(callback);
  },
};
