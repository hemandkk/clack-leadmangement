import { cn } from "@leadpro/utils";
import { STATUS_CONFIG } from "@/lib/leadConfig";
import type { LeadStatus } from "@leadpro/types";

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        cfg.color,
        cfg.textColor,
        cfg.borderColor,
      )}
    >
      {cfg.label}
    </span>
  );
}
