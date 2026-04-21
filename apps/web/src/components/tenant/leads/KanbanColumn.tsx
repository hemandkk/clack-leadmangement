"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@leadpro/utils";
import { LeadCard } from "./LeadCard";
import type { Lead, LeadStatus } from "@leadpro/types";

interface Props {
  id: LeadStatus;
  label: string;
  colorClass: string;
  textColorClass: string;
  leads: Lead[];
}

export function KanbanColumn({
  id,
  label,
  colorClass,
  textColorClass,
  leads,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="w-72 shrink-0 flex flex-col">
      {/* Column header */}
      <div
        className={cn(
          "flex items-center justify-between px-3 py-2 rounded-lg mb-2",
          colorClass,
        )}
      >
        <span className={cn("text-xs font-semibold", textColorClass)}>
          {label}
        </span>
        <span
          className={cn(
            "text-xs font-medium px-1.5 py-0.5 rounded-full bg-white/70",
            textColorClass,
          )}
        >
          {leads.length}
        </span>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-xl p-1.5 space-y-2 min-h-[200px] transition-colors",
          isOver ? "bg-slate-100" : "bg-slate-50/50",
        )}
      >
        <SortableContext
          items={leads.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </SortableContext>

        {leads.length === 0 && (
          <div className="flex items-center justify-center h-20 text-xs text-slate-400">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
}
