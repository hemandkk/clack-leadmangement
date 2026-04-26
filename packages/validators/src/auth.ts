import { z } from "zod";

export const loginSchema = z.object({
  //email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobile_prefix: z.string().min(1, "Required"),
  mobile: z.string().min(6, "Invalid phone number"),
  //phone: z.string().regex(/^[0-9]{6,15}$/, "Invalid phone number"),
});
export const registerSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 8 characters"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[a-z]/, "Must contain lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    mobile_prefix: z.string().min(1, "Required"),
    mobile: z.string().regex(/^[0-9]{6,15}$/, "Invalid phone number"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
