import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";

import {
  useGetStudentLoanDetailsQuery,
  useUpdateStudentLoanDetailsMutation,
} from "../api/studentLoanApi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/common/FormInput";
import FormField from "@/components/common/FormField";
import {
  LoanWizardShell,
  LoanWizardActions,
  selectClassName,
} from "./LoanWizardShell";

/* =========================================================
   Helpers
========================================================= */

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number) ? value : number;
}, z.number().nonnegative().optional());

const optionalPositiveNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number) ? value : number;
}, z.number().positive().optional());

const optionalInteger = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number) ? value : number;
}, z.number().int().nonnegative().optional());

const optionalPositiveInteger = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }

  const number = Number(value);

  return Number.isNaN(number) ? value : number;
}, z.number().int().positive().optional());

/* =========================================================
   Employment Schema
========================================================= */

const employmentSchema = z
  .object({
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
    companyName: z.string().trim().optional(),
    designation: z.string().trim().optional(),
    monthlyIncome: optionalNumber,
    experienceYears: optionalInteger,

    // Business
    businessName: z.string().trim().optional(),
    businessType: z.string().trim().optional(),
    annualTurnover: optionalNumber,
    annualIncome: optionalNumber,

    // Farmer
    landHoldingAcres: optionalNumber,
    cropType: z.string().trim().optional(),
    agriculturalIncome: optionalNumber,

    // Contract
    employerName: z.string().trim().optional(),
    contractDurationMonths: optionalPositiveInteger,

    // Other
    occupation: z.string().trim().optional(),
  })
  .superRefine((employment, ctx) => {
    if (employment.employmentType === "SALARIED") {
      if (!employment.companyName) {
        ctx.addIssue({
          code: "custom",
          path: ["companyName"],
          message: "Company name is required",
        });
      }

      if (!employment.designation) {
        ctx.addIssue({
          code: "custom",
          path: ["designation"],
          message: "Designation is required",
        });
      }

      if (employment.monthlyIncome === undefined) {
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

      if (employment.annualIncome === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["annualIncome"],
          message: "Annual income is required",
        });
      }
    }

    if (employment.employmentType === "FARMER") {
      if (employment.landHoldingAcres === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["landHoldingAcres"],
          message: "Land holding is required",
        });
      }

      if (!employment.cropType) {
        ctx.addIssue({
          code: "custom",
          path: ["cropType"],
          message: "Crop type is required",
        });
      }

      if (employment.agriculturalIncome === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["agriculturalIncome"],
          message: "Agricultural income is required",
        });
      }
    }

    if (employment.employmentType === "CONTRACT") {
      if (!employment.employerName) {
        ctx.addIssue({
          code: "custom",
          path: ["employerName"],
          message: "Employer name is required",
        });
      }

      if (employment.contractDurationMonths === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["contractDurationMonths"],
          message: "Contract duration is required",
        });
      }
    }

    if (employment.employmentType === "OTHER") {
      if (!employment.occupation) {
        ctx.addIssue({
          code: "custom",
          path: ["occupation"],
          message: "Occupation is required",
        });
      }
    }
  });

/* =========================================================
   Parent Schema
========================================================= */

const parentSchema = z.object({
  relation: z.enum(["FATHER", "MOTHER"]),

  fullName: z
    .string()
    .trim()
    .min(2, "Parent name must be at least 2 characters"),

  mobile: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  aadhaarNumber: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Aadhaar must contain 12 digits")
    .optional()
    .or(z.literal("")),

  panNumber: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid PAN number")
    .optional()
    .or(z.literal("")),

  isCoApplicant: z.boolean().default(false),

  employment: employmentSchema,
});

/* =========================================================
   Form Schema
========================================================= */

const formSchema = z
  .object({
    parents: z
      .array(parentSchema)
      .min(1, "At least one parent is required")
      .max(2, "Maximum two parents are allowed"),
  })
  .superRefine((values, ctx) => {
    const relations = values.parents.map((parent) => parent.relation);

    if (new Set(relations).size !== relations.length) {
      ctx.addIssue({
        code: "custom",
        path: ["parents"],
        message: "Father or Mother can only be added once",
      });
    }
  });

/* =========================================================
   Empty Parent
========================================================= */

const emptyParent = {
  relation: "FATHER",
  fullName: "",
  mobile: "",
  aadhaarNumber: "",
  panNumber: "",
  isCoApplicant: false,

  employment: {
    employmentType: "SALARIED",

    companyName: "",
    designation: "",
    monthlyIncome: "",
    experienceYears: "",

    businessName: "",
    businessType: "",
    annualTurnover: "",
    annualIncome: "",

    landHoldingAcres: "",
    cropType: "",
    agriculturalIncome: "",

    employerName: "",
    contractDurationMonths: "",

    occupation: "",
  },
};

/* =========================================================
   Component
========================================================= */

function ParentDetailsStep({ loanApplicationId, onBack, onNext }) {
  const {
    data,
    isLoading: isFetching,
    isError: isFetchError,
    error: fetchError,
  } = useGetStudentLoanDetailsQuery(loanApplicationId, {
    skip: !loanApplicationId,
  });

  const [updateStudentLoanDetails, { isLoading: isUpdating }] =
    useUpdateStudentLoanDetailsMutation();

  const existingDetails = data?.data;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parents: [emptyParent],
    },
    mode: "onSubmit",
  });

  const {
    fields: parentFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "parents",
  });

  const parents = watch("parents");

  /* =========================================================
     Load Existing Parents
  ========================================================= */

  useEffect(() => {
    if (!existingDetails) return;

    if (existingDetails.parents?.length > 0) {
      reset({
        parents: existingDetails.parents.map((parent) => ({
          relation: parent.relation,

          fullName: parent.fullName || "",
          mobile: parent.mobile || "",
          aadhaarNumber: parent.aadhaarNumber || "",
          panNumber: parent.panNumber || "",
          isCoApplicant: parent.isCoApplicant ?? false,

          employment: {
            employmentType: parent.employment?.employmentType || "SALARIED",

            companyName: parent.employment?.companyName || "",
            designation: parent.employment?.designation || "",
            monthlyIncome: parent.employment?.monthlyIncome ?? "",
            experienceYears: parent.employment?.experienceYears ?? "",

            businessName: parent.employment?.businessName || "",
            businessType: parent.employment?.businessType || "",
            annualTurnover: parent.employment?.annualTurnover ?? "",
            annualIncome: parent.employment?.annualIncome ?? "",

            landHoldingAcres: parent.employment?.landHoldingAcres ?? "",
            cropType: parent.employment?.cropType || "",
            agriculturalIncome: parent.employment?.agriculturalIncome ?? "",

            employerName: parent.employment?.employerName || "",
            contractDurationMonths:
              parent.employment?.contractDurationMonths ?? "",

            occupation: parent.employment?.occupation || "",
          },
        })),
      });
    } else {
      reset({
        parents: [emptyParent],
      });
    }
  }, [existingDetails, reset]);

  /* =========================================================
     Add Parent
  ========================================================= */

  function addParent() {
    if (parentFields.length >= 2) {
      toast.error("You can add only Father and Mother");
      return;
    }

    const existingRelations = parents.map((parent) => parent.relation);

    const nextRelation = existingRelations.includes("FATHER")
      ? "MOTHER"
      : "FATHER";

    append({
      ...emptyParent,
      relation: nextRelation,
    });
  }

  /* =========================================================
     Remove Parent
  ========================================================= */

  function removeParent(index) {
    if (parentFields.length <= 1) {
      toast.error("At least one parent is required");
      return;
    }

    remove(index);
  }

  /* =========================================================
     Employment Fields
  ========================================================= */

  function getEmploymentFields(index) {
    const type = parents?.[index]?.employment?.employmentType;

    if (type === "SALARIED") {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Company Name"
            error={errors.parents?.[index]?.employment?.companyName}
            {...register(`parents.${index}.employment.companyName`)}
          />

          <FormInput
            label="Designation"
            error={errors.parents?.[index]?.employment?.designation}
            {...register(`parents.${index}.employment.designation`)}
          />

          <FormInput
            label="Monthly Income"
            type="number"
            min="0"
            error={errors.parents?.[index]?.employment?.monthlyIncome}
            {...register(`parents.${index}.employment.monthlyIncome`)}
          />

          <FormInput
            label="Experience (Years)"
            type="number"
            min="0"
            error={errors.parents?.[index]?.employment?.experienceYears}
            {...register(`parents.${index}.employment.experienceYears`)}
          />
        </div>
      );
    }

    if (type === "BUSINESS") {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Business Name"
            error={errors.parents?.[index]?.employment?.businessName}
            {...register(`parents.${index}.employment.businessName`)}
          />

          <FormInput
            label="Business Type"
            error={errors.parents?.[index]?.employment?.businessType}
            {...register(`parents.${index}.employment.businessType`)}
          />

          <FormInput
            label="Annual Turnover"
            type="number"
            min="0"
            error={errors.parents?.[index]?.employment?.annualTurnover}
            {...register(`parents.${index}.employment.annualTurnover`)}
          />

          <FormInput
            label="Annual Income"
            type="number"
            min="0"
            error={errors.parents?.[index]?.employment?.annualIncome}
            {...register(`parents.${index}.employment.annualIncome`)}
          />
        </div>
      );
    }

    if (type === "FARMER") {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Land Holding (Acres)"
            type="number"
            min="0"
            error={errors.parents?.[index]?.employment?.landHoldingAcres}
            {...register(`parents.${index}.employment.landHoldingAcres`)}
          />

          <FormInput
            label="Crop Type"
            error={errors.parents?.[index]?.employment?.cropType}
            {...register(`parents.${index}.employment.cropType`)}
          />

          <FormInput
            label="Agricultural Income"
            type="number"
            min="0"
            error={errors.parents?.[index]?.employment?.agriculturalIncome}
            {...register(`parents.${index}.employment.agriculturalIncome`)}
          />
        </div>
      );
    }

    if (type === "CONTRACT") {
      return (
        <div className="grid gap-5 md:grid-cols-2">
          <FormInput
            label="Employer Name"
            error={errors.parents?.[index]?.employment?.employerName}
            {...register(`parents.${index}.employment.employerName`)}
          />

          <FormInput
            label="Contract Duration (Months)"
            type="number"
            min="1"
            error={errors.parents?.[index]?.employment?.contractDurationMonths}
            {...register(`parents.${index}.employment.contractDurationMonths`)}
          />
        </div>
      );
    }

    if (type === "OTHER") {
      return (
        <FormInput
          label="Occupation"
          error={errors.parents?.[index]?.employment?.occupation}
          {...register(`parents.${index}.employment.occupation`)}
        />
      );
    }

    if (type === "SELF_EMPLOYED") {
      return (
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground">
            Self-employed employment details can be added here if required.
          </p>
        </div>
      );
    }

    if (type === "RETIRED") {
      return (
        <div className="rounded-lg border border-dashed p-4">
          <p className="text-sm text-muted-foreground">
            No additional employment information is required for retired
            applicants.
          </p>
        </div>
      );
    }

    return null;
  }

  /* =========================================================
     Submit
  ========================================================= */

  async function onSubmit(values) {
    if (!loanApplicationId) {
      toast.error("Loan application ID is missing.");
      return;
    }

    try {
      const payload = {
        parents: values.parents.map((parent) => {
          const employment = parent.employment;

          return {
            relation: parent.relation,
            fullName: parent.fullName.trim(),
            mobile: parent.mobile.trim(),

            aadhaarNumber: parent.aadhaarNumber?.trim() || undefined,

            panNumber: parent.panNumber?.trim().toUpperCase() || undefined,

            isCoApplicant: Boolean(parent.isCoApplicant),

            employment: {
              employmentType: employment.employmentType,

              companyName: employment.companyName?.trim() || undefined,

              designation: employment.designation?.trim() || undefined,

              monthlyIncome:
                employment.monthlyIncome === undefined
                  ? undefined
                  : Number(employment.monthlyIncome),

              experienceYears:
                employment.experienceYears === undefined
                  ? undefined
                  : Number(employment.experienceYears),

              businessName: employment.businessName?.trim() || undefined,

              businessType: employment.businessType?.trim() || undefined,

              annualTurnover:
                employment.annualTurnover === undefined
                  ? undefined
                  : Number(employment.annualTurnover),

              annualIncome:
                employment.annualIncome === undefined
                  ? undefined
                  : Number(employment.annualIncome),

              landHoldingAcres:
                employment.landHoldingAcres === undefined
                  ? undefined
                  : Number(employment.landHoldingAcres),

              cropType: employment.cropType?.trim() || undefined,

              agriculturalIncome:
                employment.agriculturalIncome === undefined
                  ? undefined
                  : Number(employment.agriculturalIncome),

              employerName: employment.employerName?.trim() || undefined,

              contractDurationMonths:
                employment.contractDurationMonths === undefined
                  ? undefined
                  : Number(employment.contractDurationMonths),

              occupation: employment.occupation?.trim() || undefined,
            },
          };
        }),
      };

      const response = await updateStudentLoanDetails({
        loanApplicationId,
        data: payload,
      }).unwrap();

      toast.success(response?.message || "Parent details saved successfully");

      onNext();
    } catch (error) {
      console.error("STEP 3 SAVE ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to save parent details",
      );
    }
  }

  /* =========================================================
     Loading
  ========================================================= */

  if (isFetching) {
    return (
      <LoanWizardShell
        step={3}
        title="Parent & Co-Applicant Details"
        description="Loading..."
      >
        <Skeleton className="h-64 w-full" />
      </LoanWizardShell>
    );
  }

  if (isFetchError) {
    return (
      <LoanWizardShell
        step={3}
        title="Parent & Co-Applicant Details"
        description={fetchError?.data?.message || "Please try again."}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <LoanWizardShell
        step={3}
        title="Parent & Co-Applicant Details"
        description="Add at least one parent and their employment information."
      >
        {errors.parents?.message ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{errors.parents.message}</p>
          </div>
        ) : null}

        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="subsection-title">Parent details</h3>
              <p className="text-helper">
                You can add Father, Mother, or both.
              </p>
            </div>

            {parentFields.length < 2 ? (
              <Button type="button" variant="outline" onClick={addParent}>
                + Add{" "}
                {parents?.some((parent) => parent.relation === "FATHER")
                  ? "Mother"
                  : "Father"}
              </Button>
            ) : null}
          </div>

          <div className="space-y-8">
            {parentFields.map((field, index) => {
              const relation = parents?.[index]?.relation;

              return (
                <div
                  key={field.id}
                  className="space-y-6 border-t pt-6 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold">
                        {relation === "MOTHER" ? "Mother" : "Father"}
                      </h4>
                      <p className="text-caption text-muted-foreground">
                        Parent information
                      </p>
                    </div>

                    {parentFields.length > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeParent(index)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      label="Relation"
                      error={errors.parents?.[index]?.relation?.message}
                    >
                      <select
                        className={selectClassName}
                        {...register(`parents.${index}.relation`)}
                      >
                        <option value="FATHER">Father</option>
                        <option value="MOTHER">Mother</option>
                      </select>
                    </FormField>

                    <FormInput
                      label="Full name"
                      placeholder="Parent full name"
                      required
                      error={errors.parents?.[index]?.fullName}
                      {...register(`parents.${index}.fullName`)}
                    />

                    <FormInput
                      label="Mobile number"
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      required
                      error={errors.parents?.[index]?.mobile}
                      {...register(`parents.${index}.mobile`)}
                    />

                    <FormInput
                      label="Aadhaar number"
                      helperText="Optional"
                      inputMode="numeric"
                      maxLength={12}
                      placeholder="12-digit Aadhaar"
                      error={errors.parents?.[index]?.aadhaarNumber}
                      {...register(`parents.${index}.aadhaarNumber`)}
                    />

                    <FormInput
                      label="PAN number"
                      helperText="Optional"
                      maxLength={10}
                      placeholder="ABCDE1234F"
                      className="uppercase"
                      error={errors.parents?.[index]?.panNumber}
                      {...register(`parents.${index}.panNumber`)}
                    />

                    <label className="flex items-center gap-3 rounded-lg border p-3 md:col-span-2">
                      <input
                        type="checkbox"
                        className="size-4"
                        {...register(`parents.${index}.isCoApplicant`)}
                      />

                      <div>
                        <p className="text-sm font-medium">
                          This parent is a co-applicant
                        </p>
                        <p className="text-caption text-muted-foreground">
                          Select if the parent will be financially responsible
                          for the loan.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <div>
                      <h4 className="text-sm font-semibold">
                        Employment details
                      </h4>
                      <p className="text-caption text-muted-foreground">
                        Required for this parent.
                      </p>
                    </div>

                    <FormField
                      label="Employment type"
                      error={
                        errors.parents?.[index]?.employment?.employmentType
                          ?.message
                      }
                      required
                    >
                      <select
                        className={selectClassName}
                        {...register(
                          `parents.${index}.employment.employmentType`,
                        )}
                      >
                        <option value="SALARIED">Salaried</option>
                        <option value="SELF_EMPLOYED">Self Employed</option>
                        <option value="BUSINESS">Business</option>
                        <option value="FARMER">Farmer</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="RETIRED">Retired</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </FormField>

                    {getEmploymentFields(index)}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <LoanWizardActions onBack={onBack} backDisabled={isUpdating}>
          <Button
            type="submit"
            size="lg"
            disabled={isUpdating}
            loading={isUpdating}
            className="w-full sm:w-auto"
          >
            {isUpdating ? "Saving..." : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

export default ParentDetailsStep;
