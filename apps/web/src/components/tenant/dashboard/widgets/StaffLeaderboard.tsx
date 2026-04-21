"use client";

import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";
import { StaffAvatar } from "@/components/tenant/staff/StaffAvatar";
import { TargetProgressBar } from "@/components/tenant/staff/TargetProgressBar";
import { cn } from "@leadpro/utils";
import type { StaffPerformanceSummary } from "@leadpro/types";

interface Props {
  staff: StaffPerformanceSummary[];
  isLoading: boolean;
}

const RANK_STYLES = [
  "bg-amber-50 border-amber-200", // 1st
  "bg-slate-50 border-slate-200", // 2nd
  "bg-orange-50 border-orange-200", // 3rd
];

const RANK_ICONS = ["🥇", "🥈", "🥉"];

export function StaffLeaderboard({ staff, isLoading }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Staff leaderboard
          </h3>
        </div>
        <button
          onClick={() => router.push("/staff")}
          className="text-xs text-slate-400 hover:text-slate-700"
        >
          View all →
        </button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="py-12 text-center text-sm text-slate-400">
          No staff data yet
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {staff.map((member, i) => (
            <div
              key={member.id}
              onClick={() => router.push(`/staff/${member.id}`)}
              className={cn(
                "flex items-center gap-4 px-5 py-3.5 cursor-pointer",
                "hover:bg-slate-50 transition-colors",
              )}
            >
              {/* Rank */}
              <span className="text-base w-6 text-center shrink-0">
                {i < 3 ? (
                  RANK_ICONS[i]
                ) : (
                  <span className="text-xs text-slate-400">{i + 1}</span>
                )}
              </span>

              {/* Avatar */}
              <StaffAvatar
                name={member.name}
                avatar={member.avatar}
                isOnLeave={member.isOnLeave}
                size="sm"
              />

              {/* Name + target bar */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {member.name}
                </p>
                <TargetProgressBar
                  label=""
                  achieved={member.targetPct}
                  target={100}
                  unit="%"
                />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 shrink-0 text-center">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {member.leads}
                  </p>
                  <p className="text-[10px] text-slate-400">Leads</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-600">
                    {member.won}
                  </p>
                  <p className="text-[10px] text-slate-400">Won</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {member.calls}
                  </p>
                  <p className="text-[10px] text-slate-400">Calls</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
