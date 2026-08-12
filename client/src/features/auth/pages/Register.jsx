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
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      px-4
    "
    >
      <Card
        className="
        w-full
        max-w-md
      "
      >
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="
              space-y-5
            "
          >
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

            <Button
              className="
                w-full
              "
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary underline-offset-4 hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
