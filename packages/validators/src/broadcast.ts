import { z } from "zod";

export const emailTemplateSchema = z.object({
  name: z.string().min(2, "Name required"),
  category: z.enum([
    "follow_up",
    "introduction",
    "promotional",
    "reminder",
    "invoice",
    "support",
    "custom",
  ]),
  subject: z.string().min(2, "Subject required"),
  bodyHtml: z.string().min(10, "Body required"),
  bodyText: z.string().optional(),
  previewText: z.string().optional(),
  fromName: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const whatsappTemplateSchema = z.object({
  name: z
    .string()
    .min(2, "Name required")
    .regex(/^[a-z0-9_]+$/, "Lowercase letters, numbers, underscores only"),
  category: z.enum([
    "follow_up",
    "introduction",
    "promotional",
    "reminder",
    "invoice",
    "support",
    "custom",
  ]),
  waCategory: z.enum(["MARKETING", "UTILITY", "AUTHENTICATION"]),
  language: z.string().default("en_US"),
  headerType: z
    .enum(["TEXT", "IMAGE", "VIDEO", "DOCUMENT", "NONE"])
    .default("NONE"),
  headerText: z.string().optional(),
  body: z.string().min(5, "Body required"),
  footer: z.string().optional(),
  buttons: z
    .array(
      z.object({
        type: z.enum(["QUICK_REPLY", "URL", "PHONE"]),
        text: z.string().min(1),
        value: z.string().optional(),
      }),
    )
    .optional(),
});

export const broadcastSchema = z.object({
  name: z.string().min(2, "Name required"),
  channel: z.enum(["email", "whatsapp"]),
  templateId: z.string().min(1, "Select a template"),
  audienceType: z.enum(["all", "segment", "manual"]),
  leadIds: z.array(z.string()).optional(),
  scheduledAt: z.string().optional(),
});

export type EmailTemplateInput = z.infer<typeof emailTemplateSchema>;
export type WhatsAppTemplateInput = z.infer<typeof whatsappTemplateSchema>;
export type BroadcastInput = z.infer<typeof broadcastSchema>;
