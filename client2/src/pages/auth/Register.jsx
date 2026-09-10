import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, CircleAlert, Lock, ShieldCheck } from "lucide-react";

import FormInput from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";

import { registerSchema } from "../../features/auth/schemas/auth.schema";
import { useRegisterMutation } from "@/features/auth/api/authApi";
import { setCredentials } from "../../features/auth/authSlice";

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
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md bg-brand-gradient text-sm font-bold text-white shadow-brand">
              L
            </span>

            <div>
              <span className="block text-base font-bold tracking-tight text-foreground">
                LoanPro
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:block">
                Lending platform
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to home
          </Link>
        </div>
      </header>

      {/* Page */}
      <section className="px-4 py-5 md:px-6 md:py-7">
        <div className="mx-auto max-w-5xl">
          {/* Page heading */}
          <div className="mb-4">
            <span className="section-eyebrow">Get started</span>

            <h1 className="mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Create your LoanPro account
            </h1>

            <p className="mt-1 text-xs text-muted-foreground">
              Register once, then manage your loan application and account in
              one place.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
            {/* Register card */}
            <div className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-4">
              {/* Tab-style header */}
              <div
                role="tablist"
                aria-label="Login or register"
                className="grid grid-cols-2 gap-1 rounded-md bg-muted/60 p-1"
              >
                <Link
                  to="/login"
                  role="tab"
                  aria-selected="false"
                  className="grid h-9 place-items-center rounded-md text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  Log in
                </Link>

                <button
                  type="button"
                  role="tab"
                  aria-selected="true"
                  className="h-9 rounded-md bg-card text-xs font-semibold text-primary shadow-sm"
                >
                  Register
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 space-y-3"
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

                {/* Security information */}
                <div className="flex items-start gap-2 rounded-md border border-border bg-muted/30 px-2.5 py-2.5">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />

                  <p className="text-[11px] leading-5 text-muted-foreground">
                    Your account helps keep your loan application, documents
                    and related information secure and organized.
                  </p>
                </div>

                {Object.keys(errors).length > 0 && (
                  <div className="flex items-start gap-1.5 text-xs font-medium text-destructive">
                    <CircleAlert className="mt-0.5 size-3.5 shrink-0" />
                    <span>
                      Please correct the highlighted fields and try again.
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="group h-11 w-full rounded-md"
                  size="lg"
                  loading={isLoading}
                >
                  {isLoading ? (
                    "Please wait..."
                  ) : (
                    <>
                      Create account & continue
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Google placeholder */}
              <div className="my-3 flex items-center gap-2">
                <span className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-medium text-muted-foreground">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <button
                type="button"
                disabled
                className="grid h-11 w-full place-items-center rounded-md border border-border bg-card text-xs font-semibold text-muted-foreground opacity-60"
                title="Google authentication will be implemented later"
              >
                Continue with Google
              </button>

              <p className="mt-3 text-[11px] leading-snug text-muted-foreground">
                By creating an account, you agree to use LoanPro in accordance
                with its applicable terms and policies.
              </p>
            </div>

            {/* Security panel */}
            <aside className="space-y-2">
              <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                <h2 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <ShieldCheck className="size-4 text-primary" />
                  Safe & secure
                </h2>

                <ul className="mt-2 space-y-1.5 text-[11px] leading-snug text-muted-foreground">
                  <li>256-bit encryption on every session</li>
                  <li>We never ask for OTP, PIN or CVV on call</li>
                  <li>Your information is used only for your application</li>
                </ul>
              </div>

              <div className="flex items-start gap-1.5 rounded-lg border border-border bg-card p-3 text-[11px] leading-snug text-muted-foreground">
                <Lock className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  Registration does not change any of your existing LoanPro
                  application or account data.
                </span>
              </div>
            </aside>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Register;