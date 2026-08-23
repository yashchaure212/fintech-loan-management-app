import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { Check, GraduationCap, Search } from "lucide-react";

import {
  useGetSchoolLoanDetailsQuery,
  useCreateSchoolLoanDetailsMutation,
  useUpdateSchoolLoanDetailsMutation,
} from "../api/schoolLoanApi";
import { useSearchInstitutionsQuery } from "../api/institutionApi";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import FormInput from "@/components/common/FormInput";
import FormField from "@/components/common/FormField";
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

const classLabel = (value) => value?.replace("CLASS_", "Class ") || "";

const studentSchema = z
  .object({
    studentName: z.string().trim().min(2, "Student name is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    mobile: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number")
      .optional()
      .or(z.literal("")),
    email: z.string().trim().email().optional().or(z.literal("")),
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

    currentSchoolName: z.string().trim().min(1, "School name is required"),
    institutionId: z.string().optional(),
    schoolType: z.enum(["GOVERNMENT", "PRIVATE", "OTHER"]).optional(),
    currentClass: z.enum(SCHOOL_CLASSES, {
      errorMap: () => ({ message: "Select the current class" }),
    }),
    academicYear: z.string().trim().min(4, "Academic year is required"),
    continuingSameSchool: z.boolean().default(true),

    previousSchoolName: z.string().trim().optional(),
    newSchoolName: z.string().trim().optional(),
    expectedJoiningDate: z.string().optional(),

    previousClass: z.enum(SCHOOL_CLASSES).optional().or(z.literal("")),
    previousAcademicYear: z.string().trim().optional(),
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
          message: "New school name is required when changing school",
        });
      }

      if (!values.expectedJoiningDate) {
        ctx.addIssue({
          code: "custom",
          path: ["expectedJoiningDate"],
          message: "Expected joining date is required when changing school",
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
  panNumber: "",
  currentSchoolName: "",
  institutionId: "",
  schoolType: "GOVERNMENT",
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

function StudentInformationStep({ loanApplicationId, onBack, onNext }) {
  const {
    data,
    isLoading: isFetching,
    isError: isFetchError,
    error: fetchError,
  } = useGetSchoolLoanDetailsQuery(loanApplicationId, {
    skip: !loanApplicationId,
  });

  const [createSchoolLoanDetails, { isLoading: isCreating }] =
    useCreateSchoolLoanDetailsMutation();

  const [updateSchoolLoanDetails, { isLoading: isUpdating }] =
    useUpdateSchoolLoanDetailsMutation();

  const isSaving = isCreating || isUpdating;
  const existingDetails = data?.data;

  const [schoolQuery, setSchoolQuery] = useState("");

  const { data: searchResults } = useSearchInstitutionsQuery(
    { q: schoolQuery },
    { skip: schoolQuery.trim().length < 2 },
  );

  const schoolSuggestions = searchResults?.data || [];

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

  const continuingSameSchool = watch("continuingSameSchool");
  const selectedSchool = watch("institutionId");

  useEffect(() => {
    if (!existingDetails) return;

    reset({
      studentName: existingDetails.studentName || "",
      dateOfBirth: toDateInputValue(existingDetails.dateOfBirth),
      gender: existingDetails.gender || "MALE",
      mobile: existingDetails.mobile || "",
      email: existingDetails.email || "",
      aadhaarNumber: existingDetails.aadhaarNumber || "",
      panNumber: existingDetails.panNumber || "",
      currentSchoolName: existingDetails.currentSchoolName || "",
      institutionId: existingDetails.institutionId || "",
      schoolType: existingDetails.schoolType || "GOVERNMENT",
      currentClass: existingDetails.currentClass || "CLASS_1",
      academicYear: existingDetails.academicYear || "",
      continuingSameSchool: existingDetails.continuingSameSchool ?? true,
      previousSchoolName: existingDetails.previousSchoolName || "",
      newSchoolName: existingDetails.newSchoolName || "",
      expectedJoiningDate: toDateInputValue(
        existingDetails.expectedJoiningDate,
      ),
      previousClass: existingDetails.previousClass || "",
      previousAcademicYear: existingDetails.previousAcademicYear || "",
      previousClassPercentage:
        existingDetails.previousClassPercentage != null
          ? String(existingDetails.previousClassPercentage)
          : "",
    });
  }, [existingDetails, reset]);

  async function onSubmit(values) {
    const payload = {
      studentName: values.studentName,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      mobile: values.mobile || undefined,
      email: values.email || undefined,
      aadhaarNumber: values.aadhaarNumber || undefined,
      panNumber: values.panNumber || undefined,
      currentSchoolName: values.currentSchoolName,
      institutionId: values.institutionId || null,
      schoolType: values.schoolType || undefined,
      currentClass: values.currentClass,
      academicYear: values.academicYear,
      continuingSameSchool: values.continuingSameSchool,
      previousSchoolName: values.continuingSameSchool
        ? undefined
        : values.previousSchoolName || undefined,
      newSchoolName: values.continuingSameSchool
        ? undefined
        : values.newSchoolName || undefined,
      expectedJoiningDate: values.continuingSameSchool
        ? undefined
        : values.expectedJoiningDate || undefined,
      previousClass: values.previousClass || undefined,
      previousAcademicYear: values.previousAcademicYear || undefined,
      previousClassPercentage: values.previousClassPercentage
        ? Number(values.previousClassPercentage)
        : undefined,
    };

    try {
      if (existingDetails) {
        await updateSchoolLoanDetails({
          loanApplicationId,
          data: payload,
        }).unwrap();

        toast.success("Student details updated");
      } else {
        await createSchoolLoanDetails({
          loanApplicationId,
          data: payload,
        }).unwrap();

        toast.success("Student details saved");
      }

      onNext();
    } catch (error) {
      console.error("STEP 1 (student) SAVE ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to save student details",
      );
    }
  }

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

  if (isFetchError && fetchError?.status !== 404) {
    return (
      <LoanWizardShell
        step={1}
        totalSteps={7}
        title="Student Information"
        description={fetchError?.data?.message || "Please try again."}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <LoanWizardShell
        step={1}
        totalSteps={7}
        title="Student Information"
        description="Tell us about the student and their current school."
      >
        <div className="space-y-10">
          {/* Personal Details */}
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

              <FormField label="Gender" required error={errors.gender?.message}>
                <select className={selectClassName} {...register("gender")}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
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

              <FormInput
                label="PAN number"
                helperText="Optional, if applicable"
                maxLength={10}
                className="uppercase"
                placeholder="ABCDE1234F"
                error={errors.panNumber}
                {...register("panNumber")}
              />
            </div>
          </section>

          {/* Current Education */}
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
              {/* School Search */}
              <div className="relative md:col-span-2">
                <FormInput
                  label="Current school name"
                  required
                  placeholder="Search school or enter school name"
                  error={errors.currentSchoolName}
                  {...register("currentSchoolName", {
                    onChange: (event) => {
                      setSchoolQuery(event.target.value);
                      setValue("institutionId", "");
                    },
                  })}
                />

                <Search className="pointer-events-none absolute right-3 top-[38px] size-4 text-muted-foreground" />

                {schoolSuggestions.length > 0 ? (
                  <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border bg-background shadow-lg">
                    <div className="border-b bg-muted/30 px-3 py-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Select your school
                      </p>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-1">
                      {schoolSuggestions.map((school) => (
                        <button
                          type="button"
                          key={school.id}
                          className="group flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-muted"
                          onClick={() => {
                            setValue("currentSchoolName", school.name);
                            setValue("institutionId", school.id);
                            setValue("schoolType", school.schoolType);
                            setSchoolQuery("");
                          }}
                        >
                          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <GraduationCap className="size-4" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {school.name}
                            </p>

                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {school.city}, {school.state}
                            </p>
                          </div>

                          {selectedSchool === school.id ? (
                            <Check className="mt-1 size-4 shrink-0 text-primary" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <FormField label="School type" error={errors.schoolType?.message}>
                <select className={selectClassName} {...register("schoolType")}>
                  <option value="GOVERNMENT">Government</option>
                  <option value="PRIVATE">Private</option>
                  <option value="OTHER">Other</option>
                </select>
              </FormField>

              <FormField
                label="Current class"
                required
                error={errors.currentClass?.message}
              >
                <select
                  className={selectClassName}
                  {...register("currentClass")}
                >
                  {SCHOOL_CLASSES.map((value) => (
                    <option key={value} value={value}>
                      {classLabel(value)}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormInput
                label="Academic year"
                required
                placeholder="e.g. 2026-2027"
                error={errors.academicYear}
                {...register("academicYear")}
              />

              {/* Same School Toggle */}
              <label className="group flex cursor-pointer items-start gap-3 rounded-lg border bg-muted/20 p-4 transition-colors hover:bg-muted/40 md:col-span-2">
                <input
                  type="checkbox"
                  className="mt-0.5 size-4 shrink-0 accent-primary"
                  {...register("continuingSameSchool")}
                />

                <div>
                  <p className="text-sm font-medium text-foreground">
                    Student is continuing in the same school
                  </p>

                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Uncheck this if the student is joining a new school.
                  </p>
                </div>
              </label>
            </div>

            {/* New School */}
            {!continuingSameSchool ? (
              <div className="mt-6 rounded-lg border bg-muted/20 p-5">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-foreground">
                    School change details
                  </h4>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Provide the details of the student's upcoming school change.
                  </p>
                </div>

                <div className="grid gap-x-5 gap-y-5 md:grid-cols-2">
                  <FormInput
                    label="Previous school name"
                    helperText="Optional"
                    error={errors.previousSchoolName}
                    {...register("previousSchoolName")}
                  />

                  <FormInput
                    label="New school name"
                    required
                    error={errors.newSchoolName}
                    {...register("newSchoolName")}
                  />

                  <FormInput
                    label="Expected joining date"
                    type="date"
                    required
                    error={errors.expectedJoiningDate}
                    {...register("expectedJoiningDate")}
                  />
                </div>
              </div>
            ) : null}
          </section>

          {/* Academic History */}
          <section className="border-t pt-8">
            <div className="mb-5">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                Academic history
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Previous academic information.
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                Optional — leave blank for a first-time Class 1 entrant.
              </p>
            </div>

            <div className="grid gap-x-5 gap-y-5 md:grid-cols-3">
              <FormField
                label="Previous class"
                error={errors.previousClass?.message}
              >
                <select
                  className={selectClassName}
                  {...register("previousClass")}
                >
                  <option value="">Not applicable</option>

                  {SCHOOL_CLASSES.map((value) => (
                    <option key={value} value={value}>
                      {classLabel(value)}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormInput
                label="Previous academic year"
                placeholder="e.g. 2025-2026"
                error={errors.previousAcademicYear}
                {...register("previousAcademicYear")}
              />

              <FormInput
                label="Previous class percentage / grade"
                inputMode="decimal"
                helperText="0-100"
                placeholder="e.g. 82.5"
                error={errors.previousClassPercentage}
                {...register("previousClassPercentage")}
              />
            </div>
          </section>
        </div>

        <LoanWizardActions onBack={onBack} backDisabled={isSaving}>
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            loading={isSaving}
            className="w-full min-w-36 sm:w-auto"
          >
            {isSaving ? "Saving..." : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

export default StudentInformationStep;
