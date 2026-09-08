import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import {
  Check,
  GraduationCap,
  Search,
  X,
} from "lucide-react";

import {
  useGetSchoolLoanDetailsQuery,
  useCreateSchoolLoanDetailsMutation,
  useUpdateSchoolLoanDetailsMutation,
} from "../api/schoolLoanApi";

import { YAVATMAL_PRIVATE_SCHOOLS } from "../data/schools";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/shared/FormInput";
import FormField from "@/components/shared/FormField";

import {
  LoanWizardShell,
  LoanWizardActions,
  selectClassName,
} from "./LoanWizardShell";

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

const classLabel = (value) =>
  value?.replace("CLASS_", "Class ") || "";

const studentSchema = z
  .object({
    studentName: z
      .string()
      .trim()
      .min(2, "Student name is required"),

    dateOfBirth: z
      .string()
      .min(1, "Date of birth is required"),

    gender: z.enum(
      ["MALE", "FEMALE", "OTHER"],
      {
        errorMap: () => ({
          message: "Select gender",
        }),
      },
    ),

    mobile: z
      .string()
      .trim()
      .regex(
        /^[6-9]\d{9}$/,
        "Invalid Indian mobile number",
      )
      .optional()
      .or(z.literal("")),

    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .optional()
      .or(z.literal("")),

    aadhaarNumber: z
      .string()
      .trim()
      .regex(
        /^\d{12}$/,
        "Aadhaar must contain 12 digits",
      )
      .optional()
      .or(z.literal("")),

    currentSchoolName: z
      .string()
      .trim()
      .min(1, "School name is required"),

    /*
     * Do not use this as the local school catalog ID.
     * Backend expects a UUID here.
     *
     * We keep this optional for now and send null
     * until schools are connected to the backend
     * Institution table.
     */
    institutionId: z
      .string()
      .optional()
      .or(z.literal("")),

    currentClass: z.enum(
      SCHOOL_CLASSES,
      {
        errorMap: () => ({
          message: "Select the current class",
        }),
      },
    ),

    academicYear: z
      .string()
      .trim()
      .min(4, "Academic year is required"),

    continuingSameSchool: z
      .boolean()
      .default(true),

    previousSchoolName: z
      .string()
      .trim()
      .optional(),

    newSchoolName: z
      .string()
      .trim()
      .optional(),

    expectedJoiningDate: z
      .string()
      .optional(),

    previousClass: z
      .enum(SCHOOL_CLASSES)
      .optional()
      .or(z.literal("")),

    previousAcademicYear: z
      .string()
      .trim()
      .optional(),

    previousClassPercentage: z
      .string()
      .trim()
      .optional()
      .refine(
        (value) =>
          !value ||
          (Number(value) >= 0 &&
            Number(value) <= 100 &&
            !Number.isNaN(Number(value))),
        "Enter a value between 0 and 100",
      ),
  })
  .superRefine((values, ctx) => {
    if (!values.continuingSameSchool) {
      if (!values.newSchoolName) {
        ctx.addIssue({
          code: "custom",
          path: ["newSchoolName"],
          message:
            "New school name is required when changing school",
        });
      }

      if (!values.expectedJoiningDate) {
        ctx.addIssue({
          code: "custom",
          path: ["expectedJoiningDate"],
          message:
            "Expected joining date is required when changing school",
        });
      }
    }
  });

const emptyValues = {
  studentName: "",
  dateOfBirth: "",
  gender: "MALE",
  mobile: "",
  email: "",
  aadhaarNumber: "",
  currentSchoolName: "",
  institutionId: "",
  currentClass: "CLASS_1",
  academicYear: "",
  continuingSameSchool: true,
  previousSchoolName: "",
  newSchoolName: "",
  expectedJoiningDate: "",
  previousClass: "",
  previousAcademicYear: "",
  previousClassPercentage: "",
};

function toDateInputValue(value) {
  if (!value) return "";

  return String(value).slice(0, 10);
}

function StudentInformationStep({
  loanApplicationId,
  onBack,
  onNext,
}) {
  const {
    data,
    isLoading: isFetching,
    isError: isFetchError,
    error: fetchError,
  } = useGetSchoolLoanDetailsQuery(
    loanApplicationId,
    {
      skip: !loanApplicationId,
    },
  );

  const [
    createSchoolLoanDetails,
    { isLoading: isCreating },
  ] = useCreateSchoolLoanDetailsMutation();

  const [
    updateSchoolLoanDetails,
    { isLoading: isUpdating },
  ] = useUpdateSchoolLoanDetailsMutation();

  const isSaving =
    isCreating || isUpdating;

  const existingDetails = data?.data;

  const [schoolSearch, setSchoolSearch] =
    useState("");

  const [schoolDropdownOpen, setSchoolDropdownOpen] =
    useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: emptyValues,
  });

  const continuingSameSchool = watch(
    "continuingSameSchool",
  );

  const selectedSchoolName = watch(
    "currentSchoolName",
  );

  /*
   * =========================================================
   * SCHOOL SEARCH
   * =========================================================
   */

  const schoolSuggestions = useMemo(() => {
    const query = schoolSearch
      .trim()
      .toLowerCase();

    if (!query) {
      return YAVATMAL_PRIVATE_SCHOOLS;
    }

    return YAVATMAL_PRIVATE_SCHOOLS.filter(
      (school) =>
        school.name
          .toLowerCase()
          .includes(query) ||
        school.board
          .toLowerCase()
          .includes(query),
    );
  }, [schoolSearch]);

  /*
   * =========================================================
   * LOAD EXISTING DETAILS
   * =========================================================
   */

  useEffect(() => {
    if (!existingDetails) return;

    reset({
      studentName:
        existingDetails.studentName || "",

      dateOfBirth:
        toDateInputValue(
          existingDetails.dateOfBirth,
        ),

      gender:
        existingDetails.gender || "MALE",

      mobile:
        existingDetails.mobile || "",

      email:
        existingDetails.email || "",

      aadhaarNumber:
        existingDetails.aadhaarNumber || "",

      currentSchoolName:
        existingDetails.currentSchoolName || "",

      /*
       * Only use the backend UUID if one already exists.
       * Never convert the local school catalog value into
       * institutionId.
       */
      institutionId:
        existingDetails.institutionId || "",

      currentClass:
        existingDetails.currentClass ||
        "CLASS_1",

      academicYear:
        existingDetails.academicYear || "",

      continuingSameSchool:
        existingDetails.continuingSameSchool ??
        true,

      previousSchoolName:
        existingDetails.previousSchoolName || "",

      newSchoolName:
        existingDetails.newSchoolName || "",

      expectedJoiningDate:
        toDateInputValue(
          existingDetails.expectedJoiningDate,
        ),

      previousClass:
        existingDetails.previousClass || "",

      previousAcademicYear:
        existingDetails.previousAcademicYear || "",

      previousClassPercentage:
        existingDetails.previousClassPercentage !=
        null
          ? String(
              existingDetails.previousClassPercentage,
            )
          : "",
    });

    setSchoolSearch(
      existingDetails.currentSchoolName || "",
    );
  }, [existingDetails, reset]);

  /*
   * =========================================================
   * SELECT SCHOOL
   * =========================================================
   */

  const handleSchoolSelect = (school) => {
    setValue(
      "currentSchoolName",
      school.name,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );

    /*
     * IMPORTANT:
     *
     * Do NOT use school.id here.
     *
     * Our schools.js contains a local catalog,
     * not a backend UUID.
     *
     * institutionId will remain empty/null until
     * the school is connected to a real Institution
     * record in the backend.
     */
    setValue(
      "institutionId",
      "",
      {
        shouldDirty: true,
      },
    );

    setSchoolSearch("");
    setSchoolDropdownOpen(false);
  };

  /*
   * =========================================================
   * SUBMIT
   * =========================================================
   */

  async function onSubmit(values) {
    const payload = {
      studentName: values.studentName,

      dateOfBirth: values.dateOfBirth,

      gender: values.gender,

      mobile:
        values.mobile || undefined,

      email:
        values.email || undefined,

      aadhaarNumber:
        values.aadhaarNumber || undefined,

      currentSchoolName:
        values.currentSchoolName,

      /*
       * Backend expects UUID.
       *
       * Until we have a real Institution UUID,
       * send null instead of a local school ID.
       */
      institutionId:
        values.institutionId || null,

      currentClass:
        values.currentClass,

      academicYear:
        values.academicYear,

      continuingSameSchool:
        values.continuingSameSchool,

      previousSchoolName:
        values.continuingSameSchool
          ? undefined
          : values.previousSchoolName ||
            undefined,

      newSchoolName:
        values.continuingSameSchool
          ? undefined
          : values.newSchoolName ||
            undefined,

      expectedJoiningDate:
        values.continuingSameSchool
          ? undefined
          : values.expectedJoiningDate ||
            undefined,

      previousClass:
        values.previousClass || undefined,

      previousAcademicYear:
        values.previousAcademicYear ||
        undefined,

      previousClassPercentage:
        values.previousClassPercentage
          ? Number(
              values.previousClassPercentage,
            )
          : undefined,
    };

    try {
      if (existingDetails) {
        await updateSchoolLoanDetails({
          loanApplicationId,
          data: payload,
        }).unwrap();

        toast.success(
          "Student details updated",
        );
      } else {
        await createSchoolLoanDetails({
          loanApplicationId,
          data: payload,
        }).unwrap();

        toast.success(
          "Student details saved",
        );
      }

      onNext();
    } catch (error) {
      console.error(
        "STEP 1 (student) SAVE ERROR:",
        error,
      );

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to save student details",
      );
    }
  }

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */

  if (isFetching) {
    return (
      <LoanWizardShell
        step={1}
        totalSteps={7}
        title="Student Information"
        description="Loading..."
      >
        <div className="rounded-lg border bg-background p-6">
          <Skeleton className="h-64 w-full" />
        </div>
      </LoanWizardShell>
    );
  }

  /*
   * =========================================================
   * ERROR
   * =========================================================
   */

  if (
    isFetchError &&
    fetchError?.status !== 404
  ) {
    return (
      <LoanWizardShell
        step={1}
        totalSteps={7}
        title="Student Information"
        description={
          fetchError?.data?.message ||
          "Please try again."
        }
      />
    );
  }

  /*
   * =========================================================
   * UI
   * =========================================================
   */

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <LoanWizardShell
        step={1}
        totalSteps={7}
        title="Student Information"
        description="Tell us about the student and their current school."
      >
        <div className="space-y-10">
          {/* =====================================================
              PERSONAL DETAILS
          ====================================================== */}

          <section>
            <div className="mb-5">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Personal details
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Basic information about the student.
              </p>
            </div>

            <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
              <FormInput
                label="Full name"
                required
                placeholder="Student's full name"
                error={errors.studentName}
                {...register("studentName")}
              />

              <FormInput
                label="Date of birth"
                type="date"
                required
                error={errors.dateOfBirth}
                {...register("dateOfBirth")}
              />

              <FormField
                label="Gender"
                required
                error={
                  errors.gender?.message
                }
              >
                <select
                  className={selectClassName}
                  {...register("gender")}
                >
                  <option value="MALE">
                    Male
                  </option>

                  <option value="FEMALE">
                    Female
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </FormField>

              <FormInput
                label="Mobile number"
                type="tel"
                maxLength={10}
                helperText="Optional"
                placeholder="10-digit mobile number"
                error={errors.mobile}
                {...register("mobile")}
              />

              <FormInput
                label="Email address"
                type="email"
                helperText="Optional"
                placeholder="student@example.com"
                error={errors.email}
                {...register("email")}
              />

              <FormInput
                label="Aadhaar number"
                helperText="Optional"
                inputMode="numeric"
                maxLength={12}
                placeholder="12-digit Aadhaar"
                error={errors.aadhaarNumber}
                {...register("aadhaarNumber")}
              />
            </div>
          </section>

          {/* =====================================================
              CURRENT EDUCATION
          ====================================================== */}

          <section className="border-t pt-8">
            <div className="mb-5 flex items-start gap-3">
              <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="size-4" />
              </div>

              <div>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Current education
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  School and current academic information.
                </p>
              </div>
            </div>

            <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
              {/* SCHOOL SELECTOR */}
              <div className="relative md:col-span-2">
                <label
                  htmlFor="current-school"
                  className="text-label"
                >
                  Current school
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </label>

                <div className="relative mt-2">
                  <input
                    id="current-school"
                    type="text"
                    value={
                      schoolSearch ||
                      selectedSchoolName ||
                      ""
                    }
                    placeholder="Search and select your school"
                    autoComplete="off"
                    onFocus={() => {
                      setSchoolDropdownOpen(
                        true,
                      );

                      /*
                       * When an existing school is
                       * already selected, show it in the
                       * search field without requiring
                       * the user to type again.
                       */
                      if (
                        selectedSchoolName &&
                        !schoolSearch
                      ) {
                        setSchoolSearch(
                          selectedSchoolName,
                        );
                      }
                    }}
                    onChange={(event) => {
                      const value =
                        event.target.value;

                      setSchoolSearch(value);

                      setSchoolDropdownOpen(
                        true,
                      );

                      setValue(
                        "currentSchoolName",
                        value,
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        },
                      );

                      /*
                       * User changed the text after
                       * selecting a school, so the old
                       * institution reference is no
                       * longer valid.
                       */
                      setValue(
                        "institutionId",
                        "",
                        {
                          shouldDirty: true,
                        },
                      );
                    }}
                    className="h-11 w-full rounded-md border border-default bg-background pl-3 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  {schoolSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setSchoolSearch("");

                        setValue(
                          "currentSchoolName",
                          "",
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          },
                        );

                        setValue(
                          "institutionId",
                          "",
                          {
                            shouldDirty: true,
                          },
                        );

                        setSchoolDropdownOpen(
                          true,
                        );
                      }}
                      className="absolute right-9 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label="Clear school search"
                    >
                      <X className="size-4" />
                    </button>
                  )}

                  <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                </div>

                {errors.currentSchoolName && (
                  <p className="mt-1 text-sm text-destructive">
                    {
                      errors
                        .currentSchoolName
                        .message
                    }
                  </p>
                )}

                {/* SCHOOL DROPDOWN */}
                {schoolDropdownOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close school list"
                      className="fixed inset-0 z-30 cursor-default"
                      onClick={() =>
                        setSchoolDropdownOpen(
                          false,
                        )
                      }
                    />

                    <div className="absolute left-0 right-0 top-[76px] z-40 overflow-hidden rounded-xl border bg-background shadow-xl">
                      <div className="flex items-center justify-between border-b bg-muted/30 px-4 py-3">
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            Yavatmal private schools
                          </p>

                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Select the student's school
                          </p>
                        </div>

                        <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                          {schoolSuggestions.length}
                        </span>
                      </div>

                      <div className="max-h-72 overflow-y-auto p-1">
                        {schoolSuggestions.length >
                        0 ? (
                          schoolSuggestions.map(
                            (school) => {
                              const selected =
                                selectedSchoolName ===
                                school.name;

                              return (
                                <button
                                  key={school.name}
                                  type="button"
                                  onClick={() =>
                                    handleSchoolSelect(
                                      school,
                                    )
                                  }
                                  className={[
                                    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition hover:bg-muted",
                                    selected
                                      ? "bg-primary/5"
                                      : "",
                                  ].join(" ")}
                                >
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <GraduationCap className="size-4" />
                                  </span>

                                  <span className="min-w-0 flex-1">
                                    <span className="block text-sm font-semibold text-foreground">
                                      {
                                        school.name
                                      }
                                    </span>

                                    <span className="mt-0.5 block text-xs text-muted-foreground">
                                      {
                                        school.board
                                      }
                                      {" • "}
                                      {school.city}
                                    </span>
                                  </span>

                                  {selected && (
                                    <Check className="size-4 shrink-0 text-primary" />
                                  )}
                                </button>
                              );
                            },
                          )
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <GraduationCap className="mx-auto size-6 text-muted-foreground" />

                            <p className="mt-2 text-sm font-semibold">
                              No school found
                            </p>

                            <p className="mt-1 text-xs text-muted-foreground">
                              Try a different school
                              name.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <FormField
                label="Current class"
                required
                error={
                  errors.currentClass?.message
                }
              >
                <select
                  className={selectClassName}
                  {...register(
                    "currentClass",
                  )}
                >
                  {SCHOOL_CLASSES.map(
                    (value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {classLabel(value)}
                      </option>
                    ),
                  )}
                </select>
              </FormField>

              <FormInput
                label="Academic year"
                required
                placeholder="e.g. 2026-2027"
                error={errors.academicYear}
                {...register(
                  "academicYear",
                )}
              />

              {/* SAME SCHOOL */}
              <label className="group flex cursor-pointer items-start gap-3 rounded-lg border bg-muted/20 p-4 transition-colors hover:bg-muted/40 md:col-span-2">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                  {...register(
                    "continuingSameSchool",
                  )}
                />

                <div>
                  <p className="text-sm font-medium text-foreground">
                    Student is continuing in the
                    same school
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Uncheck this if the student is
                    joining a new school.
                  </p>
                </div>
              </label>
            </div>

            {/* SCHOOL CHANGE */}
            {!continuingSameSchool && (
              <div className="mt-6 rounded-lg border bg-muted/20 p-5">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground">
                    School change details
                  </h4>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Provide the details of the upcoming
                    school change.
                  </p>
                </div>

                <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                  <FormInput
                    label="Previous school name"
                    helperText="Optional"
                    error={
                      errors.previousSchoolName
                    }
                    {...register(
                      "previousSchoolName",
                    )}
                  />

                  <FormInput
                    label="New school name"
                    required
                    error={
                      errors.newSchoolName
                    }
                    {...register(
                      "newSchoolName",
                    )}
                  />

                  <FormInput
                    label="Expected joining date"
                    type="date"
                    required
                    error={
                      errors.expectedJoiningDate
                    }
                    {...register(
                      "expectedJoiningDate",
                    )}
                  />
                </div>
              </div>
            )}
          </section>

          {/* =====================================================
              ACADEMIC HISTORY
          ====================================================== */}

          <section className="border-t pt-8">
            <div className="mb-5">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Academic history
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Previous academic information.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Optional — leave blank for a
                first-time Class 1 entrant.
              </p>
            </div>

            <div className="grid gap-x-5 gap-y-5 md:grid-cols-3">
              <FormField
                label="Previous class"
                error={
                  errors.previousClass?.message
                }
              >
                <select
                  className={selectClassName}
                  {...register(
                    "previousClass",
                  )}
                >
                  <option value="">
                    Not applicable
                  </option>

                  {SCHOOL_CLASSES.map(
                    (value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {classLabel(value)}
                      </option>
                    ),
                  )}
                </select>
              </FormField>

              <FormInput
                label="Previous academic year"
                placeholder="e.g. 2025-2026"
                error={
                  errors.previousAcademicYear
                }
                {...register(
                  "previousAcademicYear",
                )}
              />

              <FormInput
                label="Previous class percentage / grade"
                inputMode="decimal"
                helperText="0-100"
                placeholder="e.g. 82.5"
                error={
                  errors.previousClassPercentage
                }
                {...register(
                  "previousClassPercentage",
                )}
              />
            </div>
          </section>
        </div>

        <LoanWizardActions
          onBack={onBack}
          backDisabled={isSaving}
        >
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            loading={isSaving}
            className="w-full min-w-36 sm:w-auto"
          >
            {isSaving
              ? "Saving..."
              : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

export default StudentInformationStep;