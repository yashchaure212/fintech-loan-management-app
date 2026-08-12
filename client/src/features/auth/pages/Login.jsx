import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate, Link, useSearchParams, Navigate } from "react-router-dom";

import { toast } from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";

import AuthInput from "../components/AuthInput";

import { loginSchema } from "../schemas/auth.schema";

import { useLoginMutation } from "../authApi";

import { setCredentials } from "../authSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { storage } from "@/utils/storage";

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

    if (role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/customer/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();

      dispatch(setCredentials(response.data));

      storage.setRefreshToken(response.data.refreshToken);

      toast.success("Login successful");

      const role = response.data.user.role.name;

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (redirect) {
        const destination = loanTypeId
          ? `${redirect}?loanTypeId=${encodeURIComponent(loanTypeId)}`
          : redirect;

        navigate(destination, { replace: true });
      } else {
        navigate("/customer/dashboard");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary-soft)),transparent_34rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-floating lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-brand-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 font-bold ring-1 ring-white/20">L</span>
              <div><p className="font-bold">LoanPro</p><p className="text-xs text-white/70">Digital lending platform</p></div>
            </div>
            <div className="mt-20 max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-100">Education finance</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white">A simpler way to move your loan application forward.</h1>
              <p className="mt-5 text-base leading-7 text-white/75">Apply online, upload documents, follow every stage and stay in control of your application.</p>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><p className="text-xs text-white/65">Digital</p><p className="mt-1 font-semibold">Application journey</p></div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><p className="text-xs text-white/65">Secure</p><p className="mt-1 font-semibold">Document handling</p></div>
          </div>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient font-bold text-white shadow-brand">L</span>
                <span><span className="block font-bold">LoanPro</span><span className="block text-xs text-muted-foreground">Digital lending platform</span></span>
              </Link>
            </div>
            <div className="mb-8">
              <span className="section-eyebrow">Secure account access</span>
              <h1 className="mt-4 text-3xl font-bold">Welcome back</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Continue your loan journey from where you left off.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AuthInput
              label="Phone Number"
              name="phone"
              placeholder="Enter phone number"
              register={register}
              error={errors.phone}
            />

            <AuthInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              register={register}
              error={errors.password}
            />
              <Button className="mt-2 w-full" size="xl" disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</Button>
              <p className="text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link to="/register" className="font-semibold text-primary hover:underline">Sign up</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Login;
