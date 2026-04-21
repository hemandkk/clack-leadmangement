"use client";

import { useState } from "react";
import { CheckCircle2, Clock } from "lucide-react";
import { useStaffPayments, useMarkPaid } from "@/hooks/useStaff";
import { TargetProgressBar } from "../TargetProgressBar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@leadpro/utils";
import type { PaymentRecord } from "@leadpro/types";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function StaffPaymentsTab({ staffId }: { staffId: string }) {
  const year = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(String(year));
  const { data, isLoading } = useStaffPayments(staffId, { year: selectedYear });
  const { mutate: markPaid, isPending } = useMarkPaid(staffId);

  const payments: PaymentRecord[] = data?.payments ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="h-8 w-28 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[year, year - 1, year - 2].map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {data?.yearTotal !== undefined && (
          <div className="text-sm text-slate-600">
            Year total:{" "}
            <span className="font-semibold text-slate-900">
              {formatCurrency(data.yearTotal)}
            </span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-xl">
          <p className="text-sm text-slate-400">
            No payment records for {selectedYear}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => {
            const [py, pm] = p.period.split("-");
            const monthLabel = MONTHS[Number(pm) - 1] + " " + py;
            return (
              <div
                key={p.id}
                className="bg-white border border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {monthLabel}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>Base: {formatCurrency(p.baseAmount)}</span>
                      <span>
                        Incentive: {formatCurrency(p.incentiveAmount)}
                      </span>
                      {p.deductionAmount > 0 && (
                        <span className="text-red-500">
                          Deduction: -{formatCurrency(p.deductionAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-slate-900">
                      {formatCurrency(p.totalAmount)}
                    </p>
                    {p.isPaid ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Paid {p.paidAt ? formatDate(p.paidAt) : ""}
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs mt-1"
                        onClick={() => markPaid(p.id)}
                        disabled={isPending}
                      >
                        <Clock className="h-3 w-3 mr-1" /> Mark paid
                      </Button>
                    )}
                  </div>
                </div>

                <TargetProgressBar
                  label="Target achievement"
                  achieved={p.targetAchievementPercent}
                  target={100}
                  unit="%"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
