import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowRight, ShieldCheck } from "lucide-react";

import FormInput from "@/components/common/FormInput";
import { forgotPasswordSchema } from "../schemas/auth.schema";
import { useForgotPasswordMutation } from "../authApi";
import { Button } from "@/components/ui/button";

function ForgotPassword() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      phone: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await forgotPassword(data).unwrap();

      toast.success(
        response?.message ||
          "If an account exists for this phone number, a reset link has been sent.",
      );
    } catch (error) {
      toast.error(error?.data?.message || "Unable to process that request");
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
              Forgot your password?
            </h1>

            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
              Enter the phone number associated with your account. If it
              matches, we&apos;ll send a password reset link to your email.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              <FormInput
                label="Phone number"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter phone number"
                {...register("phone")}
                error={errors.phone}
              />

              <Button
                type="submit"
                className="group w-full"
                size="lg"
                loading={isLoading}
              >
                {isLoading ? (
                  "Sending..."
                ) : (
                  <>
                    Send reset link
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

export default ForgotPassword;
