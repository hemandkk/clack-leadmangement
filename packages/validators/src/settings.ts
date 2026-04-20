import { z } from "zod";

export const generalSettingsSchema = z.object({
  companyName: z.string().min(2, "Company name required"),
  timezone: z.string().min(1, "Timezone required"),
  dateFormat: z.string().min(1, "Date format required"),
  currency: z.string().min(1, "Currency required"),
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  whatsappNotifications: z.boolean(),
  notifyOnNewLead: z.boolean(),
  notifyOnLeadAssigned: z.boolean(),
  notifyOnLeaveApplied: z.boolean(),
});

export const leadSettingsSchema = z.object({
  autoAssignLeads: z.boolean(),
  autoAssignStrategy: z.enum(["round_robin", "least_loaded", "manual"]),
  leadExpiryDays: z.number().min(1).max(365).optional(),
});

export const webhookSchema = z.object({
  name: z.string().min(2, "Name required"),
  url: z.string().url("Must be a valid URL (https://)"),
  events: z.array(z.string()).min(1, "Select at least one event"),
  isActive: z.boolean().default(true),
});

export const whatsappConnectSchema = z.object({
  accessToken: z.string().min(10, "Access token required"),
  phoneNumberId: z.string().min(5, "Phone Number ID required"),
  businessAccountId: z.string().min(5, "Business Account ID required"),
});

export type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>;
export type NotificationSettingsInput = z.infer<
  typeof notificationSettingsSchema
>;
export type LeadSettingsInput = z.infer<typeof leadSettingsSchema>;
export type WebhookInput = z.infer<typeof webhookSchema>;
export type WhatsAppConnectInput = z.infer<typeof whatsappConnectSchema>;
