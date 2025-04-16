import { useToast } from "@/hooks/use-toast";
import { PathConstants } from "@/lib/variables";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { passwordResetValidator } from "@/schema/user/signupValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FormErrorStrip from "../ui/FormErrorStrip";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AxiosError } from "axios";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";

type ResetPasswordInputs = z.infer<typeof passwordResetValidator>;

const ResetPassword: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [passwordInputType, setPasswordInputType] = useState<
    "password" | "text"
  >("password");

  const [cnfPasswordInputType, setCnfPasswordInputType] = useState<
    "password" | "text"
  >("password");

  const togglePasswordInputType = () => {
    if (passwordInputType === "password") {
      setPasswordInputType("text");
    } else {
      setPasswordInputType("password");
    }
  };

  const toggleCnfPasswordInputType = () => {
    if (cnfPasswordInputType === "password") {
      setCnfPasswordInputType("text");
    } else {
      setCnfPasswordInputType("password");
    }
  };

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInputs>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(passwordResetValidator),
  });

  const resetPasswordSubmitHandler: SubmitHandler<ResetPasswordInputs> = async (
    data: ResetPasswordInputs
  ) => {
    if (data.password.toString() !== data.confirmPassword.toString()) {
      setError("root", {
        type: "value",
        message: "Confirm Passwords and Password must be same",
      });

      return;
    }

    try {
      const res = await AxiosAPIInstance.put<APIResponse<null>>(
        `/api/v1/user/password/reset/${token}`,
        {
          password: data.password,
        }
      );

      if (res.data.success) {
        toast({
          title: res.data.message,
          description: "Please login to coninue",
        });

        navigate(PathConstants.LOGIN);
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Something went wrong!",
          variant: "destructive",
        });

        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (!token || !token?.length) {
      toast({
        title: "Invalid Password Reset Token!",
        variant: "destructive",
      });

      navigate(PathConstants.FORGOTPASSWORD);
    }
  }, [token]);

  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader className="text-center space-y-0">
        <CardTitle className="text-xl font-bold leading-tight">
          Reset Password
        </CardTitle>

        <CardDescription>Reset your account Password</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="reset-password-form"
          onSubmit={handleSubmit(resetPasswordSubmitHandler)}
          className="space-y-4"
        >
          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="password">Password:</Label>
            <div className="flex items-center">
              <Input
                {...register("password")}
                id="password"
                type={passwordInputType}
                placeholder="Enter your password"
              />
              <Button
                type="button"
                aria-label="Toggle password visibility"
                data-state={passwordInputType}
                data-disabled={isSubmitting}
                onClick={togglePasswordInputType}
                variant="ghost"
                className="-ml-12"
              >
                {passwordInputType === "password" && (
                  <Eye className="h-4 w-4" />
                )}
                {passwordInputType === "text" && <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <FormErrorStrip
                errorMessage={errors.password.message as string}
              />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="confirmPassword">Confirm Password:</Label>
            <div className="flex items-center">
              <Input
                {...register("confirmPassword")}
                id="confirmPassword"
                type={cnfPasswordInputType}
                placeholder="Re-enter your password"
              />
              <Button
                type="button"
                aria-label="Toggle confirm password visibility"
                data-state={cnfPasswordInputType}
                data-disabled={isSubmitting}
                onClick={toggleCnfPasswordInputType}
                variant="ghost"
                className="-ml-12"
              >
                {cnfPasswordInputType === "password" && (
                  <Eye className="h-4 w-4" />
                )}
                {cnfPasswordInputType === "text" && (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <FormErrorStrip
                errorMessage={errors.confirmPassword.message as string}
              />
            )}
          </div>

          {errors.root && (
            <FormErrorStrip errorMessage={errors.root.message as string} />
          )}

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Updating Password..." : "Update Password"}
          </Button>
        </form>

        <CardDescription className="text-center mt-4">
          Link expired?
          <Link to={PathConstants.FORGOTPASSWORD} className="ml-1">
            <Button type="button" className="p-0" variant="link">
              Generate new link
            </Button>
          </Link>
        </CardDescription>

        <CardDescription className="text-center">
          Remembered your password?
          <Link to={PathConstants.LOGIN} className="ml-1">
            <Button type="button" className="p-0" variant="link">
              Login
            </Button>
          </Link>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ResetPassword;
