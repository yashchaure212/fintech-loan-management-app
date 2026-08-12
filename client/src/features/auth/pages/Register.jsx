import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useNavigate, Link } from "react-router-dom";

import { toast } from "react-hot-toast";

import AuthInput from "../components/AuthInput";

import { registerSchema } from "../schemas/auth.schema";

import { useRegisterMutation } from "../authApi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

function Register() {
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    try {
      // confirmPassword is client-side only, don't send it to the API
      const { confirmPassword, ...payload } = data;

      await registerUser(payload).unwrap();

      toast.success("Account created — please log in");
      navigate("/login");
    } catch (error) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,hsl(var(--accent-blue-soft)),transparent_34rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-floating lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden overflow-hidden bg-navy-gradient p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 top-16 h-60 w-60 rounded-full bg-violet-400/15 blur-3xl" />
          <div className="relative">
            <Link to="/" className="flex items-center gap-3 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 font-bold ring-1 ring-white/20">L</span>
              <div><p className="font-bold">LoanPro</p><p className="text-xs text-white/70">Digital lending platform</p></div>
            </Link>
            <div className="mt-20 max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">Start digitally</p>
              <h1 className="mt-4 text-4xl font-bold leading-tight text-white">One account for your loan application and journey.</h1>
              <p className="mt-5 text-base leading-7 text-white/75">Keep your details, documents, application progress and repayment information in one place.</p>
            </div>
          </div>
          <div className="relative rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold">Built for a clear application journey</p>
            <p className="mt-2 text-xs leading-5 text-white/70">Your account helps you continue applications and track what needs attention.</p>
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
              <span className="section-eyebrow">Create your account</span>
              <h1 className="mt-4 text-3xl font-bold">Create your LoanPro account</h1>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Start your application with a secure digital account.</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <AuthInput
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email address"
              register={register}
              error={errors.email}
            />

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
              placeholder="Create a password"
              register={register}
              error={errors.password}
            />

            <AuthInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              register={register}
              error={errors.confirmPassword}
            />
              <Button className="mt-2 w-full" size="xl" disabled={isLoading}>{isLoading ? "Creating account..." : "Create account"}</Button>
              <p className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Register;
