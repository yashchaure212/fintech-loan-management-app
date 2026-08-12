import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/services/password.service.js";

async function seedRoles() {
  console.log("🌱 Seeding roles...");

  const roles = [
    {
      name: "ADMIN",
      description: "System Administrator",
    },
    {
      name: "CUSTOMER",
      description: "Customer",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles seeded successfully");
}

async function seedAdmin() {
  const isProduction = process.env.NODE_ENV === "production";
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminPhone = process.env.SEED_ADMIN_PHONE?.trim() || "9999999999";

  if (isProduction && (!adminEmail || !adminPassword)) {
    console.log(
      "⏭️ Skipping admin seed in production. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to seed an admin user.",
    );
    return;
  }

  const email = adminEmail || "admin@fintech.com";
  const password = adminPassword || "Admin@123";

  if (isProduction && password === "Admin@123") {
    throw new Error(
      "Refusing to seed a known default admin password in production",
    );
  }

  if (!isProduction && !adminPassword) {
    console.log(
      "⚠️  Using default development admin credentials. Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD, and SEED_ADMIN_PHONE to override.",
    );
  }

  console.log("🌱 Seeding admin user...");

  const adminRole = await prisma.role.findUnique({
    where: {
      name: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: {
      email,
    },
    update: {},
    create: {
      roleId: adminRole.id,
      email,
      phone: adminPhone,
      password: await hashPassword(password),
      isEmailVerified: true,
      isPhoneVerified: true,
      isActive: true,
    },
  });

  console.log(`✅ Admin user seeded successfully (${email})`);
}

async function seedEducationLoanProduct() {
  console.log("🌱 Seeding Education Loan product...");

  const loanType = await prisma.loanType.upsert({
    where: {
      code: "EDUCATION_LOAN",
    },
    update: {},
    create: {
      name: "Education Loan",
      code: "EDUCATION_LOAN",
      description: "Finance tuition and other costs for higher education.",
      category: "UNSECURED",
      displayOrder: 1,
      isActive: true,
    },
  });

  const existingConfig = await prisma.loanInterestConfiguration.findFirst({
    where: {
      loanTypeId: loanType.id,
    },
  });

  if (!existingConfig) {
    await prisma.loanInterestConfiguration.create({
      data: {
        loanTypeId: loanType.id,
        minAmount: 50000,
        maxAmount: 2000000,
        minTenure: 12,
        maxTenure: 84,
        interestRate: 9.5,
        processingFee: 1,
        processingFeeType: "PERCENTAGE",
        gstPercentage: 18,
        latePenalty: 500,
        isActive: true,
      },
    });
  }

  const existingEligibility = await prisma.loanEligibility.findFirst({
    where: {
      loanTypeId: loanType.id,
    },
  });

  if (!existingEligibility) {
    await prisma.loanEligibility.create({
      data: {
        loanTypeId: loanType.id,
        minimumAge: 18,
        maximumAge: 45,
        minimumIncome: 0,
      },
    });
  }

  const requiredDocuments = [
    // =====================================================
    // STUDENT DOCUMENTS
    // =====================================================

    {
      documentType: "AADHAAR_CARD",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: true,
    },

    {
      documentType: "PAN_CARD",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: false,
    },

    {
      documentType: "TENTH_MARKSHEET",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: false,
    },

    {
      documentType: "TWELFTH_MARKSHEET",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: false,
    },

    {
      documentType: "ADMISSION_LETTER",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: false,
    },

    {
      documentType: "FEE_STRUCTURE",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: false,
    },

    // =====================================================
    // FATHER - BASE DOCUMENTS
    // =====================================================

    {
      documentType: "AADHAAR_CARD",
      ownerType: "FATHER",
      employmentType: null,
      isMandatory: true,
    },

    {
      documentType: "PAN_CARD",
      ownerType: "FATHER",
      employmentType: null,
      isMandatory: true,
    },

    {
      documentType: "INCOME_PROOF",
      ownerType: "FATHER",
      employmentType: null,
      isMandatory: true,
    },

    // =====================================================
    // FATHER - EMPLOYMENT SPECIFIC
    // =====================================================

    {
      documentType: "SALARY_SLIP",
      ownerType: "FATHER",
      employmentType: "SALARIED",
      isMandatory: true,
    },

    {
      documentType: "BUSINESS_PROOF",
      ownerType: "FATHER",
      employmentType: "BUSINESS",
      isMandatory: true,
    },

    {
      documentType: "LAND_RECORD",
      ownerType: "FATHER",
      employmentType: "FARMER",
      isMandatory: true,
    },
  ];

  for (const doc of requiredDocuments) {
    const existing = await prisma.loanRequiredDocument.findFirst({
      where: {
        loanTypeId: loanType.id,
        documentType: doc.documentType,
        ownerType: doc.ownerType,
        employmentType: doc.employmentType,
      },
    });

    if (existing) {
      await prisma.loanRequiredDocument.update({
        where: {
          id: existing.id,
        },
        data: {
          isMandatory: doc.isMandatory,
        },
      });
    } else {
      await prisma.loanRequiredDocument.create({
        data: {
          loanTypeId: loanType.id,
          ...doc,
        },
      });
    }
  }

  console.log("✅ Education Loan product seeded successfully");
}

async function main() {
  try {
    await prisma.$connect();

    await seedRoles();
    await seedAdmin();
    await seedEducationLoanProduct();

    console.log("🎉 Database seeding completed");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
