import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight, ShieldCheck } from "lucide-react";

import FormInput from "@/components/common/FormInput";
import { resetPasswordSchema } from "../schemas/auth.schema";
import { useResetPasswordMutation } from "../authApi";
import { Button } from "@/components/ui/button";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        token: data.token,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success("Password updated. Please log in.");

      navigate("/login", {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Unable to reset password");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/60 bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-gradient text-sm font-bold text-white shadow-brand">
              L
            </span>

            <span className="text-base font-bold tracking-tight text-foreground">
              LoanPro
            </span>
          </Link>

          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to login
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto w-full max-w-[440px]">
          {/* Heading */}
          <div className="mb-7">
            <span className="section-eyebrow">Account recovery</span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-[2rem]">
              Create a new password
            </h1>

            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
              Choose a new password for your LoanPro account.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <input type="hidden" {...register("token")} />

              <FormInput
                label="New password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Enter new password"
                {...register("newPassword")}
                error={errors.newPassword}
              />

              <FormInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                error={errors.confirmPassword}
              />

              {!token && (
                <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5">
                  <p className="text-xs leading-5 text-destructive">
                    This reset link is missing a token. Request a new one from
                    the login page.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="group w-full"
                size="lg"
                disabled={!token}
                loading={isLoading}
              >
                {isLoading ? (
                  "Updating..."
                ) : (
                  <>
                    Update password
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Login */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 hover:underline"
            >
              Log in
            </Link>
          </p>

          {/* Trust */}
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            <span>Your account information remains secure</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ResetPassword;
