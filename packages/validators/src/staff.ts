import { z } from "zod";

export const inviteStaffSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  role: z.enum(["manager", "sales_staff"]),
  phone: z.string().optional(),
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
