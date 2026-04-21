"use client";

import { cn } from "@leadpro/utils";
import type { DashboardPeriod } from "@leadpro/types";

const OPTIONS: { value: DashboardPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "quarter", label: "Quarter" },
];

interface Props {
  value: DashboardPeriod;
  onChange: (p: DashboardPeriod) => void;
}

export function PeriodSelector({ value, onChange }: Props) {
  return (
    <div
      className="flex items-center border border-slate-200 rounded-lg
      p-0.5 bg-slate-50 gap-0.5"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            value === opt.value
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-700",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
