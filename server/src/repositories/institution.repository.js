import prisma from "../config/prisma.js";

export const institutionRepository = {
  search(query, city) {
    return prisma.institution.findMany({
      where: {
        isActive: true,
        name: {
          contains: query,
          mode: "insensitive",
        },
        ...(city
          ? {
              city: {
                contains: city,
                mode: "insensitive",
              },
            }
          : {}),
      },
      take: 10,
      orderBy: {
        name: "asc",
      },
    });
  },

  findAll({ skip, take } = {}) {
    return prisma.institution.findMany({
      skip,
      take,
      orderBy: {
        name: "asc",
      },
    });
  },

  findById(id) {
    return prisma.institution.findUnique({
      where: { id },
    });
  },

  create(data) {
    return prisma.institution.create({
      data,
    });
  },

  update(id, data) {
    return prisma.institution.update({
      where: { id },
      data,
    });
  },
};
