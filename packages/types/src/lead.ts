export type LeadStatus = 
  | 'new' | 'contacted' | 'qualified' 
  | 'proposal' | 'won' | 'lost';

export type LeadSource = 
  | 'website' | 'whatsapp' | 'phone' 
  | 'referral' | 'social' | 'manual';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  source: LeadSource;
  assignedTo?: string;
  tenantId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}