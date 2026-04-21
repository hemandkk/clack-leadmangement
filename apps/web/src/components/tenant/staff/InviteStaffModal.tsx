"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteStaffSchema, type InviteStaffInput } from "@leadpro/validators";
import { useInviteStaff } from "@/hooks/useStaff";
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

interface Props {
  open: boolean;
  onClose: () => void;
}

export function InviteStaffModal({ open, onClose }: Props) {
  const { mutate: invite, isPending } = useInviteStaff();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InviteStaffInput>({ resolver: zodResolver(inviteStaffSchema) });

  const onSubmit = (data: InviteStaffInput) =>
    invite(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div>
            <Label>Full name *</Label>
            <Input
              {...register("name")}
              className="mt-1"
              placeholder="Jane Smith"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label>Work email *</Label>
            <Input
              {...register("email")}
              type="email"
              className="mt-1"
              placeholder="jane@company.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label>Phone</Label>
            <Input
              {...register("phone")}
              className="mt-1"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <Label>Role *</Label>
            <Select onValueChange={(v) => setValue("role", v as any)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">
                  <div>
                    <p className="font-medium">Manager</p>
                    <p className="text-xs text-slate-400">
                      Can manage staff, approve leaves, view all leads
                    </p>
                  </div>
                </SelectItem>
                <SelectItem value="sales_staff">
                  <div>
                    <p className="font-medium">Sales Staff</p>
                    <p className="text-xs text-slate-400">
                      Can view and manage their own leads
                    </p>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          <p className="text-xs text-slate-400">
            An invitation email will be sent. They can set their own password on
            first login.
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Sending..." : "Send invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
