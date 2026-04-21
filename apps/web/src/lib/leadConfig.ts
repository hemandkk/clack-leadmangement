import type { LeadStatus, LeadSource, LeadPriority } from "@leadpro/types";

export const STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string;
    color: string; // tailwind bg
    textColor: string; // tailwind text
    borderColor: string; // tailwind border
  }
> = {
  new: {
    label: "New",
    color: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  contacted: {
    label: "Contacted",
    color: "bg-yellow-50",
    textColor: "text-yellow-700",
    borderColor: "border-yellow-200",
  },
  qualified: {
    label: "Qualified",
    color: "bg-purple-50",
    textColor: "text-purple-700",
    borderColor: "border-purple-200",
  },
  proposal: {
    label: "Proposal",
    color: "bg-orange-50",
    textColor: "text-orange-700",
    borderColor: "border-orange-200",
  },
  won: {
    label: "Won",
    color: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
  lost: {
    label: "Lost",
    color: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
};

export const PRIORITY_CONFIG: Record<
  LeadPriority,
  {
    label: string;
    color: string;
    dot: string;
  }
> = {
  low: { label: "Low", color: "text-slate-500", dot: "bg-slate-400" },
  medium: { label: "Medium", color: "text-yellow-600", dot: "bg-yellow-400" },
  high: { label: "High", color: "text-red-600", dot: "bg-red-500" },
};

export const SOURCE_CONFIG: Record<
  LeadSource,
  { label: string; icon: string }
> = {
  website: { label: "Website", icon: "🌐" },
  whatsapp: { label: "WhatsApp", icon: "💬" },
  phone: { label: "Phone", icon: "📞" },
  referral: { label: "Referral", icon: "👥" },
  social: { label: "Social", icon: "📱" },
  manual: { label: "Manual", icon: "✏️" },
};

export const KANBAN_COLUMNS: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
];
