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
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="
              space-y-5
            "
          >
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

            <Button
              className="
                w-full
              "
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-primary underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;
