import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import FormErrorStrip from "../ui/FormErrorStrip";
import { Button } from "../ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { forgotPasswordSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { PathConstants } from "@/lib/variables";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";
import { APIResponse } from "@/types/APIResponse";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

type ForgotPasswordFormInputs = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ForgotPasswordFormInputs>({
    defaultValues: {
      identifier: "",
    },
    resolver: zodResolver(forgotPasswordSchema),
  });

  const forgotPasswordSubmitHandler: SubmitHandler<
    ForgotPasswordFormInputs
  > = async (data: ForgotPasswordFormInputs) => {
    try {
      const res = await AxiosAPIInstance.get<APIResponse<null>>(
        `/api/v1/user/password/forgot?identifier=${data.identifier}`
      );

      if (res.data.success) {
        toast({
          title: res.data.message,
          description: "Check your email for the password reset link.",
        });

        setValue("identifier", "");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: error.response?.data.message || "Something went wrong!",
          variant: "destructive",
        });
      }

      console.error(error);
    }
  };

  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader className="text-center space-y-0">
        <CardTitle className="text-xl font-bold leading-tight">
          Forgot Password
        </CardTitle>

        <CardDescription>Get Password Reset Link</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="forgot-password-form"
          onSubmit={handleSubmit(forgotPasswordSubmitHandler)}
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

          {errors.root && (
            <FormErrorStrip errorMessage={errors.root.message as string} />
          )}

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Generating Link..." : "Get Password Reset Link"}
          </Button>
        </form>

        <CardDescription className="text-center mt-4">
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

export default ForgotPassword;
