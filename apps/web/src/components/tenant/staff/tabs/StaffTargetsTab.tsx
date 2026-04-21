"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useStaffTargets, useSetTarget } from "@/hooks/useStaff";
import { TargetProgressBar } from "../TargetProgressBar";
import { SetTargetModal } from "../SetTargetModal";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@leadpro/utils";
import type { StaffTarget } from "@leadpro/types";

export function StaffTargetsTab({ staffId }: { staffId: string }) {
  const [period, setPeriod] = useState("monthly");
  const [showSet, setShowSet] = useState(false);
  const { data: targets, isLoading } = useStaffTargets(staffId, { period });

  const current: StaffTarget | undefined = targets?.current;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-8 w-32 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" onClick={() => setShowSet(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Set target
        </Button>
      </div>

      {isLoading ? (
        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
      ) : !current ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-400 mb-3">
            No {period} target set yet
          </p>
          <Button variant="outline" size="sm" onClick={() => setShowSet(true)}>
            Set target
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 capitalize">
            {period} targets
          </h3>
          <TargetProgressBar
            label="Leads closed"
            achieved={current.leadsAchieved}
            target={current.leadsTarget}
          />
          <TargetProgressBar
            label="Calls made"
            achieved={current.callsAchieved}
            target={current.callsTarget}
          />
          <TargetProgressBar
            label="Revenue"
            achieved={current.revenueAchieved}
            target={current.revenueTarget}
            unit="₹"
          />
        </div>
      )}

      {/* History */}
      {targets?.history?.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold">History</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {targets.history.map((t: StaffTarget) => (
              <div
                key={t.id}
                className="px-5 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {t.month
                      ? `Month ${t.month}, ${t.year}`
                      : `${t.period} ${t.year}`}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t.leadsAchieved}/{t.leadsTarget} leads ·{t.callsAchieved}/
                    {t.callsTarget} calls
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatCurrency(t.revenueAchieved)}
                  </p>
                  <p className="text-xs text-slate-400">
                    of {formatCurrency(t.revenueTarget)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <SetTargetModal
        staffId={staffId}
        open={showSet}
        onClose={() => setShowSet(false)}
        defaultPeriod={period as any}
      />
    </div>
  );
}
