import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { BriefcaseBusiness, MapPin, UserRound, UsersRound } from "lucide-react";

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

const addressSchema = z.object({
  line1: z.string().trim().min(3, "Address line 1 is required"),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, "City is required"),
  taluka: z.string().trim().optional(),
  district: z.string().trim().optional(),
  state: z.string().trim().min(2, "State is required"),
  pincode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});

const coApplicantSchema = z.object({
  relation: z.enum(["FATHER", "MOTHER", "GUARDIAN", "OTHER"]),
  fullName: z.string().trim().min(2, "Full name is required"),
  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "OTHER"]).optional(),
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
  numberOfDependents: z.string().trim().optional(),
  numberOfEarningMembers: z.string().trim().optional(),
  familyMonthlyIncome: z
    .string()
    .trim()
    .min(1, "Family monthly income is required"),
  currentAddress: addressSchema,
  sameAsCurrentAddress: z.boolean().default(false),
  permanentAddress: z.object({
    line1: z.string().trim().optional(),
    line2: z.string().trim().optional(),
    city: z.string().trim().optional(),
    taluka: z.string().trim().optional(),
    district: z.string().trim().optional(),
    state: z.string().trim().optional(),
    pincode: z.string().trim().optional(),
  }),
  yearsAtCurrentAddress: z.string().trim().optional(),
});

const formSchema = z
  .object({
    coApplicants: z
      .array(coApplicantSchema)
      .min(1, "At least one co-applicant is required")
      .max(2, "Maximum two co-applicants are allowed"),
  })
  .superRefine((values, ctx) => {
    const relations = values.coApplicants.map((person) => person.relation);

    if (new Set(relations).size !== relations.length) {
      ctx.addIssue({
        code: "custom",
        path: ["coApplicants"],
        message:
          "Each relation (Father, Mother, Guardian, Other) can only be added once",
      });
    }

    values.coApplicants.forEach((person, index) => {
      if (
        !person.sameAsCurrentAddress &&
        (!person.permanentAddress.line1 || !person.permanentAddress.pincode)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["coApplicants", index, "permanentAddress", "line1"],
          message: "Permanent address is required unless same as current",
        });
      }
    });
  });

const emptyAddress = {
  line1: "",
  line2: "",
  city: "",
  taluka: "",
  district: "",
  state: "",
  pincode: "",
};

const emptyCoApplicant = {
  relation: "FATHER",
  fullName: "",
  mobile: "",
  gender: "MALE",
  dateOfBirth: "",
  maritalStatus: "MARRIED",
  aadhaarNumber: "",
  panNumber: "",
  isCoApplicant: true,
  numberOfDependents: "",
  numberOfEarningMembers: "",
  familyMonthlyIncome: "",
  currentAddress: emptyAddress,
  sameAsCurrentAddress: true,
  permanentAddress: emptyAddress,
  yearsAtCurrentAddress: "",
};

function toDateInputValue(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

function addressFromExisting(address) {
  if (!address) return emptyAddress;

  return {
    line1: address.line1 || "",
    line2: address.line2 || "",
    city: address.city || "",
    taluka: address.taluka || "",
    district: address.district || "",
    state: address.state || "",
    pincode: address.pincode || "",
  };
}

function relationLabel(value) {
  const labels = {
    FATHER: "Father",
    MOTHER: "Mother",
    GUARDIAN: "Guardian",
    OTHER: "Other",
  };

  return labels[value] || "Co-applicant";
}

function CoApplicantStep({ loanApplicationId, onBack, onNext }) {
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

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { coApplicants: [emptyCoApplicant] },
    mode: "onSubmit",
  });

  const {
    fields: coApplicantFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "coApplicants",
  });

  const coApplicants = watch("coApplicants");

  useEffect(() => {
    if (!existingDetails) return;

    if (existingDetails.coApplicants?.length > 0) {
      reset({
        coApplicants: existingDetails.coApplicants.map((person) => ({
          relation: person.relation,
          fullName: person.fullName || "",
          mobile: person.mobile || "",
          gender: person.gender || "MALE",
          dateOfBirth: toDateInputValue(person.dateOfBirth),
          maritalStatus: person.maritalStatus || "MARRIED",
          aadhaarNumber: person.aadhaarNumber || "",
          panNumber: person.panNumber || "",
          isCoApplicant: person.isCoApplicant ?? false,
          numberOfDependents:
            person.numberOfDependents != null
              ? String(person.numberOfDependents)
              : "",
          numberOfEarningMembers:
            person.numberOfEarningMembers != null
              ? String(person.numberOfEarningMembers)
              : "",
          familyMonthlyIncome:
            person.familyMonthlyIncome != null
              ? String(person.familyMonthlyIncome)
              : "",
          currentAddress: addressFromExisting(person.currentAddress),
          sameAsCurrentAddress: person.sameAsCurrentAddress ?? true,
          permanentAddress: addressFromExisting(person.permanentAddress),
          yearsAtCurrentAddress:
            person.yearsAtCurrentAddress != null
              ? String(person.yearsAtCurrentAddress)
              : "",
        })),
      });
    }
  }, [existingDetails, reset]);

  function addCoApplicant() {
    if (coApplicantFields.length >= 2) {
      toast.error("You can add a maximum of two co-applicants");
      return;
    }

    const usedRelations = coApplicants.map((person) => person.relation);

    const nextRelation = ["FATHER", "MOTHER", "GUARDIAN", "OTHER"].find(
      (relation) => !usedRelations.includes(relation),
    );

    append({
      ...emptyCoApplicant,
      relation: nextRelation || "OTHER",
    });
  }

  async function onSubmit(values) {
    try {
      const payload = {
        coApplicants: values.coApplicants.map((person) => ({
          relation: person.relation,
          fullName: person.fullName,
          mobile: person.mobile,
          gender: person.gender,
          dateOfBirth: person.dateOfBirth,
          maritalStatus: person.maritalStatus,
          aadhaarNumber: person.aadhaarNumber || undefined,
          panNumber: person.panNumber || undefined,
          isCoApplicant: person.isCoApplicant,
          numberOfDependents: person.numberOfDependents
            ? Number(person.numberOfDependents)
            : undefined,
          numberOfEarningMembers: person.numberOfEarningMembers
            ? Number(person.numberOfEarningMembers)
            : undefined,
          familyMonthlyIncome: Number(person.familyMonthlyIncome),
          currentAddress: person.currentAddress,
          sameAsCurrentAddress: person.sameAsCurrentAddress,
          permanentAddress: person.sameAsCurrentAddress
            ? undefined
            : person.permanentAddress,
          yearsAtCurrentAddress: person.yearsAtCurrentAddress
            ? Number(person.yearsAtCurrentAddress)
            : undefined,
        })),
      };

      await updateSchoolLoanDetails({
        loanApplicationId,
        data: payload,
      }).unwrap();

      toast.success("Co-applicant details saved");
      onNext();
    } catch (error) {
      console.error("STEP 2 (co-applicant) SAVE ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to save co-applicant details",
      );
    }
  }

  if (isFetching) {
    return (
      <LoanWizardShell
        step={2}
        totalSteps={7}
        title="Parent / Co-Applicant"
        description="Loading..."
      >
        <div className="rounded-lg border bg-background p-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </LoanWizardShell>
    );
  }

  if (isFetchError) {
    return (
      <LoanWizardShell
        step={2}
        totalSteps={7}
        title="Parent / Co-Applicant"
        description={fetchError?.data?.message || "Please try again."}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <LoanWizardShell
        step={2}
        totalSteps={7}
        title="Parent / Co-Applicant"
        description="The student is the beneficiary; the parent or guardian is the financial co-applicant."
      >
        <div className="space-y-7">
          {/* Validation Message */}
          {errors.coApplicants?.message ? (
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3">
              <p className="text-sm font-medium text-destructive">
                {errors.coApplicants.message}
              </p>
            </div>
          ) : null}

          {/* Header */}
          <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Co-applicants
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Add up to two parents, guardians, or other eligible
                co-applicants.
              </p>
            </div>

            {coApplicantFields.length < 2 ? (
              <Button
                type="button"
                variant="outline"
                onClick={addCoApplicant}
                className="w-full sm:w-auto"
              >
                + Add another
              </Button>
            ) : null}
          </div>

          {/* Co-applicants */}
          <div className="space-y-8">
            {coApplicantFields.map((field, index) => {
              const sameAsCurrent = coApplicants?.[index]?.sameAsCurrentAddress;

              const currentRelation = coApplicants?.[index]?.relation;

              return (
                <section
                  key={field.id}
                  className="overflow-hidden rounded-lg border bg-background"
                >
                  {/* Applicant Header */}
                  <div className="flex items-center justify-between gap-4 border-b bg-muted/20 px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <UserRound className="size-4" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Co-applicant {index + 1}
                        </p>

                        <h4 className="truncate text-sm font-semibold text-foreground">
                          {relationLabel(currentRelation)}
                        </h4>
                      </div>
                    </div>

                    {coApplicantFields.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>

                  <div className="space-y-9 p-5 sm:p-6">
                    {/* Personal Details */}
                    <section>
                      <div className="mb-5 flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <UserRound className="size-4" />
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-foreground">
                            Personal details
                          </h4>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Identity and contact information.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                        <FormField
                          label="Relation"
                          required
                          error={
                            errors.coApplicants?.[index]?.relation?.message
                          }
                        >
                          <select
                            className={selectClassName}
                            {...register(`coApplicants.${index}.relation`)}
                          >
                            <option value="FATHER">Father</option>
                            <option value="MOTHER">Mother</option>
                            <option value="GUARDIAN">Guardian</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </FormField>

                        <FormInput
                          label="Full name"
                          required
                          placeholder="Full name"
                          error={errors.coApplicants?.[index]?.fullName}
                          {...register(`coApplicants.${index}.fullName`)}
                        />

                        <FormField
                          label="Gender"
                          required
                          error={errors.coApplicants?.[index]?.gender?.message}
                        >
                          <select
                            className={selectClassName}
                            {...register(`coApplicants.${index}.gender`)}
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </FormField>

                        <FormInput
                          label="Date of birth"
                          type="date"
                          required
                          error={errors.coApplicants?.[index]?.dateOfBirth}
                          {...register(`coApplicants.${index}.dateOfBirth`)}
                        />

                        <FormField
                          label="Marital status"
                          error={
                            errors.coApplicants?.[index]?.maritalStatus?.message
                          }
                        >
                          <select
                            className={selectClassName}
                            {...register(`coApplicants.${index}.maritalStatus`)}
                          >
                            <option value="SINGLE">Single</option>
                            <option value="MARRIED">Married</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </FormField>

                        <FormInput
                          label="Mobile number"
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="10-digit mobile number"
                          error={errors.coApplicants?.[index]?.mobile}
                          {...register(`coApplicants.${index}.mobile`)}
                        />

                        <FormInput
                          label="Aadhaar number"
                          helperText="Optional"
                          inputMode="numeric"
                          maxLength={12}
                          placeholder="12-digit Aadhaar"
                          error={errors.coApplicants?.[index]?.aadhaarNumber}
                          {...register(`coApplicants.${index}.aadhaarNumber`)}
                        />

                        <FormInput
                          label="PAN number"
                          helperText="Optional"
                          maxLength={10}
                          className="uppercase"
                          placeholder="ABCDE1234F"
                          error={errors.coApplicants?.[index]?.panNumber}
                          {...register(`coApplicants.${index}.panNumber`)}
                        />

                        {/* Financial Co-applicant */}
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-primary/[0.03] p-4 transition-colors hover:bg-primary/[0.06] md:col-span-2">
                          <input
                            type="checkbox"
                            className="mt-0.5 size-4 shrink-0 accent-primary"
                            {...register(`coApplicants.${index}.isCoApplicant`)}
                          />

                          <div>
                            <p className="text-sm font-medium text-foreground">
                              This person is the financial co-applicant
                            </p>

                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                              Select this person if they will be responsible for
                              repaying the loan.
                            </p>
                          </div>
                        </label>
                      </div>
                    </section>

                    {/* Family Details */}
                    <section className="border-t pt-8">
                      <div className="mb-5 flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <UsersRound className="size-4" />
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-foreground">
                            Family details
                          </h4>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Household income and family information.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-x-5 gap-y-5 md:grid-cols-3">
                        <FormInput
                          label="Number of dependents"
                          inputMode="numeric"
                          helperText="Optional"
                          placeholder="e.g. 2"
                          error={
                            errors.coApplicants?.[index]?.numberOfDependents
                          }
                          {...register(
                            `coApplicants.${index}.numberOfDependents`,
                          )}
                        />

                        <FormInput
                          label="Earning members"
                          inputMode="numeric"
                          helperText="Optional"
                          placeholder="e.g. 1"
                          error={
                            errors.coApplicants?.[index]?.numberOfEarningMembers
                          }
                          {...register(
                            `coApplicants.${index}.numberOfEarningMembers`,
                          )}
                        />

                        <FormInput
                          label="Family monthly income"
                          inputMode="numeric"
                          required
                          placeholder="₹ Monthly income"
                          error={
                            errors.coApplicants?.[index]?.familyMonthlyIncome
                          }
                          {...register(
                            `coApplicants.${index}.familyMonthlyIncome`,
                          )}
                        />
                      </div>
                    </section>

                    {/* Current Address */}
                    <section className="border-t pt-8">
                      <div className="mb-5 flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <MapPin className="size-4" />
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-foreground">
                            Current address
                          </h4>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Where the co-applicant currently lives.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                        <FormInput
                          label="Address line 1"
                          required
                          placeholder="House / building / street"
                          className="md:col-span-2"
                          error={
                            errors.coApplicants?.[index]?.currentAddress?.line1
                          }
                          {...register(
                            `coApplicants.${index}.currentAddress.line1`,
                          )}
                        />

                        <FormInput
                          label="Address line 2"
                          helperText="Optional"
                          placeholder="Area / landmark"
                          className="md:col-span-2"
                          error={
                            errors.coApplicants?.[index]?.currentAddress?.line2
                          }
                          {...register(
                            `coApplicants.${index}.currentAddress.line2`,
                          )}
                        />

                        <FormInput
                          label="City"
                          required
                          placeholder="City"
                          error={
                            errors.coApplicants?.[index]?.currentAddress?.city
                          }
                          {...register(
                            `coApplicants.${index}.currentAddress.city`,
                          )}
                        />

                        <FormInput
                          label="Taluka"
                          helperText="Optional"
                          placeholder="Taluka"
                          error={
                            errors.coApplicants?.[index]?.currentAddress?.taluka
                          }
                          {...register(
                            `coApplicants.${index}.currentAddress.taluka`,
                          )}
                        />

                        <FormInput
                          label="District"
                          helperText="Optional"
                          placeholder="District"
                          error={
                            errors.coApplicants?.[index]?.currentAddress
                              ?.district
                          }
                          {...register(
                            `coApplicants.${index}.currentAddress.district`,
                          )}
                        />

                        <FormInput
                          label="State"
                          required
                          placeholder="State"
                          error={
                            errors.coApplicants?.[index]?.currentAddress?.state
                          }
                          {...register(
                            `coApplicants.${index}.currentAddress.state`,
                          )}
                        />

                        <FormInput
                          label="PIN code"
                          required
                          inputMode="numeric"
                          maxLength={6}
                          placeholder="6-digit PIN"
                          error={
                            errors.coApplicants?.[index]?.currentAddress
                              ?.pincode
                          }
                          {...register(
                            `coApplicants.${index}.currentAddress.pincode`,
                          )}
                        />

                        <FormInput
                          label="Years at current address"
                          helperText="Optional"
                          inputMode="numeric"
                          placeholder="e.g. 5"
                          error={
                            errors.coApplicants?.[index]?.yearsAtCurrentAddress
                          }
                          {...register(
                            `coApplicants.${index}.yearsAtCurrentAddress`,
                          )}
                        />
                      </div>

                      {/* Same Address */}
                      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-lg border bg-muted/20 p-4 transition-colors hover:bg-muted/40">
                        <input
                          type="checkbox"
                          className="mt-0.5 size-4 shrink-0 accent-primary"
                          {...register(
                            `coApplicants.${index}.sameAsCurrentAddress`,
                          )}
                        />

                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Permanent address is same as current
                          </p>

                          <p className="mt-1 text-xs leading-5 text-muted-foreground">
                            Uncheck this if the co-applicant has a different
                            permanent address.
                          </p>
                        </div>
                      </label>
                    </section>

                    {/* Permanent Address */}
                    {!sameAsCurrent ? (
                      <section className="border-t pt-8">
                        <div className="mb-5">
                          <h4 className="text-sm font-semibold text-foreground">
                            Permanent address
                          </h4>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Enter the permanent residential address.
                          </p>
                        </div>

                        <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                          <FormInput
                            label="Address line 1"
                            required
                            placeholder="House / building / street"
                            className="md:col-span-2"
                            error={
                              errors.coApplicants?.[index]?.permanentAddress
                                ?.line1
                            }
                            {...register(
                              `coApplicants.${index}.permanentAddress.line1`,
                            )}
                          />

                          <FormInput
                            label="City"
                            placeholder="City"
                            error={
                              errors.coApplicants?.[index]?.permanentAddress
                                ?.city
                            }
                            {...register(
                              `coApplicants.${index}.permanentAddress.city`,
                            )}
                          />

                          <FormInput
                            label="State"
                            placeholder="State"
                            error={
                              errors.coApplicants?.[index]?.permanentAddress
                                ?.state
                            }
                            {...register(
                              `coApplicants.${index}.permanentAddress.state`,
                            )}
                          />

                          <FormInput
                            label="PIN code"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="6-digit PIN"
                            error={
                              errors.coApplicants?.[index]?.permanentAddress
                                ?.pincode
                            }
                            {...register(
                              `coApplicants.${index}.permanentAddress.pincode`,
                            )}
                          />
                        </div>
                      </section>
                    ) : null}
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <LoanWizardActions onBack={onBack} backDisabled={isUpdating}>
          <Button
            type="submit"
            size="lg"
            disabled={isUpdating}
            loading={isUpdating}
            className="w-full min-w-36 sm:w-auto"
          >
            {isUpdating ? "Saving..." : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

export default CoApplicantStep;
