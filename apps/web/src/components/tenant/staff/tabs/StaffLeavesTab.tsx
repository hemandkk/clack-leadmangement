"use client";

import {
  useLeavesList,
  useApproveLeave,
  useRejectLeave,
} from "@/hooks/useLeaves";
import { useLeaveBalance } from "@/hooks/useStaff";
import { LeaveTypeBadge, LeaveStatusBadge } from "../LeaveBadges";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@leadpro/utils";
import type { Leave } from "@leadpro/types";

export function StaffLeavesTab({ staffId }: { staffId: string }) {
  const { data: leaves, isLoading } = useLeavesList({ staffId });
  const { data: balance } = useLeaveBalance(staffId);
  const { mutate: approve } = useApproveLeave();
  const { mutate: reject } = useRejectLeave();

  return (
    <div className="space-y-4">
      {/* Leave balance */}
      {balance && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-medium text-slate-500 mb-3">
            Leave balance (this year)
          </p>
          <div className="grid grid-cols-3 gap-4">
            {(["casual", "sick", "earned"] as const).map((type) => (
              <div
                key={type}
                className="text-center p-3 bg-slate-50 rounded-lg"
              >
                <p className="text-lg font-bold text-slate-900">
                  {balance[type].remaining}
                </p>
                <p className="text-xs text-slate-500 capitalize">{type}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {balance[type].used} used of {balance[type].total}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave list */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : !leaves?.data?.length ? (
        <div className="text-center py-10 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-400">No leave records found</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {(leaves.data as Leave[]).map((leave) => (
            <div key={leave.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <LeaveTypeBadge type={leave.type} />
                    <LeaveStatusBadge status={leave.status} />
                    <span className="text-xs text-slate-400">
                      {leave.totalDays} day{leave.totalDays !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">
                    {formatDate(leave.fromDate)} → {formatDate(leave.toDate)}
                  </p>
                  <p className="text-xs text-slate-400 italic">
                    "{leave.reason}"
                  </p>
                </div>

                {leave.status === "pending" && (
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
                      onClick={() =>
                        reject({ id: leave.id, reason: "Declined by manager" })
                      }
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
