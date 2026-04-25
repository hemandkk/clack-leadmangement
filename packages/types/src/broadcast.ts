export type TemplateChannel = "email" | "whatsapp";
export type TemplateCategory =
  | "follow_up"
  | "introduction"
  | "promotional"
  | "reminder"
  | "invoice"
  | "support"
  | "custom";
export type TemplateStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected";

export interface TemplateVariable {
  key: string; // e.g. "lead_name"
  label: string; // e.g. "Lead name"
  defaultValue?: string;
  required: boolean;
}

export interface EmailTemplate {
  id: string;
  tenantId: string;
  name: string;
  channel: "email";
  category: TemplateCategory;
  status: TemplateStatus;
  subject: string;
  bodyHtml: string; // rich HTML
  bodyText: string; // plain text fallback
  variables: TemplateVariable[];
  tags: string[];
  previewText?: string; // email preview in inbox
  fromName?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppTemplate {
  id: string;
  tenantId: string;
  name: string;
  channel: "whatsapp";
  category: TemplateCategory;
  status: TemplateStatus;
  waCategory: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  waTemplateId?: string; // Meta approved template ID
  language: string; // "en_US"
  headerType?: "TEXT" | "IMAGE" | "VIDEO" | "DOCUMENT" | "NONE";
  headerText?: string;
  headerMediaUrl?: string;
  body: string; // supports {{1}}, {{2}} or {{variable_name}}
  footer?: string;
  buttons?: WAButton[];
  variables: TemplateVariable[];
  rejectionReason?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WAButton {
  type: "QUICK_REPLY" | "URL" | "PHONE";
  text: string;
  value?: string; // URL or phone number
}

export type AnyTemplate = EmailTemplate | WhatsAppTemplate;

// ─── Broadcast ─────────────────────────────────────────────
export type BroadcastStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "completed"
  | "paused"
  | "failed";

export interface BroadcastMessage {
  id: string;
  tenantId: string;
  name: string;
  channel: TemplateChannel;
  templateId: string;
  templateName: string;
  status: BroadcastStatus;
  // Audience
  audienceType: "all" | "segment" | "manual";
  audienceFilters?: Record<string, unknown>;
  leadIds?: string[];
  totalAudience: number;
  // Stats
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  unsubscribed: number;
  // Scheduling
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
}
