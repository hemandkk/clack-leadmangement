"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteStaffSchema, type InviteStaffInput } from "@leadpro/validators";
import { useInviteStaff } from "@/hooks/useStaffManagement";
import { PermissionMatrix } from "./PermissionMatrix";
import { ROLE_TEMPLATES, getRoleTemplate } from "@/lib/permissions";
import { PHONE_PREFIXES } from "@leadpro/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@leadpro/utils";
import type { PermissionKey, StaffRole } from "@leadpro/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function InviteStaffModal({ open, onClose }: Props) {
  const { mutate: invite, isPending } = useInviteStaff();
  const [selectedRole, setSelectedRole] = useState<StaffRole>("sales_staff");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<InviteStaffInput>({
    resolver: zodResolver(inviteStaffSchema),
    defaultValues: {
      mobilePrefix: "+91",
      role: "sales_staff",
      permissions: getRoleTemplate("sales_staff")?.permissions ?? [],
      sendInviteEmail: true,
    },
  });

  const permissions = watch("permissions") as PermissionKey[];

  // When role changes, auto-fill permissions from template
  const handleRoleChange = (role: StaffRole) => {
    setSelectedRole(role);
    setValue("role", role, { shouldDirty: true });
    const tpl = getRoleTemplate(role);
    if (tpl && role !== "custom") {
      setValue("permissions", tpl.permissions, { shouldDirty: true });
    }
  };

  useEffect(() => {
    if (open) {
      reset({
        mobilePrefix: "+91",
        role: "sales_staff",
        permissions: getRoleTemplate("sales_staff")?.permissions ?? [],
        sendInviteEmail: true,
      });
      setSelectedRole("sales_staff");
    }
  }, [open]);

  const onSubmit = (data: InviteStaffInput) =>
    invite(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0 h-[90vh] flex flex-col">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <DialogTitle>Invite team member</DialogTitle>
          <p className="text-sm text-slate-500 mt-0.5">
            They will receive an email to set their password and access the
            portal
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <Tabs defaultValue="details" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-6 mt-4 bg-slate-100 w-fit shrink-0">
              <TabsTrigger value="details">Member details</TabsTrigger>
              <TabsTrigger value="permissions">
                Role & permissions
                <span
                  className={cn(
                    "ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    permissions.length > 0
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-600",
                  )}
                >
                  {permissions.length}
                </span>
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: Details ─────────────────────────── */}
            <TabsContent
              value="details"
              className="flex-1 overflow-hidden mt-0"
            >
              <ScrollArea className="h-full">
                <div className="p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <Label>
                      Full name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("name")}
                      className="mt-1"
                      placeholder="Jane Smith"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label>
                      Work email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      {...register("email")}
                      type="email"
                      className="mt-1"
                      placeholder="jane@yourcompany.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone with prefix */}
                  <div>
                    <Label>
                      Mobile number <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2 mt-1">
                      {/* Country code */}
                      <Select
                        defaultValue="+91"
                        onValueChange={(v) =>
                          setValue("mobilePrefix", v, { shouldDirty: true })
                        }
                      >
                        <SelectTrigger className="w-36 shrink-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PHONE_PREFIXES.map((p) => (
                            <SelectItem key={p.code} value={p.code}>
                              <span className="font-mono">{p.code}</span>
                              <span className="text-slate-400 ml-2 text-xs">
                                {p.country}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Input
                        {...register("phone")}
                        type="tel"
                        placeholder="98765 43210"
                        className="flex-1"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Role quick-select */}
                  <div>
                    <Label className="mb-2 block">
                      Role <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {ROLE_TEMPLATES.map((r) => (
                        <button
                          key={r.role}
                          type="button"
                          onClick={() => handleRoleChange(r.role)}
                          className={cn(
                            "flex items-start gap-3 p-3.5 rounded-xl border-2",
                            "text-left transition-all",
                            selectedRole === r.role
                              ? "border-slate-900 bg-slate-50"
                              : "border-slate-200 hover:border-slate-300",
                          )}
                        >
                          <div
                            className={cn(
                              "h-4 w-4 rounded-full border-2 shrink-0 mt-0.5",
                              "flex items-center justify-center",
                              selectedRole === r.role
                                ? "border-slate-900 bg-slate-900"
                                : "border-slate-300",
                            )}
                          >
                            {selectedRole === r.role && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {r.label}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {r.description}
                            </p>
                            <p className="text-[10px] text-slate-300 mt-1">
                              {r.permissions.length} permissions
                            </p>
                          </div>
                        </button>
                      ))}
                      {/* Custom */}
                      <button
                        type="button"
                        onClick={() => handleRoleChange("custom")}
                        className={cn(
                          "flex items-start gap-3 p-3.5 rounded-xl border-2",
                          "text-left transition-all col-span-2",
                          selectedRole === "custom"
                            ? "border-blue-400 bg-blue-50"
                            : "border-dashed border-slate-200 hover:border-slate-300",
                        )}
                      >
                        <div
                          className={cn(
                            "h-4 w-4 rounded-full border-2 shrink-0 mt-0.5",
                            "flex items-center justify-center",
                            selectedRole === "custom"
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300",
                          )}
                        >
                          {selectedRole === "custom" && (
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            Custom role
                          </p>
                          <p className="text-xs text-slate-400">
                            Define exact permissions in the next tab
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Optional fields */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Designation</Label>
                      <Input
                        {...register("designation")}
                        className="mt-1"
                        placeholder="Senior Sales Executive"
                      />
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Input
                        {...register("department")}
                        className="mt-1"
                        placeholder="Sales"
                      />
                    </div>
                    <div>
                      <Label>Employee ID</Label>
                      <Input
                        {...register("employeeId")}
                        className="mt-1"
                        placeholder="EMP-001"
                      />
                    </div>
                  </div>

                  {/* Send invite email toggle */}
                  <div
                    className="flex items-center justify-between p-4
                    bg-blue-50 border border-blue-200 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-semibold text-blue-900">
                        Send invitation email
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        Email with login link sent to{" "}
                        {watch("email") || "their email"}
                      </p>
                    </div>
                    <Controller
                      name="sendInviteEmail"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>

            {/* ── Tab 2: Permissions ─────────────────────── */}
            <TabsContent
              value="permissions"
              className="flex-1 overflow-hidden mt-0"
            >
              <ScrollArea className="h-full">
                <div className="p-6">
                  <Controller
                    name="permissions"
                    control={control}
                    render={({ field }) => (
                      <PermissionMatrix
                        value={field.value as PermissionKey[]}
                        onChange={field.onChange}
                        currentRole={selectedRole}
                      />
                    )}
                  />
                  {errors.permissions && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.permissions.message as string}
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div
            className="flex items-center justify-between px-6 py-4
            border-t border-slate-100 bg-slate-50 shrink-0"
          >
            <p className="text-xs text-slate-400">
              <span className="text-red-500">*</span> Required fields
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Sending invite..." : "Send invite"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
