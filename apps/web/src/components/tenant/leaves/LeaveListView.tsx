"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import {
  useLeavesList,
  useApproveLeave,
  useRejectLeave,
} from "@/hooks/useLeaves";
import { LeaveTypeBadge, LeaveStatusBadge } from "../staff/LeaveBadges";
import { StaffAvatar } from "../staff/StaffAvatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@leadpro/utils";
import type { Leave, LeaveFilters, LeaveStatus } from "@leadpro/types";

interface Props {
  filters: LeaveFilters;
  onFiltersChange: (f: LeaveFilters) => void;
  isManager: boolean;
}

export function LeaveListView({ filters, onFiltersChange, isManager }: Props) {
  const { data, isLoading } = useLeavesList(filters);
  const { mutate: approve } = useApproveLeave();
  const { mutate: reject } = useRejectLeave();
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const leaves: Leave[] = data?.data ?? [];

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <Select
          value={filters.status?.[0] ?? "all"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              status: v === "all" ? undefined : [v as LeaveStatus],
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-8 text-sm w-36">
            <SelectValue placeholder="All status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.type ?? "all"}
          onValueChange={(v) =>
            onFiltersChange({
              ...filters,
              type: v === "all" ? undefined : (v as any),
              page: 1,
            })
          }
        >
          <SelectTrigger className="h-8 text-sm w-36">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="casual">Casual</SelectItem>
            <SelectItem value="sick">Sick</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="earned">Earned</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-400">No leave requests found</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {leaves.map((leave) => (
            <div key={leave.id} className="p-4 flex items-start gap-4">
              {isManager && (
                <StaffAvatar
                  name={leave.staffName}
                  avatar={leave.staffAvatar}
                  size="sm"
                />
              )}

              <div className="flex-1 min-w-0">
                {isManager && (
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {leave.staffName}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <LeaveTypeBadge type={leave.type} />
                  <LeaveStatusBadge status={leave.status} />
                  <span className="text-xs text-slate-400">
                    {leave.totalDays} day{leave.totalDays !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-sm text-slate-700">
                  {formatDate(leave.fromDate)}
                  {leave.fromDate !== leave.toDate && (
                    <> → {formatDate(leave.toDate)}</>
                  )}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 italic">
                  "{leave.reason}"
                </p>
                {leave.status === "rejected" && leave.rejectionReason && (
                  <p className="text-xs text-red-500 mt-1">
                    Rejected: {leave.rejectionReason}
                  </p>
                )}
              </div>

              {/* Manager actions */}
              {isManager && leave.status === "pending" && (
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-green-700 border-green-200 hover:bg-green-50"
                    onClick={() => approve(leave.id)}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setRejectId(leave.id);
                      setRejectReason("");
                    }}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject dialog */}
      <Dialog open={!!rejectId} onOpenChange={() => setRejectId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Reject leave request</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <p className="text-sm text-slate-500">
              Provide a reason so the staff member knows why.
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Peak sales period, insufficient notice..."
              rows={3}
              className="resize-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRejectId(null)}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                disabled={!rejectReason.trim()}
                onClick={() => {
                  reject({ id: rejectId!, reason: rejectReason });
                  setRejectId(null);
                }}
              >
                Reject leave
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
