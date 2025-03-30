import { useToast } from "@/hooks/use-toast";
import { passwordUpdateValidator } from "@/schema/user/signupValidator";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import FormErrorStrip from "../ui/FormErrorStrip";
import { PathConstants } from "@/lib/variables";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";

type UpdatePasswordInputs = z.infer<typeof passwordUpdateValidator>;

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currPasswordInputType, setCurrPasswordInputType] = useState<
    "password" | "text"
  >("password");

  const [passwordInputType, setPasswordInputType] = useState<
    "password" | "text"
  >("password");

  const [cnfPasswordInputType, setCnfPasswordInputType] = useState<
    "password" | "text"
  >("password");

  const toggleCurrentPasswordInputType = () => {
    if (currPasswordInputType === "password") {
      setCurrPasswordInputType("text");
    } else {
      setCurrPasswordInputType("password");
    }
  };

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
  } = useForm<UpdatePasswordInputs>({
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(passwordUpdateValidator),
  });

  const updatePasswordSubmitHandler: SubmitHandler<
    UpdatePasswordInputs
  > = async (data: UpdatePasswordInputs) => {
    if (data.password.toString() !== data.confirmPassword.toString()) {
      setError("root", {
        type: "value",
        message: "Confirm Passwords and Password must be same",
      });

      return;
    }

    try {
      const res = await AxiosAPIInstance.patch<APIResponse<null>>(
        "/api/v1/user/password/update",
        {
          oldPassword: data.currentPassword,
          newPassword: data.password,
        }
      );

      if (res.data.success) {
        toast({
          title: res.data.message,
          description: "Next time you login, use your new password.",
        });

        navigate(PathConstants.MYCHANNEL);
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

  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader className="text-center space-y-0">
        <CardTitle className="text-xl font-bold leading-tight">
          Update Password
        </CardTitle>

        <CardDescription>Update your account Password</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="update-password-form"
          onSubmit={handleSubmit(updatePasswordSubmitHandler)}
          className="space-y-4"
        >
          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="password">Current Password:</Label>
            <div className="flex items-center">
              <Input
                {...register("currentPassword")}
                id="currentPassword"
                type={currPasswordInputType}
                placeholder="Enter your current password"
              />
              <Button
                type="button"
                aria-label="Toggle current password visibility"
                data-state={currPasswordInputType}
                data-disabled={isSubmitting}
                onClick={toggleCurrentPasswordInputType}
                variant="ghost"
                className="-ml-12"
              >
                {currPasswordInputType === "password" && (
                  <Eye className="h-4 w-4" />
                )}
                {currPasswordInputType === "text" && (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.currentPassword && (
              <FormErrorStrip
                errorMessage={errors.currentPassword.message as string}
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
          <Button
            type="button"
            className="w-full"
            variant="outline"
            onClick={() => navigate(PathConstants.MYCHANNEL)}
          >
            Back
          </Button>
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default UpdatePassword;
