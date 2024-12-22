import { useAppDispatch } from "@/hooks/useStore";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { APIResponse } from "@/types/APIResponse";
import { IUser } from "@/types/collections";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUserSchema } from "@/schema";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import FormErrorStrip from "../ui/FormErrorStrip";
import { logout } from "@/features/authSlice";
import { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { AxiosAPIInstance } from "@/lib/AxiosInstance";

type SignupFormInputs = z.infer<typeof registerUserSchema>;
type SignupResponseData = {
  user: IUser;
};

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const {
    handleSubmit,
    register,
    setError,
    // watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInputs>({
    defaultValues: {
      username: "",
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
      avatar: undefined,
      coverImage: undefined,
    },
    resolver: zodResolver(registerUserSchema),
  });

  const signupSubmitHandler: SubmitHandler<SignupFormInputs> = async (
    data: SignupFormInputs
  ) => {
    if (data.password.toString() !== data.confirmPassword.toString()) {
      setError("root", {
        type: "value",
        message: "Confirm Passwords and Password must be same",
      });

      return;
    }

    const payload = {
      username: data.username,
      fullname: data.fullname,
      email: data.email,
      password: data.password,
      avatar: data.avatar[0],
      coverImage: data.coverImage.length && data.coverImage[0],
    };

    try {
      const res = await AxiosAPIInstance.post<APIResponse<SignupResponseData>>(
        "/api/v1/user/register",
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast({
          title: res.data.message,
        });
        navigate("/login");
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

  // TODO: add image preview
  // const avatarPreview = watch("avatar");
  // const coverImagePreview = watch("coverImage");

  return (
    <Card className="w-[400px] mx-auto">
      <CardHeader className="text-center space-y-0">
        <CardTitle className="text-xl font-bold leading-tight">
          Sign up to create account
        </CardTitle>

        <CardDescription>
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            <Button className="p-0" variant="link">
              Sign In
            </Button>
          </Link>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          id="signup-form"
          onSubmit={handleSubmit(signupSubmitHandler)}
          className="space-y-4"
        >
          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="username">Username:</Label>
            <Input
              {...register("username")}
              id="username"
              type="text"
              placeholder="Enter your preferred username"
            />
            {errors.username && (
              <FormErrorStrip
                errorMessage={errors.username.message as string}
              />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="fullname">Full Name:</Label>
            <Input
              {...register("fullname")}
              id="fullname"
              type="text"
              placeholder="Enter your full name"
            />
            {errors.fullname && (
              <FormErrorStrip
                errorMessage={errors.fullname.message as string}
              />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="email">Email:</Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <FormErrorStrip errorMessage={errors.email.message as string} />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="password">Password:</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="Enter your password"
            />
            {errors.password && (
              <FormErrorStrip
                errorMessage={errors.password.message as string}
              />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="confirmPassword">Confirm Password:</Label>
            <Input
              {...register("confirmPassword")}
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <FormErrorStrip
                errorMessage={errors.confirmPassword.message as string}
              />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="avatar">Avatar:</Label>
            <Input
              {...register("avatar")}
              id="avatar"
              type="file"
              accept="image/jpeg,image/png"
              placeholder="Upload your profile picture"
              multiple={false}
            />
            {errors.avatar && (
              <FormErrorStrip errorMessage={errors.avatar.message as string} />
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1">
            <Label htmlFor="coverImage">Cover Image:</Label>
            <Input
              {...register("coverImage")}
              id="coverImage"
              type="file"
              accept="image/jpeg,image/png"
              placeholder="Upload your cover image"
              multiple={false}
            />
            {errors.coverImage && (
              <FormErrorStrip
                errorMessage={errors.coverImage.message as string}
              />
            )}
          </div>

          {errors.root && (
            <FormErrorStrip errorMessage={errors.root.message as string} />
          )}

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
