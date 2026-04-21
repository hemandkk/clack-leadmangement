export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "proposal"
  | "won"
  | "lost";

export type LeadSource =
  | "website"
  | "whatsapp"
  | "phone"
  | "referral"
  | "social"
  | "manual";

export type LeadPriority = "low" | "medium" | "high";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  assignedTo?: string;
  assignedStaff?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tenantId: string;
  notes?: string;
  tags?: string[];
  value?: number; // deal value estimate
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: "call" | "whatsapp" | "email" | "note" | "status_change" | "assignment";
  description: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  meta?: Record<string, unknown>;
}

export interface LeadFilters {
  status?: LeadStatus[];
  source?: LeadSource[];
  assignedTo?: string;
  priority?: LeadPriority;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export interface LeadListResponse {
  data: Lead[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}

// Kanban column definition
export interface KanbanColumn {
  id: LeadStatus;
  label: string;
  color: string;
  leads: Lead[];
}
