"use client";

import { Target } from "lucide-react";
import { TargetProgressBar } from "@/components/tenant/staff/TargetProgressBar";
import { formatCurrency } from "@leadpro/utils";
import type { TargetSummary } from "@leadpro/types";

interface Props {
  target: TargetSummary;
  isLoading: boolean;
}

export function MyTargetWidget({ target, isLoading }: Props) {
  const overallPct = target.leadsTarget
    ? Math.round(
        ((target.leadsAchieved / target.leadsTarget) * 0.4 +
          (target.callsAchieved / (target.callsTarget || 1)) * 0.3 +
          (target.revenueAchieved / (target.revenueTarget || 1)) * 0.3) *
          100,
      )
    : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-4 w-4 text-purple-500" />
        <h3 className="text-sm font-semibold text-slate-900">Monthly target</h3>
        <span
          className={`ml-auto text-sm font-bold ${
            overallPct >= 100
              ? "text-green-600"
              : overallPct >= 60
                ? "text-blue-600"
                : overallPct >= 30
                  ? "text-yellow-600"
                  : "text-red-500"
          }`}
        >
          {overallPct}%
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <TargetProgressBar
            label="Leads closed"
            achieved={target.leadsAchieved}
            target={target.leadsTarget}
          />
          <TargetProgressBar
            label="Calls made"
            achieved={target.callsAchieved}
            target={target.callsTarget}
          />
          <div>
            <TargetProgressBar
              label="Revenue"
              achieved={target.revenueAchieved}
              target={target.revenueTarget}
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>{formatCurrency(target.revenueAchieved)} achieved</span>
              <span>{formatCurrency(target.revenueTarget)} target</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
