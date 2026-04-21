"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, CalendarX } from "lucide-react";
import { cn } from "@leadpro/utils";

interface Props {
  pendingLeaves: number;
  isLoading: boolean;
}

export function AlertsWidget({ pendingLeaves, isLoading }: Props) {
  const router = useRouter();
  if (isLoading || pendingLeaves === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {pendingLeaves > 0 && (
        <button
          onClick={() => router.push("/leaves?status=pending")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm",
            "bg-amber-50 border-amber-200 text-amber-800",
            "hover:bg-amber-100 transition-colors",
          )}
        >
          <CalendarX className="h-4 w-4 text-amber-500" />
          <span>
            <strong>{pendingLeaves}</strong> leave request
            {pendingLeaves !== 1 ? "s" : ""} pending approval
          </span>
        </button>
      )}
    </div>
  );
}
