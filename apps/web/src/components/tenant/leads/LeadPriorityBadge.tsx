import { cn } from "@leadpro/utils";
import { PRIORITY_CONFIG } from "@/lib/leadConfig";
import type { LeadPriority } from "@leadpro/types";

export function LeadPriorityBadge({ priority }: { priority: LeadPriority }) {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium",
        cfg.color,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}
