import { z } from "zod";

export const applyLeaveSchema = z
  .object({
    type: z.enum(["casual", "sick", "emergency", "earned", "unpaid"]),
    fromDate: z.string().min(1, "Start date required"),
    toDate: z.string().min(1, "End date required"),
    reason: z.string().min(10, "Please provide a reason (min 10 characters)"),
  })
  .refine((d) => new Date(d.toDate) >= new Date(d.fromDate), {
    message: "End date must be on or after start date",
    path: ["toDate"],
  });

export const rejectLeaveSchema = z.object({
  reason: z.string().min(5, "Rejection reason required"),
});

export type ApplyLeaveInput = z.infer<typeof applyLeaveSchema>;
export type RejectLeaveInput = z.infer<typeof rejectLeaveSchema>;
