"use client";

import { useState } from "react";
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Play,
} from "lucide-react";
import { useStaffCalls } from "@/hooks/useStaff";
import { formatDuration } from "@/lib/staffConfig";
import { formatDateTime } from "@leadpro/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@leadpro/utils";
import type { CallLog } from "@leadpro/types";

export function StaffCallsTab({ staffId }: { staffId: string }) {
  const [period, setPeriod] = useState("today");
  const { data, isLoading } = useStaffCalls(staffId, { period });

  const calls: CallLog[] = data?.calls ?? [];
  const stats = data?.stats;

  const DirectionIcon = {
    inbound: PhoneIncoming,
    outbound: PhoneOutgoing,
  };

  const statusColor = {
    answered: "text-green-600",
    missed: "text-red-500",
    rejected: "text-slate-400",
  };

  return (
    <div className="space-y-4">
      {/* Period selector + summary */}
      <div className="flex items-center justify-between">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-8 w-36 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>

        {stats && (
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <p className="font-semibold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-400">Total calls</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-green-600">{stats.answered}</p>
              <p className="text-xs text-slate-400">Answered</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900">
                {formatDuration(stats.totalDuration)}
              </p>
              <p className="text-xs text-slate-400">Total duration</p>
            </div>
            <div className="text-center">
              <p className="font-semibold text-slate-900">
                {formatDuration(stats.avgDuration)}
              </p>
              <p className="text-xs text-slate-400">Avg duration</p>
            </div>
          </div>
        )}
      </div>

      {/* Call list */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : calls.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <Phone className="h-8 w-8 text-slate-200 mx-auto mb-2" />
          <p className="text-sm text-slate-400">No calls in this period</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {calls.map((call) => {
            const Icon = DirectionIcon[call.direction];
            const color = statusColor[call.status];
            return (
              <div key={call.id} className="flex items-center gap-3 px-4 py-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center",
                    call.status === "answered" ? "bg-green-50" : "bg-red-50",
                  )}
                >
                  <Icon className={cn("h-4 w-4", color)} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {call.leadName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {call.direction} · {formatDateTime(call.createdAt)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className={cn("text-sm font-medium", color)}>
                    {call.status === "answered"
                      ? formatDuration(call.duration)
                      : call.status}
                  </p>
                </div>

                {call.recordingUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    title="Play recording"
                  >
                    <Play className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
