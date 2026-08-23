import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import FormInput from "@/components/common/FormInput";

import { personalDetailsSchema } from "../schemas/profile.schema";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../api/profileApi";

import { Button } from "@/components/ui/button";

function PersonalDetails() {
  const { data, isLoading } = useGetProfileQuery();

  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(personalDetailsSchema),

    defaultValues: {
      firstName: "",
      dateOfBirth: "",
      gender: "",
      panNumber: "",
      aadhaarNumber: "",
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        firstName: data.data.firstName || "",
        dateOfBirth: data.data.dateOfBirth?.split("T")[0] || "",
        gender: data.data.gender || "",
        panNumber: data.data.panNumber || "",
        aadhaarNumber: data.data.aadhaarNumber || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth).toISOString()
          : null,
      };

      await updateProfile(payload).unwrap();

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[hsl(var(--primary)/0.2)] border-t-[hsl(var(--primary))]" />
          <p className="text-sm text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-section space-y-6">
        {/* Section Header */}
        <div>
          <h3 className="section-title">Personal Information</h3>
          <p className="text-helper mt-1">
            Keep your personal and identification details up to date.
          </p>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="First Name"
            name="firstName"
            {...register("firstName")}
            placeholder="Enter first name"
            error={errors.firstName}
          />

          <FormInput
            label="Date of Birth"
            name="dateOfBirth"
            {...register("dateOfBirth")}
            type="date"
            error={errors.dateOfBirth}
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <label htmlFor="gender" className="text-label">
            Gender
          </label>

          <select
            id="gender"
            {...register("gender")}
            className="h-11 w-full rounded-[var(--radius-md)] border border-default bg-[hsl(var(--card))] px-3 text-sm text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:border-[hsl(var(--primary))] focus-visible:shadow-[0_0_0_2px_hsl(var(--background)),0_0_0_4px_hsl(var(--primary)/0.18)]"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        {/* Identity Information */}
        <div className="border-t border-subtle pt-5">
          <div className="mb-5">
            <p className="text-label">Identity Information</p>
            <p className="text-helper mt-1">
              Enter your government identification details as they appear on
              your documents.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput
              label="PAN Number"
              name="panNumber"
              {...register("panNumber")}
              placeholder="ABCDE1234F"
              error={errors.panNumber}
            />

            <FormInput
              label="Aadhaar Number"
              name="aadhaarNumber"
              {...register("aadhaarNumber")}
              placeholder="123456789012"
              error={errors.aadhaarNumber}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="submit" disabled={isUpdating} className="min-h-11 px-6">
            {isUpdating ? "Saving..." : "Save Personal Details"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default PersonalDetails;
