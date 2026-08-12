import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import AuthInput from "@/features/auth/components/AuthInput";

import { Button } from "@/components/ui/button";

import { addressSchema } from "../schemas/profile.schema";

import {
  useGetAddressQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from "../api/profileApi";

function AddressDetails() {
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();

  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const { data, isLoading } = useGetAddressQuery();
  const existingAddress = data?.data?.[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),

    defaultValues: {
      type: "CURRENT",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  useEffect(() => {
    if (data?.data?.length) {
      const address = data.data[0];

      reset({
        type: address.type || "CURRENT",
        line1: address.line1 || "",
        line2: address.line2 || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    try {
      if (existingAddress) {
        await updateAddress({
          id: existingAddress.id,

          ...formData,
        }).unwrap();

        toast.success("Address updated successfully");
      } else {
        await createAddress(formData).unwrap();

        toast.success("Address created successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to save address");
    }
  };
  if (isLoading) {
    return <div className="py-12 text-center">Loading address...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Address Type */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Address Type</label>

        <select
          {...register("type")}
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
          <option value="CURRENT">Current Address</option>

          <option value="PERMANENT">Permanent Address</option>
        </select>

        {errors.type && (
          <p className="text-sm text-destructive">{errors.type.message}</p>
        )}
      </div>

      <AuthInput
        label="Address Line 1"
        name="line1"
        placeholder="Enter address"
        register={register}
        error={errors.line1}
      />

      <AuthInput
        label="Address Line 2"
        name="line2"
        placeholder="Apartment, Landmark (Optional)"
        register={register}
        error={errors.line2}
      />

      <AuthInput
        label="City"
        name="city"
        placeholder="Enter city"
        register={register}
        error={errors.city}
      />

      <AuthInput
        label="State"
        name="state"
        placeholder="Enter state"
        register={register}
        error={errors.state}
      />

      <AuthInput
        label="Pincode"
        name="pincode"
        placeholder="Enter pincode"
        register={register}
        error={errors.pincode}
      />

      <div className="flex justify-end">
        <Button disabled={isUpdating || isCreating}>
          {isUpdating || isCreating ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
}

export default AddressDetails;
