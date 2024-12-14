import { z } from "zod";

export const uploadVideoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Video title must be of atleast 5 characters" })
    .max(20, { message: "Video title must not be more than 20 characters" }),

  description: z
    .string()
    .trim()
    .min(5, { message: "Video description must be of atleast 5 characters" }),

  thumbnail: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Thumbnail is required" })
    .refine((files) => files.length < 2, {
      message: "Choose a single file only",
    })
    .refine((files) => files[0].size < 5 * 1024 * 1024, {
      message: "Thumbnail file size should be less than 5MB",
    })
    .refine((files) => ["image/jpeg", "image/png"].includes(files[0].type), {
      message: '"Only JPEG or PNG images are allowed",',
    }),

  videoFile: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, { message: "Video is required" })
    .refine((files) => files.length < 2, {
      message: "Choose a single file only",
    })
    .refine((files) => files[0].size <= 50 * 1024 * 1024, {
      message: "Video file size should be less than 50MB",
    })
    .refine((files) => files[0].type.startsWith("video/"), {
      message: "File must be a video",
    }),
});
