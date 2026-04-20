export type WhatsAppStatus =
  | "not_connected"
  | "pending_verification"
  | "connected"
  | "disconnected"
  | "error";

export interface WhatsAppConfig {
  id: string;
  tenantId: string;
  status: WhatsAppStatus;
  phoneNumber?: string;
  phoneNumberId?: string;
  businessAccountId?: string;
  displayName?: string;
  qualityRating?: "green" | "yellow" | "red";
  webhookVerified: boolean;
  accessToken?: string; // masked on read: "wba_••••••1234"
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  components: WhatsAppTemplateComponent[];
}

export interface WhatsAppTemplateComponent {
  type: "HEADER" | "BODY" | "FOOTER" | "BUTTONS";
  text?: string;
  buttons?: { type: string; text: string; url?: string }[];
}

// ─── Webhooks ──────────────────────────────────────────────
export type WebhookEvent =
  | "lead.created"
  | "lead.updated"
  | "lead.assigned"
  | "lead.status_changed"
  | "call.completed"
  | "call.recorded"
  | "leave.applied"
  | "leave.approved";

export interface Webhook {
  id: string;
  tenantId: string;
  name: string;
  url: string;
  secret: string; // masked on read
  events: WebhookEvent[];
  isActive: boolean;
  lastTriggeredAt?: string;
  lastStatus?: number; // HTTP response code
  failureCount: number;
  createdAt: string;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  statusCode: number;
  duration: number; // ms
  requestBody: string;
  responseBody?: string;
  createdAt: string;
}

// ─── Tenant settings ───────────────────────────────────────
export interface TenantSettings {
  id: string;
  tenantId: string;

  // General
  companyName: string;
  timezone: string;
  dateFormat: string;
  currency: string;

  // Notifications
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  notifyOnNewLead: boolean;
  notifyOnLeadAssigned: boolean;
  notifyOnLeaveApplied: boolean;

  // Lead settings
  autoAssignLeads: boolean;
  autoAssignStrategy: "round_robin" | "least_loaded" | "manual";
  leadExpiryDays?: number;

  // Business hours
  businessHours: BusinessHours;
}

export interface BusinessHours {
  enabled: boolean;
  timezone: string;
  schedule: DaySchedule[];
}

export interface DaySchedule {
  day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  isOpen: boolean;
  openTime: string; // "09:00"
  closeTime: string; // "18:00"
}
