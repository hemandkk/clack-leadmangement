"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLeaveCalendar } from "@/hooks/useLeaves";
import { StaffAvatar } from "../staff/StaffAvatar";
import { LeaveTypeBadge } from "../staff/LeaveBadges";
import { Button } from "@/components/ui/button";
import { cn } from "@leadpro/utils";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import type { Leave } from "@leadpro/types";

const LEAVE_COLORS: Record<string, string> = {
  casual: "bg-blue-100 text-blue-700 border-blue-200",
  sick: "bg-red-100 text-red-700 border-red-200",
  emergency: "bg-orange-100 text-orange-700 border-orange-200",
  earned: "bg-purple-100 text-purple-700 border-purple-200",
  unpaid: "bg-slate-100 text-slate-600 border-slate-200",
};

export function LeaveCalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  const { data, isLoading } = useLeaveCalendar(year, month);
  const leaves: Leave[] = data?.leaves ?? [];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start of month to align with weekday
  const startPad = getDay(monthStart);

  const getLeavesForDay = (date: Date) =>
    leaves.filter((l) => {
      const from = new Date(l.fromDate);
      const to = new Date(l.toDate);
      return date >= from && date <= to && l.status === "approved";
    });

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {/* Calendar header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-900">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-slate-400"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {/* Empty start pads */}
        {[...Array(startPad)].map((_, i) => (
          <div
            key={`pad-${i}`}
            className="min-h-[90px] border-b border-r border-slate-100 bg-slate-50/50"
          />
        ))}

        {days.map((day) => {
          const dayLeaves = getLeavesForDay(day);
          const today = isToday(day);
          const isWeekend = [0, 6].includes(getDay(day));

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[90px] p-1.5 border-b border-r border-slate-100",
                isWeekend && "bg-slate-50/50",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs mb-1",
                  today
                    ? "bg-slate-900 text-white font-semibold"
                    : "text-slate-500",
                )}
              >
                {format(day, "d")}
              </span>

              <div className="space-y-0.5">
                {dayLeaves.slice(0, 3).map((leave) => (
                  <div
                    key={leave.id}
                    className={cn(
                      "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] border truncate",
                      LEAVE_COLORS[leave.type],
                    )}
                    title={`${leave.staffName} — ${leave.type}`}
                  >
                    <span className="font-medium truncate">
                      {leave.staffName.split(" ")[0]}
                    </span>
                  </div>
                ))}
                {dayLeaves.length > 3 && (
                  <p className="text-[10px] text-slate-400 px-1">
                    +{dayLeaves.length - 3} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 px-5 py-3 border-t border-slate-100 flex-wrap">
        {Object.entries(LEAVE_COLORS).map(([type, cls]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={cn("h-3 w-3 rounded border", cls)} />
            <span className="text-xs text-slate-500 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
