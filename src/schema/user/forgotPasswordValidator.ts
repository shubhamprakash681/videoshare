import { z } from "zod";

export const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required" }),
});
