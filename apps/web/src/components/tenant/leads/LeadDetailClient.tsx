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
  Building2,
  Package,
  Star,
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
import { formatDate, formatDateTime, formatCurrency } from "@leadpro/utils";
import { STATUS_CONFIG, SOURCE_CONFIG } from "@/lib/leadConfig";
import type { LeadStatus } from "@leadpro/types";

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

  // Primary phone
  const primaryContact =
    lead.contactNumbers?.find((c: any) => c.isPrimary) ??
    lead.contactNumbers?.[0];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500
          hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to leads
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="col-span-2 space-y-4">
          {/* Header card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-semibold text-slate-900">
                    {lead.name}
                  </h1>
                  {/* Lead type badge */}
                  {lead.type && (
                    <Badge
                      variant="outline"
                      className={
                        lead.type === "existing"
                          ? "border-teal-300 text-teal-700 bg-teal-50"
                          : "border-blue-300 text-blue-700 bg-blue-50"
                      }
                    >
                      {lead.type === "existing" ? "🔄 Existing" : "✨ New"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  {SOURCE_CONFIG[lead.source].icon}{" "}
                  {SOURCE_CONFIG[lead.source].label} · Added{" "}
                  {formatDate(lead.createdAt)}
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Edit2 className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
            </div>

            {/* Status + priority */}
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
                  {formatCurrency(lead.value)}
                </Badge>
              )}
              {lead.expectedClosureDate && (
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  Close by {formatDate(lead.expectedClosureDate)}
                </div>
              )}
            </div>

            {/* Contact numbers */}
            <div className="space-y-1.5 mb-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Contact numbers
              </p>
              {(
                lead.contactNumbers ?? [
                  { number: lead.phone, label: "mobile", isPrimary: true },
                ]
              ).map((c: any, i: number) => (
                <div key={i} className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-700">{c.number}</span>
                  <span className="text-xs text-slate-400 capitalize">
                    {c.label}
                  </span>
                  {c.isPrimary && (
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  )}
                </div>
              ))}
            </div>

            {lead.email && (
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-sm">{lead.email}</span>
              </div>
            )}

            {/* Organisation */}
            {lead.organisation && (
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  {lead.organisation.name}
                </span>
                {lead.organisation.industry && (
                  <span className="text-xs text-slate-400">
                    · {lead.organisation.industry}
                  </span>
                )}
              </div>
            )}

            {/* Products */}
            {(lead.products ?? []).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-500">
                    Products
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {lead.products!.map((p: any) => (
                    <span
                      key={p.id}
                      className="text-xs bg-slate-100 text-slate-700
                        px-2 py-0.5 rounded-full border border-slate-200"
                    >
                      {p.name}
                      {p.price && (
                        <span className="text-slate-400 ml-1">
                          {formatCurrency(p.price)}
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assigned to */}
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-sm text-slate-500">Assigned to:</span>
              {lead.assignedStaff ? (
                <div className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[9px] bg-slate-700 text-white">
                      {lead.assignedStaff.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {lead.assignedStaff.name}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-slate-400">Unassigned</span>
              )}
            </div>

            {lead.notes && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-700">{lead.notes}</p>
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

          {/* Timeline */}
          <LeadTimeline activities={activity ?? []} />
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
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
                onClick={() =>
                  window.open(`tel:${primaryContact?.number ?? lead.phone}`)
                }
              >
                <Phone className="h-3.5 w-3.5 mr-2" /> Call
                {primaryContact?.number && (
                  <span className="ml-auto text-slate-400 text-[10px]">
                    {primaryContact.number}
                  </span>
                )}
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
            <dl className="space-y-2.5 text-xs">
              {[
                {
                  label: "Type",
                  value: lead.type === "existing" ? "🔄 Existing" : "✨ New",
                },
                { label: "Source", value: SOURCE_CONFIG[lead.source].label },
                { label: "Created", value: formatDate(lead.createdAt) },
                { label: "Updated", value: formatDate(lead.updatedAt) },
                ...(lead.expectedClosureDate
                  ? [
                      {
                        label: "Closes by",
                        value: formatDate(lead.expectedClosureDate),
                      },
                    ]
                  : []),
                ...(lead.lastContactedAt
                  ? [
                      {
                        label: "Last contact",
                        value: formatDate(lead.lastContactedAt),
                      },
                    ]
                  : []),
              ].map((item) => (
                <div key={item.label} className="flex justify-between">
                  <dt className="text-slate-400">{item.label}</dt>
                  <dd className="text-slate-700 font-medium">{item.value}</dd>
                </div>
              ))}
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
