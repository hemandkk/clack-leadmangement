import { z } from "zod";

export const loginSchema = z.object({
  //email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobile_prefix: z.string().min(1, "Required"),
  mobile: z.string().min(6, "Invalid phone number"),
  //phone: z.string().regex(/^[0-9]{6,15}$/, "Invalid phone number"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type LoginInput = z.infer<typeof loginSchema>;
