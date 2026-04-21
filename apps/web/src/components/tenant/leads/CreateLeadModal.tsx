"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLeadSchema, type CreateLeadInput } from "@leadpro/validators";
import { useCreateLead } from "@/hooks/useLeads";
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

export function CreateLeadModal({ open, onClose }: Props) {
  const { mutate: createLead, isPending } = useCreateLead();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateLeadInput>({ resolver: zodResolver(createLeadSchema) });

  const onSubmit = (data: CreateLeadInput) => {
    createLead(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add new lead</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label>Full name *</Label>
              <Input
                {...register("name")}
                className="mt-1"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label>Phone *</Label>
              <Input
                {...register("phone")}
                className="mt-1"
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <Label>Email</Label>
              <Input
                {...register("email")}
                type="email"
                className="mt-1"
                placeholder="optional"
              />
            </div>

            <div>
              <Label>Source *</Label>
              <Select onValueChange={(v) => setValue("source", v as any)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {(
                    [
                      "website",
                      "whatsapp",
                      "phone",
                      "referral",
                      "social",
                      "manual",
                    ] as const
                  ).map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.source && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.source.message}
                </p>
              )}
            </div>

            <div>
              <Label>Priority</Label>
              <Select
                defaultValue="medium"
                onValueChange={(v) => setValue("priority", v as any)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label>Deal value (₹)</Label>
              <Input
                {...register("value", { valueAsNumber: true })}
                type="number"
                className="mt-1"
                placeholder="0"
              />
            </div>

            <div className="col-span-2">
              <Label>Notes</Label>
              <Textarea
                {...register("notes")}
                className="mt-1 resize-none"
                rows={3}
                placeholder="Any context about this lead..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
