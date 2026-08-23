import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link, useSearchParams, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, ShieldCheck } from "lucide-react";

import FormInput from "@/components/common/FormInput";
import { Button } from "@/components/ui/button";

import { loginSchema } from "../schemas/auth.schema";
import { useLoginMutation } from "../authApi";
import { setCredentials } from "../authSlice";

function isSafeInternalPath(path) {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("://")
  );
}

function homePathForRole(role) {
  return role === "ADMIN" ? "/admin/dashboard" : "/customer/dashboard";
}

function buildRedirectPath(redirect, loanTypeId) {
  if (!isSafeInternalPath(redirect)) {
    return null;
  }

  if (!loanTypeId) {
    return redirect;
  }

  const separator = redirect.includes("?") ? "&" : "?";

  return `${redirect}${separator}loanTypeId=${encodeURIComponent(loanTypeId)}`;
}

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isAuthenticated, isInitialized } = useSelector(
    (state) => state.auth,
  );

  const [login, { isLoading }] = useLoginMutation();

  const [searchParams] = useSearchParams();

  const redirect = searchParams.get("redirect");
  const loanTypeId = searchParams.get("loanTypeId");

  const redirectPath = buildRedirectPath(redirect, loanTypeId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  if (isInitialized && isAuthenticated && user) {
    const role = user.role?.name;

    if (role !== "ADMIN" && redirectPath) {
      return <Navigate to={redirectPath} replace />;
    }

    return <Navigate to={homePathForRole(role)} replace />;
  }

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();

      const credentials = response?.data;

      if (!credentials?.user) {
        throw new Error("Invalid login response");
      }

      dispatch(setCredentials(credentials));

      toast.success("Login successful");

      const role = credentials.user.role?.name;

      if (!role) {
        throw new Error("User role is missing");
      }

      if (role !== "ADMIN" && redirectPath) {
        navigate(redirectPath, { replace: true });
        return;
      }

      navigate(homePathForRole(role), { replace: true });
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Login failed. Please try again.",
      );
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
      <section className="px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto w-full max-w-[460px]">
          {/* Heading */}
          <div className="mb-7">
            <span className="section-eyebrow">Secure account access</span>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-[2rem]">
              Welcome back
            </h1>

            <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
              Sign in to continue your loan application and manage your account.
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

              <FormInput
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register("password")}
                error={errors.password}
              />

              <div className="flex justify-end pt-0.5">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-primary hover:text-primary/80 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="group w-full"
                size="lg"
                loading={isLoading}
              >
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    Login
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Register */}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-primary/80 hover:underline"
            >
              Create an account
            </Link>
          </p>

          {/* Trust */}
          <div className="mt-7 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-primary" />
            <span>Secure access to your LoanPro account</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;
