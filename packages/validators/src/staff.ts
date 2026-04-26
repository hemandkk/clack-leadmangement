import { z } from "zod";

export const inviteStaffSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  mobilePrefix: z.string().min(1, "Select country code"),
  phone: z.string().min(7, "Valid phone number required"),
  role: z.enum(["owner", "manager", "sales_staff", "custom"]),
  permissions: z.array(z.string()).min(1, "Assign at least one permission"),
  designation: z.string().optional(),
  department: z.string().optional(),
  employeeId: z.string().optional(),
  sendInviteEmail: z.boolean().default(true),
});
export const updateStaffRoleSchema = z.object({
  role: z.enum(["owner", "manager", "sales_staff", "custom"]),
  permissions: z.array(z.string()).min(1, "Assign at least one permission"),
});
export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name required"),
  mobilePrefix: z.string().min(1, "Select country code"),
  phone: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
});
export const acceptInviteSchema = z
  .object({
    token: z.string().min(1),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain uppercase letter")
      .regex(/[0-9]/, "Must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const updateStaffSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  role: z.enum(["manager", "sales_staff"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const setTargetSchema = z.object({
  period: z.enum(["daily", "weekly", "monthly"]),
  leadsTarget: z.number().min(0),
  callsTarget: z.number().min(0),
  revenueTarget: z.number().min(0),
  month: z.number().min(1).max(12).optional(),
  year: z.number().min(2020),
});

export type InviteStaffInput = z.infer<typeof inviteStaffSchema>;
export type UpdateStaffInput = z.infer<typeof updateStaffSchema>;
export type SetTargetInput = z.infer<typeof setTargetSchema>;

export type UpdateStaffRoleInput = z.infer<typeof updateStaffRoleSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
