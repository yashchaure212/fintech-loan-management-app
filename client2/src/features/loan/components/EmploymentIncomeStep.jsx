import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

import {
  useGetSchoolLoanDetailsQuery,
  useUpdateSchoolLoanDetailsMutation,
} from "../api/schoolLoanApi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/common/FormInput";
import FormField from "@/components/common/FormField";
import {
  LoanWizardShell,
  LoanWizardActions,
  selectClassName,
} from "./LoanWizardShell";

const registrationSchema = z.object({
  registrationType: z.enum([
    "GST",
    "UDYAM",
    "SHOP_ESTABLISHMENT",
    "TRADE_LICENSE",
    "OTHER",
  ]),
  registrationNumber: z
    .string()
    .trim()
    .min(1, "Registration number is required"),
});

const employmentSchema = z
  .object({
    employmentType: z.enum(["SALARIED", "BUSINESS", "FARMER", "OTHER"]),

    companyName: z.string().trim().optional(),
    designation: z.string().trim().optional(),
    industryType: z.string().trim().optional(),
    dateOfJoining: z.string().optional(),
    monthlyIncome: z.string().trim().optional(),
    salaryFrequency: z.string().trim().optional(),
    previousYearIncome: z.string().trim().optional(),
    salaryAccountBank: z.string().trim().optional(),

    businessName: z.string().trim().optional(),
    businessType: z.string().trim().optional(),
    businessCategory: z.string().trim().optional(),
    businessStartDate: z.string().optional(),
    numberOfEmployees: z.string().trim().optional(),
    numberOfBranches: z.string().trim().optional(),
    yearsAtBusinessLocation: z.string().trim().optional(),
    annualTurnover: z.string().trim().optional(),
    annualIncome: z.string().trim().optional(),
    currentYearEstimatedIncome: z.string().trim().optional(),
    registrations: z.array(registrationSchema).optional(),

    landArea: z.string().trim().optional(),
    landUnit: z.string().trim().optional(),
    landOwnership: z
      .enum(["OWNED", "LEASED", "PARTIALLY_OWNED_LEASED"])
      .optional(),
    cultivatedArea: z.string().trim().optional(),
    cropType: z.string().trim().optional(),
    otherCropTypes: z.string().trim().optional(),
    irrigationType: z.string().trim().optional(),
    agriculturalIncome: z.string().trim().optional(),
    landLocationVillage: z.string().trim().optional(),

    occupation: z.string().trim().optional(),
  })
  .superRefine((employment, ctx) => {
    if (employment.employmentType === "SALARIED") {
      if (!employment.companyName) {
        ctx.addIssue({
          code: "custom",
          path: ["companyName"],
          message: "Employer name is required",
        });
      }

      if (!employment.designation) {
        ctx.addIssue({
          code: "custom",
          path: ["designation"],
          message: "Designation is required",
        });
      }

      if (!employment.monthlyIncome) {
        ctx.addIssue({
          code: "custom",
          path: ["monthlyIncome"],
          message: "Monthly income is required",
        });
      }
    }

    if (employment.employmentType === "BUSINESS") {
      if (!employment.businessName) {
        ctx.addIssue({
          code: "custom",
          path: ["businessName"],
          message: "Business name is required",
        });
      }

      if (!employment.businessType) {
        ctx.addIssue({
          code: "custom",
          path: ["businessType"],
          message: "Business type is required",
        });
      }

      if (!employment.annualIncome) {
        ctx.addIssue({
          code: "custom",
          path: ["annualIncome"],
          message: "Annual net income is required",
        });
      }
    }

    if (employment.employmentType === "FARMER") {
      if (!employment.landArea) {
        ctx.addIssue({
          code: "custom",
          path: ["landArea"],
          message: "Land area is required",
        });
      }

      if (!employment.landOwnership) {
        ctx.addIssue({
          code: "custom",
          path: ["landOwnership"],
          message: "Land ownership is required",
        });
      }

      if (!employment.cropType) {
        ctx.addIssue({
          code: "custom",
          path: ["cropType"],
          message: "Primary crop type is required",
        });
      }

      if (!employment.agriculturalIncome) {
        ctx.addIssue({
          code: "custom",
          path: ["agriculturalIncome"],
          message: "Agricultural income is required",
        });
      }
    }

    if (employment.employmentType === "OTHER" && !employment.occupation) {
      ctx.addIssue({
        code: "custom",
        path: ["occupation"],
        message: "Occupation is required",
      });
    }
  });

const formSchema = z.object({
  coApplicants: z.array(
    z.object({
      relation: z.string(),
      employment: employmentSchema,
    }),
  ),
});

const emptyEmployment = {
  employmentType: "SALARIED",
  companyName: "",
  designation: "",
  industryType: "",
  dateOfJoining: "",
  monthlyIncome: "",
  salaryFrequency: "MONTHLY",
  previousYearIncome: "",
  salaryAccountBank: "",
  businessName: "",
  businessType: "",
  businessCategory: "",
  businessStartDate: "",
  numberOfEmployees: "",
  numberOfBranches: "",
  yearsAtBusinessLocation: "",
  annualTurnover: "",
  annualIncome: "",
  currentYearEstimatedIncome: "",
  registrations: [],
  landArea: "",
  landUnit: "ACRES",
  landOwnership: "OWNED",
  cultivatedArea: "",
  cropType: "",
  otherCropTypes: "",
  irrigationType: "",
  agriculturalIncome: "",
  landLocationVillage: "",
  occupation: "",
};

function toDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function relationLabel(relation) {
  if (relation === "FATHER") return "Father";
  if (relation === "MOTHER") return "Mother";
  if (relation === "GUARDIAN") return "Guardian";
  return "Co-applicant";
}

function EmploymentIncomeStep({ loanApplicationId, onBack, onNext }) {
  const {
    data,
    isLoading: isFetching,
    isError: isFetchError,
    error: fetchError,
  } = useGetSchoolLoanDetailsQuery(loanApplicationId, {
    skip: !loanApplicationId,
  });

  const [updateSchoolLoanDetails, { isLoading: isUpdating }] =
    useUpdateSchoolLoanDetailsMutation();

  const existingDetails = data?.data;
  const savedCoApplicants = existingDetails?.coApplicants || [];

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { coApplicants: [] },
    mode: "onSubmit",
  });

  const { fields } = useFieldArray({
    control,
    name: "coApplicants",
  });

  const watched = watch("coApplicants");

  useEffect(() => {
    if (!savedCoApplicants.length) return;

    reset({
      coApplicants: savedCoApplicants.map((person) => {
        const employment = person.employment;

        return {
          relation: person.relation,
          employment: {
            ...emptyEmployment,
            employmentType: ["SALARIED", "BUSINESS", "FARMER"].includes(
              employment?.employmentType,
            )
              ? employment.employmentType
              : employment?.employmentType
                ? "OTHER"
                : "SALARIED",
            companyName: employment?.companyName || "",
            designation: employment?.designation || "",
            industryType: employment?.industryType || "",
            dateOfJoining: toDateInputValue(employment?.dateOfJoining),
            monthlyIncome: employment?.monthlyIncome ?? "",
            salaryFrequency: employment?.salaryFrequency || "MONTHLY",
            previousYearIncome: employment?.previousYearIncome ?? "",
            salaryAccountBank: employment?.salaryAccountBank || "",
            businessName: employment?.businessName || "",
            businessType: employment?.businessType || "",
            businessCategory: employment?.businessCategory || "",
            businessStartDate: toDateInputValue(employment?.businessStartDate),
            numberOfEmployees: employment?.numberOfEmployees ?? "",
            numberOfBranches: employment?.numberOfBranches ?? "",
            yearsAtBusinessLocation: employment?.yearsAtBusinessLocation ?? "",
            annualTurnover: employment?.annualTurnover ?? "",
            annualIncome: employment?.annualIncome ?? "",
            currentYearEstimatedIncome:
              employment?.currentYearEstimatedIncome ?? "",
            registrations: (employment?.registrations || []).map((r) => ({
              registrationType: r.registrationType,
              registrationNumber: r.registrationNumber,
            })),
            landArea: employment?.landArea ?? "",
            landUnit: employment?.landUnit || "ACRES",
            landOwnership: employment?.landOwnership || "OWNED",
            cultivatedArea: employment?.cultivatedArea ?? "",
            cropType: employment?.cropType || "",
            otherCropTypes: employment?.otherCropTypes || "",
            irrigationType: employment?.irrigationType || "",
            agriculturalIncome: employment?.agriculturalIncome ?? "",
            landLocationVillage: employment?.landLocationVillage || "",
            occupation: employment?.occupation || "",
          },
        };
      }),
    });
  }, [savedCoApplicants, reset]);

  async function onSubmit(values) {
    try {
      const payload = {
        coApplicants: savedCoApplicants.map((person, index) => {
          const employment = values.coApplicants[index]?.employment;

          const numberOr = (v) =>
            v === "" || v == null ? undefined : Number(v);

          return {
            relation: person.relation,
            fullName: person.fullName,
            mobile: person.mobile,
            gender: person.gender,
            dateOfBirth: toDateInputValue(person.dateOfBirth),
            maritalStatus: person.maritalStatus,
            aadhaarNumber: person.aadhaarNumber || undefined,
            panNumber: person.panNumber || undefined,
            isCoApplicant: person.isCoApplicant,
            numberOfDependents: numberOr(person.numberOfDependents),
            numberOfEarningMembers: numberOr(person.numberOfEarningMembers),
            familyMonthlyIncome: numberOr(person.familyMonthlyIncome),

            currentAddress: person.currentAddress
              ? {
                  line1: person.currentAddress.line1,
                  line2: person.currentAddress.line2 || undefined,
                  city: person.currentAddress.city,
                  taluka: person.currentAddress.taluka || undefined,
                  district: person.currentAddress.district || undefined,
                  state: person.currentAddress.state,
                  pincode: person.currentAddress.pincode,
                }
              : undefined,

            sameAsCurrentAddress: person.sameAsCurrentAddress,

            permanentAddress:
              !person.sameAsCurrentAddress && person.permanentAddress
                ? {
                    line1: person.permanentAddress.line1,
                    line2: person.permanentAddress.line2 || undefined,
                    city: person.permanentAddress.city,
                    taluka: person.permanentAddress.taluka || undefined,
                    district: person.permanentAddress.district || undefined,
                    state: person.permanentAddress.state,
                    pincode: person.permanentAddress.pincode,
                  }
                : undefined,

            yearsAtCurrentAddress: numberOr(person.yearsAtCurrentAddress),

            employment: {
              employmentType: employment.employmentType,
              companyName: employment.companyName || undefined,
              designation: employment.designation || undefined,
              industryType: employment.industryType || undefined,
              dateOfJoining: employment.dateOfJoining || undefined,
              monthlyIncome: numberOr(employment.monthlyIncome),
              salaryFrequency: employment.salaryFrequency || undefined,
              previousYearIncome: numberOr(employment.previousYearIncome),
              salaryAccountBank: employment.salaryAccountBank || undefined,

              businessName: employment.businessName || undefined,
              businessType: employment.businessType || undefined,
              businessCategory: employment.businessCategory || undefined,
              businessStartDate: employment.businessStartDate || undefined,
              numberOfEmployees: numberOr(employment.numberOfEmployees),
              numberOfBranches: numberOr(employment.numberOfBranches),
              yearsAtBusinessLocation: numberOr(
                employment.yearsAtBusinessLocation,
              ),
              annualTurnover: numberOr(employment.annualTurnover),
              annualIncome: numberOr(employment.annualIncome),
              currentYearEstimatedIncome: numberOr(
                employment.currentYearEstimatedIncome,
              ),

              registrations:
                employment.employmentType === "BUSINESS"
                  ? employment.registrations
                  : undefined,

              landArea: numberOr(employment.landArea),
              landUnit: employment.landUnit || undefined,
              landOwnership: employment.landOwnership || undefined,
              cultivatedArea: numberOr(employment.cultivatedArea),
              cropType: employment.cropType || undefined,
              otherCropTypes: employment.otherCropTypes || undefined,
              irrigationType: employment.irrigationType || undefined,
              agriculturalIncome: numberOr(employment.agriculturalIncome),
              landLocationVillage: employment.landLocationVillage || undefined,
              occupation: employment.occupation || undefined,
            },
          };
        }),
      };

      await updateSchoolLoanDetails({
        loanApplicationId,
        data: payload,
      }).unwrap();

      toast.success("Employment details saved");
      onNext();
    } catch (error) {
      console.error("STEP 3 (employment) SAVE ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to save employment details",
      );
    }
  }

  if (isFetching) {
    return (
      <LoanWizardShell
        step={3}
        totalSteps={7}
        title="Employment & Income"
        description="Loading your saved information..."
      >
        <div className="space-y-6">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-56 w-full rounded-lg" />
        </div>
      </LoanWizardShell>
    );
  }

  if (isFetchError || !savedCoApplicants.length) {
    return (
      <LoanWizardShell
        step={3}
        totalSteps={7}
        title="Employment & Income"
        description={
          fetchError?.data?.message ||
          "Add at least one co-applicant in the previous step first."
        }
      >
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-6 text-amber-900">
            Employment and income information is collected for each
            co-applicant. Please complete the previous step before continuing.
          </p>
        </div>

        <LoanWizardActions onBack={onBack} />
      </LoanWizardShell>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <LoanWizardShell
        step={3}
        totalSteps={7}
        title="Employment & Income"
        description="Tell us how each co-applicant earns their income. This helps us assess repayment capacity."
      >
        <div className="space-y-10">
          {fields.map((field, index) => {
            const employmentType = watched?.[index]?.employment?.employmentType;

            const person = savedCoApplicants[index];

            return (
              <section
                key={field.id}
                className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
              >
                {/* Applicant Header */}
                <div className="border-b border-border bg-muted/30 px-5 py-5 sm:px-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        Co-applicant {index + 1}
                      </p>

                      <h3 className="mt-1 text-base font-semibold text-foreground">
                        {relationLabel(person?.relation)}
                        {person?.fullName ? ` — ${person.fullName}` : ""}
                      </h3>
                    </div>

                    <div className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
                      Income details
                    </div>
                  </div>
                </div>

                {/* Employment Content */}
                <div className="space-y-8 p-5 sm:p-6">
                  {/* Employment Type */}
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">
                        Employment type
                      </h4>

                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Select the option that best describes the co-applicant's
                        primary source of income.
                      </p>
                    </div>

                    <FormField
                      label="Employment type"
                      required
                      error={
                        errors.coApplicants?.[index]?.employment?.employmentType
                          ?.message
                      }
                    >
                      <select
                        className={selectClassName}
                        {...register(
                          `coApplicants.${index}.employment.employmentType`,
                        )}
                      >
                        <option value="SALARIED">Salaried</option>
                        <option value="BUSINESS">Business</option>
                        <option value="FARMER">Farmer</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </FormField>
                  </div>

                  {/* Salaried */}
                  {employmentType === "SALARIED" ? (
                    <div className="space-y-5 border-t border-border pt-7">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Employment details
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Provide details about the employer and current salary.
                        </p>
                      </div>

                      <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                        <FormInput
                          label="Employer name"
                          required
                          placeholder="Company or organisation name"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.companyName
                          }
                          {...register(
                            `coApplicants.${index}.employment.companyName`,
                          )}
                        />

                        <FormInput
                          label="Industry type"
                          helperText="Optional"
                          placeholder="e.g. IT, Manufacturing, Education"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.industryType
                          }
                          {...register(
                            `coApplicants.${index}.employment.industryType`,
                          )}
                        />

                        <FormInput
                          label="Designation"
                          required
                          placeholder="e.g. Manager, Teacher, Engineer"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.designation
                          }
                          {...register(
                            `coApplicants.${index}.employment.designation`,
                          )}
                        />

                        <FormInput
                          label="Date of joining"
                          type="date"
                          helperText="Optional"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.dateOfJoining
                          }
                          {...register(
                            `coApplicants.${index}.employment.dateOfJoining`,
                          )}
                        />

                        <FormInput
                          label="Monthly net salary (₹)"
                          required
                          inputMode="numeric"
                          placeholder="e.g. 45000"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.monthlyIncome
                          }
                          {...register(
                            `coApplicants.${index}.employment.monthlyIncome`,
                          )}
                        />

                        <FormInput
                          label="Previous year's income (₹)"
                          helperText="Optional"
                          inputMode="numeric"
                          placeholder="e.g. 500000"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.previousYearIncome
                          }
                          {...register(
                            `coApplicants.${index}.employment.previousYearIncome`,
                          )}
                        />

                        <FormInput
                          label="Salary account bank"
                          helperText="Optional"
                          placeholder="e.g. State Bank of India"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.salaryAccountBank
                          }
                          {...register(
                            `coApplicants.${index}.employment.salaryAccountBank`,
                          )}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Business */}
                  {employmentType === "BUSINESS" ? (
                    <div className="border-t border-border pt-7">
                      <BusinessFields
                        index={index}
                        register={register}
                        control={control}
                        errors={errors}
                      />
                    </div>
                  ) : null}

                  {/* Farmer */}
                  {employmentType === "FARMER" ? (
                    <div className="space-y-5 border-t border-border pt-7">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Agricultural details
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Provide information about the land, crops and
                          agricultural income.
                        </p>
                      </div>

                      <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                        <FormInput
                          label="Land area"
                          required
                          inputMode="numeric"
                          placeholder="e.g. 5"
                          error={
                            errors.coApplicants?.[index]?.employment?.landArea
                          }
                          {...register(
                            `coApplicants.${index}.employment.landArea`,
                          )}
                        />

                        <FormInput
                          label="Land unit"
                          helperText="e.g. Acres, Hectares"
                          placeholder="Acres"
                          error={
                            errors.coApplicants?.[index]?.employment?.landUnit
                          }
                          {...register(
                            `coApplicants.${index}.employment.landUnit`,
                          )}
                        />

                        <FormField
                          label="Land ownership"
                          required
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.landOwnership?.message
                          }
                        >
                          <select
                            className={selectClassName}
                            {...register(
                              `coApplicants.${index}.employment.landOwnership`,
                            )}
                          >
                            <option value="OWNED">Owned</option>
                            <option value="LEASED">Leased</option>
                            <option value="PARTIALLY_OWNED_LEASED">
                              Partially owned / leased
                            </option>
                          </select>
                        </FormField>

                        <FormInput
                          label="Cultivated area"
                          helperText="Optional"
                          inputMode="numeric"
                          placeholder="e.g. 4"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.cultivatedArea
                          }
                          {...register(
                            `coApplicants.${index}.employment.cultivatedArea`,
                          )}
                        />

                        <FormInput
                          label="Primary crop type"
                          required
                          placeholder="e.g. Cotton"
                          error={
                            errors.coApplicants?.[index]?.employment?.cropType
                          }
                          {...register(
                            `coApplicants.${index}.employment.cropType`,
                          )}
                        />

                        <FormInput
                          label="Other crop types"
                          helperText="Optional"
                          placeholder="e.g. Soybean, Wheat"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.otherCropTypes
                          }
                          {...register(
                            `coApplicants.${index}.employment.otherCropTypes`,
                          )}
                        />

                        <FormInput
                          label="Irrigation type"
                          helperText="Optional"
                          placeholder="e.g. Borewell, Canal"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.irrigationType
                          }
                          {...register(
                            `coApplicants.${index}.employment.irrigationType`,
                          )}
                        />

                        <FormInput
                          label="Village"
                          helperText="Optional"
                          placeholder="Village name"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.landLocationVillage
                          }
                          {...register(
                            `coApplicants.${index}.employment.landLocationVillage`,
                          )}
                        />

                        <FormInput
                          label="Agricultural income (₹/year)"
                          required
                          inputMode="numeric"
                          placeholder="e.g. 300000"
                          error={
                            errors.coApplicants?.[index]?.employment
                              ?.agriculturalIncome
                          }
                          {...register(
                            `coApplicants.${index}.employment.agriculturalIncome`,
                          )}
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Other */}
                  {employmentType === "OTHER" ? (
                    <div className="space-y-5 border-t border-border pt-7">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          Occupation details
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Tell us about the co-applicant's primary occupation.
                        </p>
                      </div>

                      <div className="grid gap-5 md:grid-cols-2">
                        <FormInput
                          label="Occupation"
                          required
                          placeholder="e.g. Freelancer, Consultant"
                          error={
                            errors.coApplicants?.[index]?.employment?.occupation
                          }
                          {...register(
                            `coApplicants.${index}.employment.occupation`,
                          )}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            );
          })}
        </div>

        <LoanWizardActions onBack={onBack} backDisabled={isUpdating}>
          <Button
            type="submit"
            size="lg"
            disabled={isUpdating}
            loading={isUpdating}
            className="w-full min-w-40 sm:w-auto"
          >
            {isUpdating ? "Saving..." : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

function BusinessFields({ index, register, control, errors }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `coApplicants.${index}.employment.registrations`,
  });

  return (
    <div className="space-y-7">
      <div>
        <h4 className="text-sm font-semibold text-foreground">
          Business details
        </h4>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Provide information about the business and its financial position.
        </p>
      </div>

      <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
        <FormInput
          label="Business name"
          required
          placeholder="Registered or trading name"
          error={errors.coApplicants?.[index]?.employment?.businessName}
          {...register(`coApplicants.${index}.employment.businessName`)}
        />

        <FormInput
          label="Business type"
          required
          placeholder="e.g. Proprietorship, Partnership"
          error={errors.coApplicants?.[index]?.employment?.businessType}
          {...register(`coApplicants.${index}.employment.businessType`)}
        />

        <FormInput
          label="Business category"
          helperText="Optional"
          placeholder="e.g. Retail, Manufacturing"
          error={errors.coApplicants?.[index]?.employment?.businessCategory}
          {...register(`coApplicants.${index}.employment.businessCategory`)}
        />

        <FormInput
          label="Business start date"
          type="date"
          helperText="Optional"
          error={errors.coApplicants?.[index]?.employment?.businessStartDate}
          {...register(`coApplicants.${index}.employment.businessStartDate`)}
        />

        <FormInput
          label="Number of employees"
          helperText="Optional"
          inputMode="numeric"
          placeholder="e.g. 8"
          error={errors.coApplicants?.[index]?.employment?.numberOfEmployees}
          {...register(`coApplicants.${index}.employment.numberOfEmployees`)}
        />

        <FormInput
          label="Number of branches"
          helperText="Optional"
          inputMode="numeric"
          placeholder="e.g. 2"
          error={errors.coApplicants?.[index]?.employment?.numberOfBranches}
          {...register(`coApplicants.${index}.employment.numberOfBranches`)}
        />

        <FormInput
          label="Years at current location"
          helperText="Optional"
          inputMode="numeric"
          placeholder="e.g. 5"
          error={
            errors.coApplicants?.[index]?.employment?.yearsAtBusinessLocation
          }
          {...register(
            `coApplicants.${index}.employment.yearsAtBusinessLocation`,
          )}
        />

        <FormInput
          label="Annual turnover (₹)"
          helperText="Optional"
          inputMode="numeric"
          placeholder="e.g. 2500000"
          error={errors.coApplicants?.[index]?.employment?.annualTurnover}
          {...register(`coApplicants.${index}.employment.annualTurnover`)}
        />

        <FormInput
          label="Annual net income (₹)"
          required
          inputMode="numeric"
          placeholder="e.g. 600000"
          error={errors.coApplicants?.[index]?.employment?.annualIncome}
          {...register(`coApplicants.${index}.employment.annualIncome`)}
        />

        <FormInput
          label="Current year's estimated income (₹)"
          helperText="Optional"
          inputMode="numeric"
          placeholder="e.g. 700000"
          error={
            errors.coApplicants?.[index]?.employment?.currentYearEstimatedIncome
          }
          {...register(
            `coApplicants.${index}.employment.currentYearEstimatedIncome`,
          )}
        />
      </div>

      {/* Registrations */}
      <div className="border-t border-border pt-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Business registrations
            </h4>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Optional. Add GST, Udyam or other registrations if applicable.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                registrationType: "GST",
                registrationNumber: "",
              })
            }
            className="w-full sm:w-auto"
          >
            + Add registration
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/20 px-4 py-5">
            <p className="text-sm text-muted-foreground">
              No business registrations added.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {fields.map((field, regIndex) => (
              <div
                key={field.id}
                className="rounded-lg border border-border bg-muted/20 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.5fr)_auto] sm:items-end">
                  <FormField label="Registration type">
                    <select
                      className={selectClassName}
                      {...register(
                        `coApplicants.${index}.employment.registrations.${regIndex}.registrationType`,
                      )}
                    >
                      <option value="GST">GST</option>
                      <option value="UDYAM">Udyam</option>
                      <option value="SHOP_ESTABLISHMENT">
                        Shop & Establishment
                      </option>
                      <option value="TRADE_LICENSE">Trade License</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </FormField>

                  <FormInput
                    label="Registration number"
                    placeholder="Enter registration number"
                    {...register(
                      `coApplicants.${index}.employment.registrations.${regIndex}.registrationNumber`,
                    )}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(regIndex)}
                    className="w-full sm:w-auto"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmploymentIncomeStep;
