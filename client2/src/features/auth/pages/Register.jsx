import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, ShieldCheck } from "lucide-react";

import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";

import { registerSchema } from "../schemas/auth.schema";
import { useRegisterMutation } from "../authApi";
import { setCredentials } from "../authSlice";

function homePathForRole(role) {
  return role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard";
}

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isInitialized } = useSelector(
    (state) => state.auth,
  );

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (isInitialized && isAuthenticated && user) {
    return <Navigate to={homePathForRole(user.role?.name)} replace />;
  }

  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email,
        phone: data.phone,
        password: data.password,
      };

      const response = await registerUser(payload).unwrap();

      dispatch(setCredentials(response.data));

      toast.success("Account created");

      navigate(homePathForRole(response.data.user.role.name), {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.data?.message || "Registration failed");
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
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto w-full max-w-[480px]">
          {/* Heading */}
          <div className="mb-7">
            <span className="section-eyebrow">Get started</span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-[2rem]">
              Create your LoanPro account
            </h1>

            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
              Create a secure account to manage your loan application, documents
              and progress.
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
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                {...register("email")}
                error={errors.email}
              />

              <FormInput
                label="Phone number"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter phone number"
                {...register("phone")}
                error={errors.phone}
              />

              <FormInput
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                {...register("password")}
                error={errors.password}
              />

              <FormInput
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your password"
                {...register("confirmPassword")}
                error={errors.confirmPassword}
              />

              <div className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

                <p className="text-xs leading-5 text-muted-foreground">
                  Your account helps keep your loan application and related
                  information secure and organized.
                </p>
              </div>

              <Button
                type="submit"
                className="group w-full"
                size="lg"
                loading={isLoading}
              >
                {isLoading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create account
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Login */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary/80 hover:underline"
            >
              Log in
            </Link>
          </p>

          {/* Footer */}
          <p className="mt-6 text-center text-[11px] leading-5 text-muted-foreground/70">
            By creating an account, you agree to use LoanPro in accordance with
            its applicable terms and policies.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;
