import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/services/password.service.js";
import {
  SCHOOL_STUDENT_LOAN_CODE,
  isAllowedSchoolLoanRequirement,
} from "../src/constants/loanProducts.js";

/*
 * ============================================================
 * SEED
 * ============================================================
 *
 * Seeds reference data for the ONE supported customer product:
 * School Student Loan.
 *
 * Everything here is idempotent - running it repeatedly never
 * creates a duplicate configuration version or a duplicate
 * document requirement.
 *
 * Legacy products are deactivated rather than deleted so that
 * historical applications keep their product, pricing and
 * documents intact.
 */

const LEGACY_LOAN_TYPE_CODES = ["STUDENT_LOAN", "EDUCATION_LOAN", "PERSONAL_LOAN"];

async function seedRoles() {
  console.log("🌱 Seeding roles...");

  const roles = [
    { name: "ADMIN", description: "System Administrator" },
    { name: "CUSTOMER", description: "Customer" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles seeded");
}

async function seedAdmin() {
  const isProduction = process.env.NODE_ENV === "production";
  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminPhone = process.env.SEED_ADMIN_PHONE?.trim() || "9999999999";

  if (isProduction && (!adminEmail || !adminPassword)) {
    console.log(
      "⏭️  Skipping admin seed in production. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to seed an admin user.",
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
      "⚠️  Using default development admin credentials. Set SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD and SEED_ADMIN_PHONE to override.",
    );
  }

  console.log("🌱 Seeding admin user...");

  const adminRole = await prisma.role.findUnique({ where: { name: "ADMIN" } });

  await prisma.user.upsert({
    where: { email },
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

  console.log(`✅ Admin user seeded (${email})`);
}

/*
 * Legacy products stay in the database (historical applications
 * reference them) but can never be selected again.
 */
async function deactivateLegacyLoanTypes() {
  const result = await prisma.loanType.updateMany({
    where: { code: { in: LEGACY_LOAN_TYPE_CODES } },
    data: { isActive: false },
  });

  console.log(
    `🙈 Legacy loan products deactivated: ${result.count} row(s) set isActive=false`,
  );
}

/*
 * ============================================================
 * CANONICAL DOCUMENT SET
 * ============================================================
 *
 * This is the exact customer-facing checklist. Anything not listed
 * here is removed from the product so it can never become a hidden
 * mandatory requirement at submission.
 *
 * Deliberately absent:
 *   - Student PAN            (a school student has no PAN)
 *   - Student Address Proof  (address belongs to the co-applicant)
 *   - OTHER                  (no free-form document slot)
 */
function buildCanonicalRequirements() {
  const studentDocuments = [
    { documentType: "AADHAAR_CARD", isMandatory: true },
    { documentType: "BIRTH_CERTIFICATE", isMandatory: true },
    { documentType: "SCHOOL_ADMISSION_PROOF", isMandatory: true },
    { documentType: "FEE_STRUCTURE", isMandatory: true },
    { documentType: "PREVIOUS_CLASS_RESULT", isMandatory: false },
  ].map((doc) => ({ ...doc, ownerType: "STUDENT", employmentType: null }));

  const coApplicantDocuments = ["FATHER", "MOTHER", "GUARDIAN"].flatMap(
    (ownerType) => [
      // Identity and banking, required regardless of employment
      { documentType: "AADHAAR_CARD", employmentType: null, isMandatory: true },
      { documentType: "PAN_CARD", employmentType: null, isMandatory: true },
      { documentType: "BANK_STATEMENT", employmentType: null, isMandatory: true },

      // Salaried
      { documentType: "SALARY_SLIP", employmentType: "SALARIED", isMandatory: true },

      // Self-employed / retired / other: a general income proof
      { documentType: "INCOME_PROOF", employmentType: "SELF_EMPLOYED", isMandatory: true },
      { documentType: "INCOME_PROOF", employmentType: "RETIRED", isMandatory: true },
      { documentType: "INCOME_PROOF", employmentType: "OTHER", isMandatory: true },

      // Contract
      { documentType: "CONTRACT_LETTER", employmentType: "CONTRACT", isMandatory: true },

      // Business (GST / Udyam become mandatory only when that
      // registration is actually declared - see the resolver)
      { documentType: "BUSINESS_PROOF", employmentType: "BUSINESS", isMandatory: true },
      { documentType: "BUSINESS_REGISTRATION", employmentType: "BUSINESS", isMandatory: true },
      { documentType: "GST_CERTIFICATE", employmentType: "BUSINESS", isMandatory: false },
      { documentType: "UDYAM_CERTIFICATE", employmentType: "BUSINESS", isMandatory: false },

      // Farmer (lease proof applies only to leased land)
      { documentType: "LAND_RECORD", employmentType: "FARMER", isMandatory: true },
      { documentType: "LAND_LEASE_PROOF", employmentType: "FARMER", isMandatory: false },
    ].map((doc) => ({ ...doc, ownerType })),
  );

  // Only requested when existing borrowings are declared
  const applicantDocuments = [
    {
      documentType: "EXISTING_LOAN_STATEMENT",
      ownerType: "APPLICANT",
      employmentType: null,
      isMandatory: false,
    },
  ];

  const all = [
    ...studentDocuments,
    ...coApplicantDocuments,
    ...applicantDocuments,
  ];

  const rejected = all.filter(
    (doc) => !isAllowedSchoolLoanRequirement(doc.ownerType, doc.documentType),
  );

  if (rejected.length > 0) {
    throw new Error(
      `Seed defines document slots that the product does not allow: ${rejected
        .map((doc) => `${doc.ownerType}:${doc.documentType}`)
        .join(", ")}`,
    );
  }

  return all;
}

async function syncRequiredDocuments(loanTypeId) {
  const canonical = buildCanonicalRequirements();

  for (const doc of canonical) {
    const existing = await prisma.loanRequiredDocument.findFirst({
      where: {
        loanTypeId,
        documentType: doc.documentType,
        ownerType: doc.ownerType,
        employmentType: doc.employmentType,
      },
    });

    if (existing) {
      if (existing.isMandatory !== doc.isMandatory) {
        await prisma.loanRequiredDocument.update({
          where: { id: existing.id },
          data: { isMandatory: doc.isMandatory },
        });
      }
    } else {
      await prisma.loanRequiredDocument.create({
        data: { loanTypeId, ...doc },
      });
    }
  }

  /*
   * Remove requirements that are no longer part of the product
   * (for example previously seeded Student PAN or Address Proof).
   * Uploaded documents are never touched - only the requirement
   * definition is withdrawn.
   */
  const canonicalKeys = new Set(
    canonical.map(
      (doc) =>
        `${doc.ownerType}:${doc.documentType}:${doc.employmentType ?? "ANY"}`,
    ),
  );

  const configured = await prisma.loanRequiredDocument.findMany({
    where: { loanTypeId },
  });

  const obsolete = configured.filter(
    (doc) =>
      !canonicalKeys.has(
        `${doc.ownerType}:${doc.documentType}:${doc.employmentType ?? "ANY"}`,
      ),
  );

  if (obsolete.length > 0) {
    await prisma.loanRequiredDocument.deleteMany({
      where: { id: { in: obsolete.map((doc) => doc.id) } },
    });

    console.log(
      `🧹 Removed ${obsolete.length} obsolete document requirement(s): ${obsolete
        .map((doc) => `${doc.ownerType}:${doc.documentType}`)
        .join(", ")}`,
    );
  }

  console.log(`✅ ${canonical.length} canonical document requirements in place`);
}

async function seedSchoolStudentLoanProduct() {
  console.log("🌱 Seeding School Student Loan product...");

  const loanType = await prisma.loanType.upsert({
    where: { code: SCHOOL_STUDENT_LOAN_CODE },
    update: {
      name: "School Student Loan",
      description:
        "Finance tuition and other school costs for students in Class 1 to Class 12.",
      isActive: true,
      displayOrder: 1,
      isDeleted: false,
    },
    create: {
      name: "School Student Loan",
      code: SCHOOL_STUDENT_LOAN_CODE,
      description:
        "Finance tuition and other school costs for students in Class 1 to Class 12.",
      category: "UNSECURED",
      displayOrder: 1,
      isActive: true,
    },
  });

  /*
   * Pricing: seed exactly ONE initial version, and only when the
   * product has no configuration at all. Re-running the seed must
   * never create a second version or silently reprice live loans -
   * pricing changes go through the admin "create new version" flow.
   */
  const existingConfigCount = await prisma.loanInterestConfiguration.count({
    where: { loanTypeId: loanType.id, isDeleted: false },
  });

  if (existingConfigCount === 0) {
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
        foreclosureCharge: 0,
        effectiveFrom: new Date(),
        effectiveTo: null,
        isActive: true,
      },
    });

    console.log("✅ Initial pricing version created (v1)");
  } else {
    console.log(
      `⏭️  Pricing untouched (${existingConfigCount} version(s) already exist)`,
    );
  }

  const existingEligibility = await prisma.loanEligibility.findFirst({
    where: { loanTypeId: loanType.id },
  });

  if (!existingEligibility) {
    // Age/income apply to the CO-APPLICANT (parent/guardian), not the student.
    await prisma.loanEligibility.create({
      data: {
        loanTypeId: loanType.id,
        minimumAge: 21,
        maximumAge: 65,
        minimumIncome: 15000,
      },
    });
  }

  await syncRequiredDocuments(loanType.id);

  console.log("✅ School Student Loan product seeded");
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
      where: { schoolId: school.schoolId },
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

async function printSummary() {
  const types = await prisma.loanType.findMany({
    select: { code: true, name: true, isActive: true },
    orderBy: { code: "asc" },
  });

  console.log("📋 Loan products:");
  for (const type of types) {
    console.log(
      `   ${type.isActive ? "🟢" : "⚪"} ${type.code} | ${type.name} | isActive=${type.isActive}`,
    );
  }
}

async function main() {
  try {
    await prisma.$connect();

    await seedRoles();
    await seedAdmin();
    await seedSchoolStudentLoanProduct();
    await deactivateLegacyLoanTypes();
    await seedSampleInstitutions();
    await printSummary();

    console.log("🎉 Database seeding completed");
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
