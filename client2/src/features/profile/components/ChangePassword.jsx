import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";
import { changePasswordSchema } from "@/features/auth/schemas/auth.schema";
import { useChangePasswordMutation } from "@/features/auth/authApi";

function ChangePassword() {
  const navigate = useNavigate();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      }).unwrap();

      toast.success("Password changed. Please log in again.");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.data?.message || "Unable to change password");
      reset(
        {
          currentPassword: "",
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        { keepErrors: true },
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="form-section space-y-6">
        {/* Section Header */}
        <div>
          <h3 className="section-title">Change Password</h3>
          <p className="text-helper mt-1">
            Update your password to keep your LoanPro account secure.
          </p>
        </div>

        {/* Current Password */}
        <div className="space-y-2">
          <FormInput
            label="Current password"
            name="currentPassword"
            type="password"
            {...register("currentPassword")}
            placeholder="Enter current password"
            error={errors.currentPassword}
          />
        </div>

        {/* New Password */}
        <div className="border-t border-subtle pt-5">
          <div className="space-y-5">
            <div>
              <p className="text-label">New password</p>
              <p className="text-helper mt-1">
                Choose a strong password you have not used before.
              </p>
            </div>

            <FormInput
              label="New password"
              name="newPassword"
              type="password"
              {...register("newPassword")}
              placeholder="Enter new password"
              error={errors.newPassword}
            />

            <FormInput
              label="Confirm new password"
              name="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm new password"
              error={errors.confirmPassword}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-subtle pt-5 sm:flex-row sm:justify-end">
          <Button type="submit" disabled={isLoading} className="min-h-11 px-6">
            {isLoading ? "Updating..." : "Change password"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default ChangePassword;
