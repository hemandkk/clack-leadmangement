"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useLeadsKanban, useUpdateLeadStatus } from "@/hooks/useLeads";
import { KANBAN_COLUMNS, STATUS_CONFIG } from "@/lib/leadConfig";
import { KanbanColumn } from "./KanbanColumn";
import { LeadCard } from "./LeadCard";
import type { Lead, LeadFilters, LeadStatus } from "@leadpro/types";

interface Props {
  filters: LeadFilters;
}

export function LeadKanban({ filters }: Props) {
  const { data, isLoading } = useLeadsKanban();
  const { mutate: updateStatus } = useUpdateLeadStatus();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  // Group leads by status — apply client-side search filter too
  const grouped = useCallback(() => {
    const leads: Lead[] = data?.leads ?? [];
    const search = filters.search?.toLowerCase();
    const filtered = search
      ? leads.filter(
          (l) =>
            l.name.toLowerCase().includes(search) ||
            l.phone.includes(search) ||
            l.email?.toLowerCase().includes(search),
        )
      : leads;

    return KANBAN_COLUMNS.reduce(
      (acc, col) => {
        acc[col] = filtered.filter((l) => l.status === col);
        return acc;
      },
      {} as Record<LeadStatus, Lead[]>,
    );
  }, [data, filters.search]);

  const columns = grouped();
  const activeLead = activeId
    ? Object.values(columns)
        .flat()
        .find((l) => l.id === activeId)
    : null;

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    setActiveId(null);
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;

    // Only update if dropped on a different column
    const lead = Object.values(columns)
      .flat()
      .find((l) => l.id === leadId);
    if (lead && lead.status !== newStatus) {
      updateStatus({ id: leadId, status: newStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => (
          <div key={col} className="w-72 shrink-0">
            <div className="h-8 bg-slate-100 rounded animate-pulse mb-3" />
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-28 bg-slate-100 rounded-lg animate-pulse mb-2"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6">
        {KANBAN_COLUMNS.map((colId) => (
          <KanbanColumn
            key={colId}
            id={colId}
            label={STATUS_CONFIG[colId].label}
            colorClass={STATUS_CONFIG[colId].color}
            textColorClass={STATUS_CONFIG[colId].textColor}
            leads={columns[colId] ?? []}
          />
        ))}
      </div>

      {/* Drag overlay — renders the card while dragging */}
      <DragOverlay>
        {activeLead ? <LeadCard lead={activeLead} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
