import type {
  StaffRole,
  StaffStatus,
  LeaveType,
  LeaveStatus,
} from "@leadpro/types";

export const ROLE_CONFIG: Record<
  StaffRole,
  { label: string; color: string; text: string }
> = {
  owner: { label: "Owner", color: "bg-purple-50", text: "text-purple-700" },
  manager: { label: "Manager", color: "bg-blue-50", text: "text-blue-700" },
  sales_staff: {
    label: "Sales Staff",
    color: "bg-slate-100",
    text: "text-slate-600",
  },
};

export const STAFF_STATUS_CONFIG: Record<
  StaffStatus,
  { label: string; color: string; text: string; dot: string }
> = {
  active: {
    label: "Active",
    color: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
  inactive: {
    label: "Inactive",
    color: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
  },
  invited: {
    label: "Invited",
    color: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
};

export const LEAVE_TYPE_CONFIG: Record<
  LeaveType,
  { label: string; color: string; text: string }
> = {
  casual: { label: "Casual", color: "bg-blue-50", text: "text-blue-700" },
  sick: { label: "Sick", color: "bg-red-50", text: "text-red-600" },
  emergency: {
    label: "Emergency",
    color: "bg-orange-50",
    text: "text-orange-700",
  },
  earned: { label: "Earned", color: "bg-purple-50", text: "text-purple-700" },
  unpaid: { label: "Unpaid", color: "bg-slate-100", text: "text-slate-600" },
};

export const LEAVE_STATUS_CONFIG: Record<
  LeaveStatus,
  { label: string; color: string; text: string }
> = {
  pending: { label: "Pending", color: "bg-yellow-50", text: "text-yellow-700" },
  approved: { label: "Approved", color: "bg-green-50", text: "text-green-700" },
  rejected: { label: "Rejected", color: "bg-red-50", text: "text-red-600" },
  cancelled: {
    label: "Cancelled",
    color: "bg-slate-100",
    text: "text-slate-500",
  },
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

export const getTargetPercent = (achieved: number, target: number): number => {
  if (!target) return 0;
  return Math.min(Math.round((achieved / target) * 100), 100);
};
