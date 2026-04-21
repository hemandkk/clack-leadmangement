import { cn } from "@leadpro/utils";
import { LEAVE_TYPE_CONFIG, LEAVE_STATUS_CONFIG } from "@/lib/staffConfig";
import type { LeaveType, LeaveStatus } from "@leadpro/types";

export function LeaveTypeBadge({ type }: { type: LeaveType }) {
  const cfg = LEAVE_TYPE_CONFIG[type];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        cfg.color,
        cfg.text,
      )}
    >
      {cfg.label}
    </span>
  );
}

export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const cfg = LEAVE_STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        cfg.color,
        cfg.text,
      )}
    >
      {cfg.label}
    </span>
  );
}
