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

export type LeadType = "new" | "existing";

export interface ContactNumber {
  id?: string;
  number: string;
  label: "mobile" | "work" | "home" | "other";
  isPrimary: boolean;
  mobile_prefix?: string;
}
export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number;
  category?: string;
  isActive: boolean;
}
export interface Organisation {
  id: string;
  name: string;
  industry?: string;
  website?: string;
}
export interface Lead {
  id: string;
  name: string;
  phone: string;
  contactNumbers: ContactNumber[];
  email?: string;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  assignedTo?: string;
  type?: string;
  assignedStaff?: {
    id: string;
    name: string;
    avatar?: string;
  };
  organisation?: Organisation;
  products?: Product[];
  expectedClosureDate?: string;
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
  type?: LeadType;
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
export interface ApiContactNumber {
  mobile_prefix: string;
  number: string;
  label: string;
  isPrimary: boolean;
}

export interface ApiLead {
  id: number;
  name: string;
  email: string;
  contactNumbers: ApiContactNumber[];
  source: string;
  priority: string;
  type: string;
  assignedTo: number | null;
  productIds: number[];
  expectedClosureDate: string;
  value: number | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
