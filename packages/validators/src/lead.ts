import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  source: z.enum([
    "website",
    "whatsapp",
    "phone",
    "referral",
    "social",
    "manual",
  ]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  value: z.number().min(0).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z
    .enum(["new", "contacted", "qualified", "proposal", "won", "lost"])
    .optional(),
  assignedTo: z.string().optional(),
});

export const addNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;
