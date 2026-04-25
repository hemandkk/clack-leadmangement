import { z } from "zod";

// Contact number schema
export const contactNumberSchema = z.object({
  id: z.string().optional(),
  mobile_prefix: z.string().optional(),
  number: z.string().min(7, "Enter a valid phone number"),
  label: z.enum(["mobile", "work", "home", "other"]).default("mobile"),
  isPrimary: z.boolean().default(false),
});

export const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  //phone: z.string().min(10, "Enter a valid phone number"),
  // Contact numbers — at least one required
  contactNumbers: z
    .array(contactNumberSchema)
    .min(1, "At least one contact number is required")
    .refine((nums) => nums.some((n) => n.isPrimary), {
      message: "Mark one number as primary",
    }),

  source: z.enum([
    "website",
    "whatsapp",
    "phone",
    "referral",
    "social",
    "manual",
  ]),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  type: z.enum(["new", "existing"]).default("new"),
  assignedTo: z.coerce.string().optional(),
  // Optional fields
  organisationId: z.string().optional(),
  productIds: z.array(z.string()).optional(),
  expectedClosureDate: z.string().optional(),
  value: z.number().min(0).optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export const updateLeadSchema = createLeadSchema.partial().extend({
  status: z
    .enum(["new", "contacted", "qualified", "proposal", "won", "lost"])
    .optional(),
});

export const addNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty"),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type AddNoteInput = z.infer<typeof addNoteSchema>;
export type ContactNumberInput = z.infer<typeof contactNumberSchema>;
