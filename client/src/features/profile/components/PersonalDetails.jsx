import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import AuthInput from "@/features/auth/components/AuthInput";

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
    return <div className="py-12 text-center">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <AuthInput
        label="First Name"
        name="firstName"
        placeholder="Enter first name"
        register={register}
        error={errors.firstName}
      />

      <AuthInput
        label="Date of Birth"
        name="dateOfBirth"
        type="date"
        register={register}
        error={errors.dateOfBirth}
      />

      {/* Gender */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Gender</label>

        <select
          {...register("gender")}
          className="
            h-10
            w-full
            rounded-md
            border
            border-input
            bg-background
            px-3
            text-sm
          "
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

      <AuthInput
        label="PAN Number"
        name="panNumber"
        placeholder="ABCDE1234F"
        register={register}
        error={errors.panNumber}
      />

      <AuthInput
        label="Aadhaar Number"
        name="aadhaarNumber"
        placeholder="123456789012"
        register={register}
        error={errors.aadhaarNumber}
      />

      <div className="flex justify-end">
        <Button disabled={isUpdating}>
          {isUpdating ? "Saving..." : "Save Personal Details"}
        </Button>
      </div>
    </form>
  );
}

export default PersonalDetails;
