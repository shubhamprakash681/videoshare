import { z } from "zod";

export const usernameValidation = z
  .string()
  .trim()
  .min(2, { message: "Username must be of atleast 2 characters" })
  .max(20, { message: "Username must not be more than 20 characters" })
  .regex(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, {
    message: "Username must not contain special characters",
  });

// used regex summary:
// The username can consist of alphanumeric characters.
// Internal separators (spaces, underscores, or hyphens) are allowed.
// The first and last character must be alphanumeric.

const emailValidation = z.string().email({ message: "Invalid email address" });
const passwordValidation = z
  .string()
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, {
    message:
      "Password must have at least 8 characters.\nMust contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.\nCan contain special characters",
  });

const confirmPasswordValidation = z
  .string()
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, {
    message:
      "Confirm Password must have at least 8 characters.\nMust contain at least 1 uppercase letter, 1 lowercase letter, and 1 number.\nCan contain special characters",
  });

const fullnameValidation = z
  .string()
  .min(3, { message: "Full Name must be of atleast 3 characters" });

const avatarValidations = z
  .instanceof(FileList)
  .refine((files) => files?.length > 0, { message: "Avatar is required" })
  .refine((files) => files?.length < 2, {
    message: "Choose a single image only",
  })
  .refine((files) => files[0]?.size < 5 * 1024 * 1024, {
    message: "Avatar image file size should be less than 5MB",
  })
  .refine((files) => ["image/jpeg", "image/png"].includes(files[0]?.type), {
    message: "Only JPEG or PNG images are allowed",
  });

const coverImageValidations = z
  .instanceof(FileList)
  // .refine((files) => files.length > 0, { message: "Avatar is required" })
  .refine((files) => files.length < 2, {
    message: "Choose a single image only",
  })
  .refine(
    (files) => {
      if (files.length) {
        return files[0]?.size < 5 * 1024 * 1024;
      }

      return true;
    },
    {
      message: "Cover image file size should be less than 5MB",
    }
  )
  .refine(
    (files) => {
      if (files.length) {
        return ["image/jpeg", "image/png"].includes(files[0]?.type);
      }

      return true;
    },
    {
      message: "Only JPEG or PNG images are allowed",
    }
  );

export const registerUserSchema = z.object({
  username: usernameValidation,
  fullname: fullnameValidation,
  email: emailValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
  avatar: avatarValidations,
  coverImage: coverImageValidations,
});

export const passwordResetValidator = z.object({
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});

export const passwordUpdateValidator = z.object({
  currentPassword: z
    .string()
    .min(8, { message: "Old Password must be of atleast 8 characters" }),
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
});
