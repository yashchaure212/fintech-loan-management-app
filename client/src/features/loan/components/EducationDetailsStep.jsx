import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { educationStudentDetailsSchema } from "../schemas/educationStudentDetails.schema";
import {
  useGetEducationLoanDetailsQuery,
  useCreateEducationLoanDetailsMutation,
  useUpdateEducationLoanDetailsMutation,
} from "../api/educationLoanApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import FormField from "@/components/common/FormField";
import {
  LoanWizardShell,
  LoanWizardActions,
  selectClassName,
} from "./LoanWizardShell";

function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  return String(value).split("T")[0];
}

function EducationDetailsStep({ loanApplicationId, onBack, onNext }) {
  const {
    data,
    isLoading: isFetching,
    isError: isFetchError,
    error: fetchError,
  } = useGetEducationLoanDetailsQuery(loanApplicationId, {
    skip: !loanApplicationId,
  });

  const [createEducationLoanDetails, { isLoading: isCreating }] =
    useCreateEducationLoanDetailsMutation();

  const [updateEducationLoanDetails, { isLoading: isUpdating }] =
    useUpdateEducationLoanDetailsMutation();

  const existingDetails = data?.data;
  const hasExistingDetails = Boolean(existingDetails?.id);
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationStudentDetailsSchema),
    defaultValues: {
      studentName: "",
      dateOfBirth: "",
      gender: "",
      mobile: "",
      email: "",
      aadhaarNumber: "",
      panNumber: "",
      courseName: "",
      collegeName: "",
      universityName: "",
      studyCountry: "",
      courseDurationMonths: "",
      admissionStatus: "",
      estimatedCourseFee: "",
    },
  });

  useEffect(() => {
    if (!existingDetails) {
      return;
    }

    reset({
      studentName: existingDetails.studentName || "",
      dateOfBirth: toDateInputValue(existingDetails.dateOfBirth),
      gender: existingDetails.gender || "",
      mobile: existingDetails.mobile || "",
      email: existingDetails.email || "",
      aadhaarNumber: existingDetails.aadhaarNumber || "",
      panNumber: existingDetails.panNumber || "",
      courseName: existingDetails.courseName || "",
      collegeName: existingDetails.collegeName || "",
      universityName: existingDetails.universityName || "",
      studyCountry: existingDetails.studyCountry || "",
      courseDurationMonths:
        existingDetails.courseDurationMonths != null
          ? String(existingDetails.courseDurationMonths)
          : "",
      admissionStatus: existingDetails.admissionStatus || "",
      estimatedCourseFee:
        existingDetails.estimatedCourseFee != null
          ? String(existingDetails.estimatedCourseFee)
          : "",
    });
  }, [existingDetails, reset]);

  async function onSubmit(values) {
    if (!loanApplicationId) {
      toast.error("Loan application ID is missing.");
      return;
    }

    const payload = {
      studentName: values.studentName.trim(),
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      mobile: values.mobile.trim(),
      email: values.email.trim(),
      aadhaarNumber: values.aadhaarNumber?.trim() || undefined,
      panNumber: values.panNumber?.trim().toUpperCase() || undefined,
      courseName: values.courseName.trim(),
      collegeName: values.collegeName.trim(),
      universityName: values.universityName.trim(),
      studyCountry: values.studyCountry.trim(),
      courseDurationMonths: Number(values.courseDurationMonths),
      admissionStatus: values.admissionStatus,
      estimatedCourseFee: Number(values.estimatedCourseFee),
    };

    try {
      if (hasExistingDetails) {
        const response = await updateEducationLoanDetails({
          loanApplicationId,
          data: payload,
        }).unwrap();

        toast.success(
          response?.message || "Student details updated successfully",
        );
      } else {
        const response = await createEducationLoanDetails({
          loanApplicationId,
          data: payload,
        }).unwrap();

        toast.success(
          response?.message || "Student details saved successfully",
        );
      }

      onNext();
    } catch (error) {
      console.error("Education details save error:", error);

      toast.error(
        error?.data?.message ||
          error?.message ||
          "Unable to save student details",
      );
    }
  }

  if (isFetching) {
    return (
      <LoanWizardShell step={2} title="Student Details" description="Loading...">
        <Skeleton className="h-64 w-full" />
      </LoanWizardShell>
    );
  }

  if (isFetchError && fetchError?.status !== 404) {
    return (
      <LoanWizardShell
        step={2}
        title="Student Details"
        description={
          fetchError?.data?.message ||
          "Student details could not be loaded. Please try again."
        }
      >
        <Button type="button" variant="outline" onClick={onBack}>
          ← Back
        </Button>
      </LoanWizardShell>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <LoanWizardShell
        step={2}
        title="Student Details"
        description="Provide the student and course information for this education loan."
      >
        <section className="space-y-4">
          <h3 className="subsection-title">Personal information</h3>

          <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Student name"
                error={errors.studentName?.message}
                required
              >
                <Input
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.studentName)}
                  {...register("studentName")}
                />
              </FormField>

              <FormField
                label="Date of birth"
                error={errors.dateOfBirth?.message}
                required
              >
                <Input
                  type="date"
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.dateOfBirth)}
                  {...register("dateOfBirth")}
                />
              </FormField>

              <FormField label="Gender" error={errors.gender?.message} required>
                <select
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.gender)}
                  className={selectClassName}
                  {...register("gender")}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </FormField>

              <FormField label="Mobile" error={errors.mobile?.message} required>
                <Input
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.mobile)}
                  {...register("mobile")}
                />
              </FormField>

              <FormField label="Email" error={errors.email?.message} required>
                <Input
                  type="email"
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.email)}
                  {...register("email")}
                />
              </FormField>

              <FormField
                label="Aadhaar number"
                error={errors.aadhaarNumber?.message}
              >
                <Input
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.aadhaarNumber)}
                  {...register("aadhaarNumber")}
                />
              </FormField>

              <FormField label="PAN number" error={errors.panNumber?.message}>
                <Input
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.panNumber)}
                  {...register("panNumber")}
                />
              </FormField>
            </div>
          </section>

          <section className="space-y-4 border-t pt-6">
            <h3 className="subsection-title">Course information</h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Course name"
                error={errors.courseName?.message}
                required
              >
                <Input
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.courseName)}
                  {...register("courseName")}
                />
              </FormField>

              <FormField
                label="College name"
                error={errors.collegeName?.message}
                required
              >
                <Input
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.collegeName)}
                  {...register("collegeName")}
                />
              </FormField>

              <FormField
                label="University name"
                error={errors.universityName?.message}
                required
              >
                <Input
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.universityName)}
                  {...register("universityName")}
                />
              </FormField>

              <FormField
                label="Study country"
                error={errors.studyCountry?.message}
                required
              >
                <Input
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.studyCountry)}
                  {...register("studyCountry")}
                />
              </FormField>

              <FormField
                label="Course duration (months)"
                error={errors.courseDurationMonths?.message}
                required
              >
                <Input
                  type="number"
                  min="1"
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.courseDurationMonths)}
                  {...register("courseDurationMonths")}
                />
              </FormField>

              <FormField
                label="Admission status"
                error={errors.admissionStatus?.message}
                required
              >
                <select
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.admissionStatus)}
                  className={selectClassName}
                  {...register("admissionStatus")}
                >
                  <option value="">Select status</option>
                  <option value="APPLIED">Applied</option>
                  <option value="CONFIRMED">Confirmed</option>
                </select>
              </FormField>

              <FormField
                label="Estimated course fee"
                error={errors.estimatedCourseFee?.message}
                required
              >
                <Input
                  type="number"
                  min="1"
                  step="1000"
                  disabled={isSaving}
                  aria-invalid={Boolean(errors.estimatedCourseFee)}
                  {...register("estimatedCourseFee")}
                />
              </FormField>
            </div>
          </section>

        <LoanWizardActions onBack={onBack} backDisabled={isSaving}>
          <Button
            type="submit"
            size="lg"
            disabled={isSaving}
            loading={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? "Saving..." : "Continue →"}
          </Button>
        </LoanWizardActions>
      </LoanWizardShell>
    </form>
  );
}

export default EducationDetailsStep;
