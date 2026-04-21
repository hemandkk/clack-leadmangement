export type LeaveType = "casual" | "sick" | "emergency" | "earned" | "unpaid";

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Leave {
  id: string;
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  type: LeaveType;
  status: LeaveStatus;
  fromDate: string; // ISO date "2024-06-10"
  toDate: string;
  totalDays: number;
  reason: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedByName?: string;
  appliedAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  staffId: string;
  casual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  earned: { total: number; used: number; remaining: number };
}

export interface LeaveFilters {
  status?: LeaveStatus[];
  staffId?: string;
  type?: LeaveType;
  month?: number;
  year?: number;
  page?: number;
  perPage?: number;
}
