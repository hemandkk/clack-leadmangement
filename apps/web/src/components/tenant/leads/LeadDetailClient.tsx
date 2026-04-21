"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  Mail,
  Edit2,
  MessageSquare,
  Calendar,
  User,
} from "lucide-react";
import {
  useLeadDetail,
  useLeadActivity,
  useUpdateLead,
  useAddNote,
  useAssignLead,
} from "@/hooks/useLeads";
import { LeadStatusBadge } from "./LeadStatusBadge";
import { LeadPriorityBadge } from "./LeadPriorityBadge";
import { LeadTimeline } from "./LeadTimeline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatDateTime } from "@leadpro/utils";
import { STATUS_CONFIG, SOURCE_CONFIG } from "@/lib/leadConfig";
import type { LeadStatus, LeadSource } from "@leadpro/types";

export function LeadDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: lead, isLoading } = useLeadDetail(id);
  const { data: activity } = useLeadActivity(id);
  const { mutate: updateLead } = useUpdateLead(id);
  const { mutate: addNote, isPending: addingNote } = useAddNote(id);
  const [note, setNote] = useState("");
  const [editingStatus, setEditingStatus] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-40 bg-slate-100 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!lead)
    return (
      <div className="text-center py-20 text-slate-400">Lead not found</div>
    );

  const handleStatusChange = (status: LeadStatus) => {
    updateLead({ status });
    setEditingStatus(false);
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    addNote(note, { onSuccess: () => setNote("") });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: lead info */}
        <div className="col-span-2 space-y-4">
          {/* Header card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {lead.name}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {SOURCE_CONFIG[lead.source as LeadSource].icon}{" "}
                  {SOURCE_CONFIG[lead.source as LeadSource].label} · Added{" "}
                  {formatDate(lead.createdAt)}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
            </div>

            {/* Status + priority row */}
            <div className="flex items-center gap-3 mb-5">
              {editingStatus ? (
                <Select
                  defaultValue={lead.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="h-7 text-xs w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
                      <SelectItem key={s} value={s}>
                        {STATUS_CONFIG[s].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <button onClick={() => setEditingStatus(true)}>
                  <LeadStatusBadge status={lead.status} />
                </button>
              )}
              <LeadPriorityBadge priority={lead.priority} />
              {lead.value && (
                <Badge variant="outline" className="text-xs font-medium">
                  ₹{lead.value.toLocaleString("en-IN")}
                </Badge>
              )}
            </div>

            {/* Contact grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{lead.email}</span>
                </div>
              )}
              {lead.assignedStaff && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>{lead.assignedStaff.name}</span>
                </div>
              )}
              {lead.lastContactedAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>
                    Last contact: {formatDateTime(lead.lastContactedAt)}
                  </span>
                </div>
              )}
            </div>

            {/* Notes */}
            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-700">{lead.notes}</p>
              </div>
            )}

            {/* Tags */}
            {lead.tags?.length && (
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {lead.tags.map((tag: any) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Add note */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-sm font-medium mb-2.5">Add a note</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Type a note, call summary, or update..."
              className="resize-none mb-2 text-sm"
              rows={3}
            />
            <Button
              size="sm"
              onClick={handleAddNote}
              disabled={!note.trim() || addingNote}
            >
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              {addingNote ? "Adding..." : "Add note"}
            </Button>
          </div>

          {/* Activity timeline */}
          <LeadTimeline activities={activity ?? []} />
        </div>

        {/* Right: sidebar info */}
        <div className="space-y-4">
          {/* Assigned staff */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 mb-3">
              Assigned to
            </p>
            {lead.assignedStaff ? (
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-slate-800 text-white text-sm">
                    {lead.assignedStaff.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {lead.assignedStaff.name}
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-slate-400 mb-2">Not assigned</p>
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Assign staff
                </Button>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 mb-3">
              Quick actions
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Phone className="h-3.5 w-3.5 mr-2" /> Log a call
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <MessageSquare className="h-3.5 w-3.5 mr-2" /> Send WhatsApp
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Calendar className="h-3.5 w-3.5 mr-2" /> Schedule follow-up
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
              >
                <Mail className="h-3.5 w-3.5 mr-2" /> Send email
              </Button>
            </div>
          </div>

          {/* Meta info */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-medium text-slate-500 mb-3">Details</p>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between">
                <dt className="text-slate-400">Created</dt>
                <dd className="text-slate-700">{formatDate(lead.createdAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Updated</dt>
                <dd className="text-slate-700">{formatDate(lead.updatedAt)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Source</dt>
                <dd className="text-slate-700">
                  {SOURCE_CONFIG[lead.source as LeadSource].label}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Lead ID</dt>
                <dd className="text-slate-400 font-mono text-[10px]">
                  {lead.id.slice(0, 8)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
