import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/services/password.service.js";

/*
 * Launch-readiness audit #4 / §8 item 7:
 * Loan types, interest configs, eligibility rules, required documents, and
 * institutions are reference data. They are managed here (or via the DB),
 * not through an admin UI. Admin HTTP CRUD exists for scripts later; the
 * product UI is application review only.
 */

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

async function hideLegacyLoanTypes() {
  const result = await prisma.loanType.updateMany({
    where: {
      code: {
        in: ["STUDENT_LOAN", "EDUCATION_LOAN"],
      },
    },
    data: {
      isActive: false,
    },
  });

  console.log(
    `🙈 Hidden legacy loan types (STUDENT_LOAN / EDUCATION_LOAN): ${result.count} row(s) set isActive=false`,
  );
}

async function seedStudentLoanProduct() {
  console.log("🌱 Seeding Student Loan product (hidden from apply)...");

  const loanType = await prisma.loanType.upsert({
    where: {
      code: "STUDENT_LOAN",
    },
    update: {
      name: "Student Loan",
      isActive: false,
    },
    create: {
      name: "Student Loan",
      code: "STUDENT_LOAN",
      description: "Finance tuition and other costs for higher education.",
      category: "UNSECURED",
      displayOrder: 1,
      isActive: false,
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

  console.log("✅ Student Loan product seeded successfully (isActive=false)");
}

async function seedSchoolStudentLoanProduct() {
  console.log("🌱 Seeding School Student Loan product...");

  const loanType = await prisma.loanType.upsert({
    where: {
      code: "SCHOOL_STUDENT_LOAN",
    },
    update: {
      name: "School Student Loan",
      description:
        "Finance tuition and other school costs for students in Class 1 to Class 12.",
      isActive: true,
      displayOrder: 2,
    },
    create: {
      name: "School Student Loan",
      code: "SCHOOL_STUDENT_LOAN",
      description:
        "Finance tuition and other school costs for students in Class 1 to Class 12.",
      category: "UNSECURED",
      displayOrder: 2,
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
        minAmount: 10000,
        maxAmount: 500000,
        minTenure: 6,
        maxTenure: 60,
        interestRate: 10.5,
        processingFee: 1,
        processingFeeType: "PERCENTAGE",
        gstPercentage: 18,
        latePenalty: 250,
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
    // minimumAge applies to the CO-APPLICANT (parent/guardian), not the student.
    await prisma.loanEligibility.create({
      data: {
        loanTypeId: loanType.id,
        minimumAge: 21,
        maximumAge: 65,
        minimumIncome: 15000,
      },
    });
  }

  const requiredDocuments = [
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
      documentType: "ADDRESS_PROOF",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: false,
    },
    {
      documentType: "BIRTH_CERTIFICATE",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: true,
    },
    {
      documentType: "PREVIOUS_CLASS_RESULT",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: false,
    },
    {
      documentType: "SCHOOL_ADMISSION_PROOF",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: true,
    },
    {
      documentType: "FEE_STRUCTURE",
      ownerType: "STUDENT",
      employmentType: null,
      isMandatory: true,
    },
    ...["FATHER", "MOTHER", "GUARDIAN"].flatMap((ownerType) => [
      {
        documentType: "AADHAAR_CARD",
        ownerType,
        employmentType: null,
        isMandatory: true,
      },
      {
        documentType: "PAN_CARD",
        ownerType,
        employmentType: null,
        isMandatory: true,
      },
      {
        documentType: "BANK_STATEMENT",
        ownerType,
        employmentType: null,
        isMandatory: true,
      },
      {
        documentType: "SALARY_SLIP",
        ownerType,
        employmentType: "SALARIED",
        isMandatory: true,
      },
      {
        documentType: "BUSINESS_PROOF",
        ownerType,
        employmentType: "BUSINESS",
        isMandatory: true,
      },
      {
        documentType: "BUSINESS_REGISTRATION",
        ownerType,
        employmentType: "BUSINESS",
        isMandatory: true,
      },
      {
        documentType: "GST_CERTIFICATE",
        ownerType,
        employmentType: "BUSINESS",
        isMandatory: false,
      },
      {
        documentType: "UDYAM_CERTIFICATE",
        ownerType,
        employmentType: "BUSINESS",
        isMandatory: false,
      },
      {
        documentType: "LAND_RECORD",
        ownerType,
        employmentType: "FARMER",
        isMandatory: true,
      },
      {
        documentType: "LAND_LEASE_PROOF",
        ownerType,
        employmentType: "FARMER",
        isMandatory: false,
      },
    ]),
    {
      documentType: "EXISTING_LOAN_STATEMENT",
      ownerType: "APPLICANT",
      employmentType: null,
      isMandatory: false,
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

  console.log("✅ School Student Loan product seeded successfully (isActive=true)");
}

async function seedSampleInstitutions() {
  console.log("🌱 Seeding sample institutions...");

  const samples = [
    {
      name: "Government Primary School, Pune",
      schoolId: "SCH-PUNE-001",
      schoolType: "GOVERNMENT",
      city: "Pune",
      taluka: "Haveli",
      district: "Pune",
      state: "Maharashtra",
    },
    {
      name: "St. Mary's High School",
      schoolId: "SCH-MUM-002",
      schoolType: "PRIVATE",
      city: "Mumbai",
      taluka: "Andheri",
      district: "Mumbai Suburban",
      state: "Maharashtra",
    },
    {
      name: "Vidya Niketan School",
      schoolId: "SCH-NAG-003",
      schoolType: "OTHER",
      city: "Nagpur",
      taluka: "Nagpur Rural",
      district: "Nagpur",
      state: "Maharashtra",
    },
  ];

  for (const school of samples) {
    await prisma.institution.upsert({
      where: {
        schoolId: school.schoolId,
      },
      update: {
        name: school.name,
        schoolType: school.schoolType,
        city: school.city,
        taluka: school.taluka,
        district: school.district,
        state: school.state,
        isActive: true,
      },
      create: school,
    });
  }

  console.log("✅ Sample institutions seeded (3 schools)");
}

async function printLoanTypeFlags() {
  const types = await prisma.loanType.findMany({
    where: {
      code: {
        in: ["SCHOOL_STUDENT_LOAN", "STUDENT_LOAN", "EDUCATION_LOAN"],
      },
    },
    select: {
      code: true,
      name: true,
      isActive: true,
    },
    orderBy: {
      code: "asc",
    },
  });

  console.log("📋 Loan type flags:");
  for (const type of types) {
    console.log(
      `   ${type.code} | ${type.name} | isActive=${type.isActive}`,
    );
  }
}

async function main() {
  try {
    await prisma.$connect();

    await seedRoles();
    await seedAdmin();
    await seedStudentLoanProduct();
    await seedSchoolStudentLoanProduct();
    await hideLegacyLoanTypes();
    await seedSampleInstitutions();
    await printLoanTypeFlags();

    console.log("🎉 Database seeding completed");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
