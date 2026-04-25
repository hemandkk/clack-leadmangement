"use client";

import { useForm } from "react-hook-form";
import { useLogCall } from "@/hooks/useTelephony";
import { useLeadsList } from "@/hooks/useLeads";
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

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LogCallModal({ open, onClose }: Props) {
  const currentUser = useAuthStore((s) => s.user);
  const { mutate: log, isPending } = useLogCall();
  const { data: leadsData } = useLeadsList({ page: 1, perPage: 100 });
  const leads = leadsData?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      direction: "outbound",
      status: "answered",
      duration: 0,
      staffId: currentUser?.id,
      notes: "",
      outcome: "",
    },
  });

  const onSubmit = (d: any) =>
    log(d, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Log a call</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Lead */}
          <div>
            <Label>Lead</Label>
            <Select onValueChange={(v) => setValue("leadId", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select lead (optional)" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((l: any) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name} — {l.phone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Direction</Label>
              <Select
                defaultValue="outbound"
                onValueChange={(v) => setValue("direction", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outbound">Outbound</SelectItem>
                  <SelectItem value="inbound">Inbound</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                defaultValue="answered"
                onValueChange={(v) => setValue("status", v)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="answered">Answered</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Duration (seconds)</Label>
              <Input
                {...register("duration", { valueAsNumber: true })}
                type="number"
                min={0}
                className="mt-1"
                placeholder="120"
              />
            </div>
            <div>
              <Label>Outcome</Label>
              <Select onValueChange={(v) => setValue("outcome", v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="not_interested">Not interested</SelectItem>
                  <SelectItem value="callback">Callback</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="wrong_number">Wrong number</SelectItem>
                  <SelectItem value="no_answer">No answer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea
              {...register("notes")}
              className="mt-1 resize-none"
              rows={3}
              placeholder="Call summary..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging..." : "Log call"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
