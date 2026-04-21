"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useRouter } from "next/navigation";
import { Phone, Mail, MoreVertical } from "lucide-react";
import { cn } from "@leadpro/utils";
import { LeadPriorityBadge } from "./LeadPriorityBadge";
import { SOURCE_CONFIG } from "@/lib/leadConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Lead } from "@leadpro/types";

interface Props {
  lead: Lead;
  isDragging?: boolean;
}

export function LeadCard({ lead, isDragging = false }: Props) {
  const router = useRouter();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "bg-white rounded-lg border border-slate-200 p-3 cursor-grab",
        "hover:border-slate-300 hover:shadow-sm transition-all group",
        (isSortableDragging || isDragging) && "opacity-50 shadow-lg rotate-1",
      )}
      {...attributes}
      {...listeners}
    >
      {/* Top row: name + menu */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/leads/${lead.id}`);
          }}
        >
          <p className="text-sm font-medium text-slate-900 truncate hover:text-blue-600">
            {lead.name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {SOURCE_CONFIG[lead.source].icon} {SOURCE_CONFIG[lead.source].label}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sm">
            <DropdownMenuItem onClick={() => router.push(`/leads/${lead.id}`)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem>Assign to staff</DropdownMenuItem>
            <DropdownMenuItem>Add note</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contact info */}
      <div className="space-y-1 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Phone className="h-3 w-3" />
          <span>{lead.phone}</span>
        </div>
        {lead.email && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Mail className="h-3 w-3" />
            <span className="truncate">{lead.email}</span>
          </div>
        )}
      </div>

      {/* Bottom row: priority + assigned */}
      <div className="flex items-center justify-between">
        <LeadPriorityBadge priority={lead.priority} />

        {lead.assignedStaff ? (
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[9px] bg-slate-700 text-white">
              {lead.assignedStaff.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <span className="text-xs text-slate-300">Unassigned</span>
        )}
      </div>

      {/* Value if present */}
      {lead.value && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs font-medium text-slate-600">
            ₹{lead.value.toLocaleString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}
