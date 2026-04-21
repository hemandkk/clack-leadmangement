"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { setTargetSchema, type SetTargetInput } from "@leadpro/validators";
import { useSetTarget } from "@/hooks/useStaff";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TargetPeriod } from "@leadpro/types";

interface Props {
  staffId: string;
  open: boolean;
  onClose: () => void;
  defaultPeriod?: TargetPeriod;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function SetTargetModal({
  staffId,
  open,
  onClose,
  defaultPeriod = "monthly",
}: Props) {
  const { mutate: setTarget, isPending } = useSetTarget(staffId);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SetTargetInput>({
    resolver: zodResolver(setTargetSchema),
    defaultValues: {
      period: defaultPeriod,
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      leadsTarget: 0,
      callsTarget: 0,
      revenueTarget: 0,
    },
  });

  const period = watch("period");

  const onSubmit = (data: SetTargetInput) =>
    setTarget(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Set target</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Period</Label>
              <Select
                defaultValue={defaultPeriod}
                onValueChange={(v) => setValue("period", v as TargetPeriod)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {period === "monthly" && (
              <div>
                <Label>Month</Label>
                <Select
                  defaultValue={String(new Date().getMonth() + 1)}
                  onValueChange={(v) => setValue("month", Number(v))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className={period === "monthly" ? "col-span-2" : ""}>
              <Label>Year</Label>
              <Input
                {...register("year", { valueAsNumber: true })}
                type="number"
                className="mt-1"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <Label>Leads target</Label>
              <Input
                {...register("leadsTarget", { valueAsNumber: true })}
                type="number"
                min={0}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Calls target</Label>
              <Input
                {...register("callsTarget", { valueAsNumber: true })}
                type="number"
                min={0}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Revenue target (₹)</Label>
              <Input
                {...register("revenueTarget", { valueAsNumber: true })}
                type="number"
                min={0}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save target"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
