import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useNavigate,
  Link,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, CircleAlert, Lock, ShieldCheck } from "lucide-react";

import FormInput from "@/components/shared/FormInput";
import { Button } from "@/components/ui/button";

import { loginSchema } from "../../features/auth/schemas/auth.schema";
import { useLoginMutation } from "@/features/auth/api/authApi";
import { setCredentials } from "../../features/auth/authSlice";

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
            <span className="section-eyebrow">Secure account access</span>

            <h1 className="mt-1.5 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Customer login
            </h1>

            <p className="mt-1 text-xs text-muted-foreground">
              Access your loans, EMIs and applications.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_280px]">
            {/* Login card */}
            <div className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-4">
              {/* Tab-style header */}
              <div
                role="tablist"
                aria-label="Login or register"
                className="grid grid-cols-2 gap-1 rounded-md bg-muted/60 p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected="true"
                  className="h-9 rounded-md bg-card text-xs font-semibold text-primary shadow-sm"
                >
                  Log in
                </button>

                <Link
                  to="/register"
                  role="tab"
                  aria-selected="false"
                  className="grid h-9 place-items-center rounded-md text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  Register
                </Link>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-4 space-y-3"
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
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
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
                      Log in
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
                By continuing, you agree to use LoanPro in accordance with its
                applicable terms and policies.
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
                  Your login credentials are securely processed through
                  LoanPro's authentication system.
                </span>
              </div>
            </aside>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
