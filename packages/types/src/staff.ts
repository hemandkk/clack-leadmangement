import { StaffRole } from "./staffManagement";
export type StaffStatus = "active" | "inactive" | "invited";

export interface Staff {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  status: StaffStatus;
  avatar?: string;
  joinedAt: string;
  createdAt: string;

  // Stats (populated by API)
  activeLeads?: number;
  totalLeads?: number;
  callsToday?: number;
  totalCallDuration?: number; // minutes
  isOnLeave?: boolean;
  currentLeaveEndDate?: string;

  // Targets
  monthlyTarget?: number; // lead count target
  monthlyAchieved?: number;
}

export interface StaffInvite {
  email: string;
  role: StaffRole;
  name: string;
}

// ─── Targets ───────────────────────────────────────────────
export type TargetPeriod = "daily" | "weekly" | "monthly";

export interface StaffTarget {
  id: string;
  staffId: string;
  period: TargetPeriod;
  year: number;
  month?: number; // for monthly targets
  week?: number; // for weekly targets
  leadsTarget: number;
  callsTarget: number;
  revenueTarget: number; // in base currency
  leadsAchieved: number;
  callsAchieved: number;
  revenueAchieved: number;
  createdAt: string;
}

// ─── Call logs ─────────────────────────────────────────────
export interface CallLog {
  id: string;
  staffId: string;
  staffName: string;
  leadId: string;
  leadName: string;
  direction: "inbound" | "outbound";
  duration: number; // seconds
  status: "answered" | "missed" | "rejected";
  recordingUrl?: string;
  notes?: string;
  createdAt: string;
}

// ─── Payments ──────────────────────────────────────────────
export interface PaymentRecord {
  id: string;
  staffId: string;
  staffName: string;
  period: string; // "2024-01" for Jan 2024
  baseAmount: number;
  incentiveAmount: number; // based on target achievement
  deductionAmount: number;
  totalAmount: number;
  targetAchievementPercent: number;
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
}
