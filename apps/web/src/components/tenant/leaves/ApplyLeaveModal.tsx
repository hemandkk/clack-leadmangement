"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { applyLeaveSchema, type ApplyLeaveInput } from "@leadpro/validators";
import { useApplyLeave } from "@/hooks/useLeaves";
import { useLeaveBalance } from "@/hooks/useStaff";
import { useAuthStore } from "@/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { differenceInBusinessDays, parseISO } from "date-fns";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ApplyLeaveModal({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data: balance } = useLeaveBalance(user?.id ?? "");
  const { mutate: apply, isPending } = useApplyLeave();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ApplyLeaveInput>({ resolver: zodResolver(applyLeaveSchema) });

  const fromDate = watch("fromDate");
  const toDate = watch("toDate");
  const leaveType = watch("type");

  // Calculate business days
  const businessDays =
    fromDate && toDate
      ? Math.max(
          0,
          differenceInBusinessDays(parseISO(toDate), parseISO(fromDate)) + 1,
        )
      : 0;

  const onSubmit = (data: ApplyLeaveInput) =>
    apply(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for leave</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <Label>Leave type *</Label>
            <Select onValueChange={(v) => setValue("type", v as any)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                {[
                  { value: "casual", label: "Casual leave" },
                  { value: "sick", label: "Sick leave" },
                  { value: "emergency", label: "Emergency leave" },
                  { value: "earned", label: "Earned leave" },
                  { value: "unpaid", label: "Unpaid leave" },
                ].map((opt) => {
                  const bal = balance?.[
                    opt.value as keyof typeof balance
                  ] as any;
                  return (
                    <SelectItem key={opt.value} value={opt.value}>
                      <div className="flex items-center justify-between w-full gap-6">
                        <span>{opt.label}</span>
                        {bal && (
                          <span className="text-xs text-slate-400">
                            {bal.remaining} remaining
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>From date *</Label>
              <Input {...register("fromDate")} type="date" className="mt-1" />
              {errors.fromDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fromDate.message}
                </p>
              )}
            </div>
            <div>
              <Label>To date *</Label>
              <Input {...register("toDate")} type="date" className="mt-1" />
              {errors.toDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.toDate.message}
                </p>
              )}
            </div>
          </div>

          {businessDays > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700">
              This leave spans{" "}
              <strong>
                {businessDays} business day{businessDays !== 1 ? "s" : ""}
              </strong>{" "}
              (excluding weekends).
            </div>
          )}

          <div>
            <Label>Reason *</Label>
            <Textarea
              {...register("reason")}
              className="mt-1 resize-none"
              rows={3}
              placeholder="Please describe the reason for your leave..."
            />
            {errors.reason && (
              <p className="text-red-500 text-xs mt-1">
                {errors.reason.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
