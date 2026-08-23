import { z } from "zod";

function optionalNumber() {
  return z.preprocess((value) => {
    if (value === null || value === undefined || value === "") {
      return undefined;
    }

    if (typeof value === "string") {
      return Number(value);
    }

    return value;
  }, z.number().nonnegative().optional());
}

function optionalInt() {
  return z.preprocess((value) => {
    if (value === null || value === undefined || value === "") {
      return undefined;
    }

    if (typeof value === "string") {
      return Number(value);
    }

    return value;
  }, z.number().int().nonnegative().optional());
}

const SCHOOL_CLASSES = [
  "CLASS_1",
  "CLASS_2",
  "CLASS_3",
  "CLASS_4",
  "CLASS_5",
  "CLASS_6",
  "CLASS_7",
  "CLASS_8",
  "CLASS_9",
  "CLASS_10",
  "CLASS_11",
  "CLASS_12",
];

const addressSchema = z.object({
  line1: z.string().trim().min(3),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2),
  taluka: z.string().trim().optional(),
  district: z.string().trim().optional(),
  state: z.string().trim().min(2),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});

const businessRegistrationSchema = z.object({
  registrationType: z.enum([
    "GST",
    "UDYAM",
    "SHOP_ESTABLISHMENT",
    "TRADE_LICENSE",
    "OTHER",
  ]),
  registrationNumber: z.string().trim().min(1),
  issueDate: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional(),
});

const employmentSchema = z.object({
    employmentType: z.enum([
      "SALARIED",
      "SELF_EMPLOYED",
      "BUSINESS",
      "FARMER",
      "CONTRACT",
      "RETIRED",
      "OTHER",
    ]),

    // Salaried
    companyName: z.string().trim().min(1).optional(),
    designation: z.string().trim().min(1).optional(),
    monthlyIncome: optionalNumber(),
    experienceYears: optionalInt(),
    industryType: z.string().trim().min(1).optional(),
    dateOfJoining: z.coerce.date().optional(),
    salaryFrequency: z.string().trim().min(1).optional(),
    previousYearIncome: optionalNumber(),
    salaryAccountBank: z.string().trim().min(1).optional(),
    employerAddress: addressSchema.optional(),

    // Business
    businessName: z.string().trim().min(1).optional(),
    businessType: z.string().trim().min(1).optional(),
    annualTurnover: optionalNumber(),
    annualIncome: optionalNumber(),
    businessCategory: z.string().trim().min(1).optional(),
    businessStartDate: z.coerce.date().optional(),
    numberOfEmployees: optionalInt(),
    numberOfBranches: optionalInt(),
    yearsAtBusinessLocation: optionalInt(),
    currentYearEstimatedIncome: optionalNumber(),
    businessAddress: addressSchema.optional(),
    registrations: z.array(businessRegistrationSchema).max(10).optional(),

    // Farmer
    landHoldingAcres: optionalNumber(),
    cropType: z.string().trim().min(1).optional(),
    agriculturalIncome: optionalNumber(),
    landArea: optionalNumber(),
    landUnit: z.string().trim().min(1).optional(),
    landOwnership: z
      .enum(["OWNED", "LEASED", "PARTIALLY_OWNED_LEASED"])
      .optional(),
    cultivatedArea: optionalNumber(),
    otherCropTypes: z.string().trim().optional(),
    irrigationType: z.string().trim().optional(),
    landLocationVillage: z.string().trim().optional(),
    landAddress: addressSchema.optional(),

    // Contract
    employerName: z.string().trim().min(1).optional(),
    contractDurationMonths: optionalInt(),

    // Other
    occupation: z.string().trim().min(1).optional(),
});

const coApplicantSchema = z.object({
  relation: z.enum(["FATHER", "MOTHER", "GUARDIAN", "OTHER"]),

  fullName: z.string().trim().min(2).max(100),

  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),

  dateOfBirth: z.coerce.date().optional(),

  maritalStatus: z.enum(["SINGLE", "MARRIED", "OTHER"]).optional(),

  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar number must contain 12 digits")
    .optional(),

  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number")
    .optional(),

  isCoApplicant: z.boolean().default(false),

  numberOfDependents: optionalInt(),
  numberOfEarningMembers: optionalInt(),
  familyMonthlyIncome: optionalNumber(),

  currentAddress: addressSchema.optional(),
  permanentAddress: addressSchema.optional(),
  sameAsCurrentAddress: z.boolean().default(false),
  yearsAtCurrentAddress: optionalInt(),

  bankAccountNumber: z.string().trim().optional(),
  ifscCode: z.string().trim().optional(),

  employment: employmentSchema.optional(),
});

export const createSchoolLoanSchema = z.object({
  // Student personal
  studentName: z.string().trim().min(2).max(100),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number")
    .optional()
    .or(z.literal("")),
  email: z.string().email().optional().or(z.literal("")),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, "Aadhaar number must contain 12 digits")
    .optional()
    .or(z.literal("")),
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number")
    .optional()
    .or(z.literal("")),

  // Current education
  currentSchoolName: z.string().trim().min(1).max(200),
  institutionId: z.uuid().nullable().optional(),
  schoolType: z.enum(["GOVERNMENT", "PRIVATE", "OTHER"]).optional(),
  currentClass: z.enum(SCHOOL_CLASSES),
  academicYear: z.string().trim().min(4).max(20),
  continuingSameSchool: z.boolean().default(true),

  // If changing school
  previousSchoolName: z.string().trim().optional(),
  newSchoolName: z.string().trim().optional(),
  newInstitutionId: z.uuid().optional(),
  expectedJoiningDate: z.coerce.date().optional(),

  // Academic history
  previousClass: z.enum(SCHOOL_CLASSES).optional(),
  previousAcademicYear: z.string().trim().optional(),
  previousClassPercentage: z.number().min(0).max(100).optional(),

  // Loan requirement (set later, at Step 5, but accepted here too since
  // updateSchoolLoanSchema is a .partial() of this same object)
  loanPurpose: z.string().trim().optional(),
  expectedDisbursementDate: z.coerce.date().optional(),
  tuitionFees: z.number().nonnegative().optional(),
  admissionFees: z.number().nonnegative().optional(),
  examinationFees: z.number().nonnegative().optional(),
  booksAmount: z.number().nonnegative().optional(),
  uniformAmount: z.number().nonnegative().optional(),
  equipmentAmount: z.number().nonnegative().optional(),
  transportAmount: z.number().nonnegative().optional(),
  hostelAmount: z.number().nonnegative().optional(),
  otherExpensesAmount: z.number().nonnegative().optional(),
  familyContribution: z.number().nonnegative().optional(),
  scholarshipAmount: z.number().nonnegative().optional(),
  otherFundingAmount: z.number().nonnegative().optional(),

  hasExistingLoans: z.boolean().optional(),

  // Co-applicants may be added in the same call or in a later step
  coApplicants: z.array(coApplicantSchema).max(2).optional(),
});

export const updateSchoolLoanSchema = createSchoolLoanSchema.partial();

export const updateCoApplicantSchema = coApplicantSchema.partial();
