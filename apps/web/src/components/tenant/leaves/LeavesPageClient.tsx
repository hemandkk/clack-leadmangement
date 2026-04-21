"use client";

import { useState } from "react";
import { Plus, CalendarDays, List } from "lucide-react";
import { useLeavesList } from "@/hooks/useLeaves";
import { usePermissions } from "@/hooks/usePermissions";
import { LeaveListView } from "./LeaveListView";
import { LeaveCalendarView } from "./LeaveCalendarView";
import { ApplyLeaveModal } from "./ApplyLeaveModal";
import { Button } from "@/components/ui/button";
import { cn } from "@leadpro/utils";
import type { LeaveFilters } from "@leadpro/types";

type ViewMode = "list" | "calendar";

export function LeavesPageClient() {
  const { can, role } = usePermissions();
  const isManager = can("APPROVE_LEAVES");
  const [view, setView] = useState<ViewMode>("list");
  const [showApply, setShowApply] = useState(false);
  const [filters, setFilters] = useState<LeaveFilters>({
    page: 1,
    perPage: 20,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Leaves</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isManager
              ? "Manage team leave requests"
              : "Apply and track your leaves"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle — calendar only useful for managers */}
          {isManager && (
            <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white">
              {(["list", "calendar"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                    view === v
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  {v === "list" ? (
                    <>
                      <List className="h-3.5 w-3.5" /> List
                    </>
                  ) : (
                    <>
                      <CalendarDays className="h-3.5 w-3.5" /> Calendar
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
          <Button size="sm" onClick={() => setShowApply(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Apply for leave
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <LeaveListView
          filters={filters}
          onFiltersChange={setFilters}
          isManager={isManager}
        />
      ) : (
        <LeaveCalendarView />
      )}

      <ApplyLeaveModal open={showApply} onClose={() => setShowApply(false)} />
    </div>
  );
}
