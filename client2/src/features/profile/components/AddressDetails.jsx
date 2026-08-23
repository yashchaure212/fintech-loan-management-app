import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import FormInput from "@/components/common/FormInput";

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
    return (
      <div className="flex min-h-48 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[hsl(var(--primary)/0.2)] border-t-[hsl(var(--primary))]" />
          <p className="text-sm text-secondary">Loading address...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Address Type */}
      <div className="form-section space-y-5">
        <div>
          <h3 className="section-title">Address Information</h3>
          <p className="text-helper mt-1">
            Provide your current or permanent residential address.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="address-type" className="text-label">
            Address Type
          </label>

          <select
            id="address-type"
            {...register("type")}
            className="h-11 w-full rounded-[var(--radius-md)] border border-default bg-[hsl(var(--card))] px-3 text-sm text-primary transition-colors duration-150 focus-visible:outline-none focus-visible:border-[hsl(var(--primary))] focus-visible:shadow-[0_0_0_2px_hsl(var(--background)),0_0_0_4px_hsl(var(--primary)/0.18)]"
          >
            <option value="CURRENT">Current Address</option>
            <option value="PERMANENT">Permanent Address</option>
          </select>

          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5">
          <FormInput
            label="Address Line 1"
            name="line1"
            {...register("line1")}
            placeholder="Enter address"
            error={errors.line1}
          />

          <FormInput
            label="Address Line 2"
            name="line2"
            {...register("line2")}
            placeholder="Apartment, Landmark (Optional)"
            error={errors.line2}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormInput
            label="City"
            name="city"
            {...register("city")}
            placeholder="Enter city"
            error={errors.city}
          />

          <FormInput
            label="State"
            name="state"
            {...register("state")}
            placeholder="Enter state"
            error={errors.state}
          />
        </div>

        <div className="max-w-full sm:max-w-xs">
          <FormInput
            label="Pincode"
            name="pincode"
            {...register("pincode")}
            placeholder="Enter pincode"
            error={errors.pincode}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-subtle pt-5 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          disabled={isUpdating || isCreating}
          className="min-h-11 px-6"
        >
          {isUpdating || isCreating ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
}

export default AddressDetails;
