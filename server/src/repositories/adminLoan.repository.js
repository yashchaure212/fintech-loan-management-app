import prisma from "../config/prisma.js";
import { withSignedDocumentUrl } from "../services/file.service.js";

function mapApplicationDocuments(application) {
  if (!application?.documents) {
    return application;
  }

  return {
    ...application,
    documents: application.documents.map(withSignedDocumentUrl),
  };
}

export const adminLoanRepository = {
  async getAllApplications({ page, limit }) {
    const skip = (page - 1) * limit;

    const [items, total] = await prisma.$transaction([
      prisma.loanApplication.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          applicationNumber: true,
          loanAmount: true,
          tenureMonths: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          loanType: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              phone: true,
              customerProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.loanApplication.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  },

  async getApplicationById(id) {
    const application = await prisma.loanApplication.findUnique({
      where: {
        id,
      },
      include: {
        loanType: true,
        user: {
          select: {
            id: true,
            email: true,
            phone: true,
            customerProfile: true,
          },
        },
        statusHistory: {
          orderBy: {
            createdAt: "desc",
          },
        },
        emiSchedules: true,
        studentLoan: {
          include: {
            parents: {
              include: {
                employment: true,
              },
            },
          },
        },
        documents: true,
        personalLoan: {
          include: {
            employment: true,
          },
        },
        schoolLoan: {
          include: {
            institution: true,
            coApplicants: {
              include: {
                currentAddress: true,
                permanentAddress: true,
                employment: {
                  include: {
                    employerAddress: true,
                    businessAddress: true,
                    landAddress: true,
                    registrations: true,
                  },
                },
              },
            },
          },
        },
        existingLoans: true,
      },
    });

    return mapApplicationDocuments(application);
  },

  getDashboard() {
    return prisma.loanApplication.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });
  },
};
