import { z } from "zod";

export const loginUserSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});
