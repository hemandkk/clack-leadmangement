"use client";

import { useState } from "react";
import { LayoutGrid, Table2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@leadpro/utils";
import { LeadFilters } from "./LeadFilters";
import { LeadKanban } from "./LeadKanban";
import { LeadTable } from "./LeadTable";
import { CreateLeadModal } from "./CreateLeadModal";
import type { LeadFilters as ILeadFilters } from "@leadpro/types";

type ViewMode = "kanban" | "table";

export function LeadsPageClient() {
  const [view, setView] = useState<ViewMode>("kanban");
  const [showCreate, setCreate] = useState(false);
  const [filters, setFilters] = useState<ILeadFilters>({
    page: 1,
    perPage: 25,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage and track your leads
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center border border-slate-200 rounded-lg p-0.5 bg-white">
            {(["kanban", "table"] as ViewMode[]).map((v) => (
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
                {v === "kanban" ? (
                  <>
                    <LayoutGrid className="h-3.5 w-3.5" /> Board
                  </>
                ) : (
                  <>
                    <Table2 className="h-3.5 w-3.5" /> Table
                  </>
                )}
              </button>
            ))}
          </div>

          <Button onClick={() => setCreate(true)} size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            Add lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <LeadFilters filters={filters} onChange={setFilters} />

      {/* Content */}
      {view === "kanban" ? (
        <LeadKanban filters={filters} />
      ) : (
        <LeadTable filters={filters} onFiltersChange={setFilters} />
      )}

      {/* Create modal */}
      <CreateLeadModal open={showCreate} onClose={() => setCreate(false)} />
    </div>
  );
}
