import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import FormErrorStrip from "../ui/FormErrorStrip";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserSchema } from "@/schema";
import { APIResponse } from "@/types/APIResponse";
import { IUser } from "@/types/collections";
import { useAppDispatch } from "@/hooks/useStore";
import { login, logout } from "@/features/authSlice";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { Eye, EyeOff } from "lucide-react";
import { PathConstants } from "@/lib/variables";

type LoginFormInputs = z.infer<typeof loginUserSchema>;
type LoginResponseData = {
  accessToken: string;
  refreshToken: string;
  user: IUser;
};

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [passwordInputType, setPasswordInputType] = useState<
    "password" | "text"
  >("password");

  const togglePasswordInputType = () => {
    if (passwordInputType === "password") {
      setPasswordInputType("text");
    } else {
      setPasswordInputType("password");
    }
  };

  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      identifier: "",
      password: "",
    },
    resolver: zodResolver(loginUserSchema),
  });

  const loginSubmitHandler: SubmitHandler<LoginFormInputs> = async (
    data: LoginFormInputs
  ) => {
    try {
      const res = await AxiosAPIInstance.post<APIResponse<LoginResponseData>>(
        "/api/v1/user/login",
        {
          identifier: data.identifier,
          password: data.password,
        }
      );

      if (res.data.success) {
        dispatch(login(res.data.data?.user));
        toast({
          title: res.data.message,
        });
        navigate("/");
      }
    } catch (error: any) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Something went wrong!",
          variant: "destructive",
        });
      }

      console.error(error);
      dispatch(logout());
    }
  };

  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader className="text-center space-y-0">
        <CardTitle className="text-xl font-bold leading-tight">
          Login to your account
        </CardTitle>

        <CardDescription>
          Don't have an account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            <Button className="p-0" variant="link">
              Sign Up
            </Button>
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="login-form"
          onSubmit={handleSubmit(loginSubmitHandler)}
          className="space-y-4"
        >
          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="identifier">Identifier:</Label>
            <Input
              {...register("identifier")}
              id="identifier"
              type="text"
              placeholder="Enter your email or username"
            />
            {errors.identifier && (
              <FormErrorStrip
                errorMessage={errors.identifier.message as string}
              />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="password">Password:</Label>
            <div className="flex items-center">
              <Input
                {...register("password")}
                id="password"
                type={passwordInputType}
                placeholder="Enter your password"
                className="w-full"
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

            <div className="flex items-center justify-end mt-1">
              <Link to={PathConstants.FORGOTPASSWORD}>
                <Button
                  type="button"
                  className="py-0 text-primary"
                  variant="link"
                >
                  Forgot Password?
                </Button>
              </Link>
            </div>
          </div>

          {errors.root && (
            <FormErrorStrip errorMessage={errors.root.message as string} />
          )}

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Submitting..." : "Continue"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
