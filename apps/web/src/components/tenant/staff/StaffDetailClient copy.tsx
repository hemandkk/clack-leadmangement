"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Shield, Edit2, Save } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateStaffRoleSchema,
  type UpdateStaffRoleInput,
} from "@leadpro/validators";
import {
  useStaffMgmtDetail,
  useUpdateStaff,
  useUpdateStaffRole,
  useDeactivateStaff,
} from "@/hooks/useStaffManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionMatrix } from "./PermissionMatrix";
import { ROLE_TEMPLATES } from "@/lib/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@leadpro/utils";
import { MOBILE_PREFIXES } from "@leadpro/validators";
import type { PermissionKey, StaffRole } from "@leadpro/types";

const ROLE_CFG = {
  owner: { label: "Owner", bg: "bg-purple-100", text: "text-purple-800" },
  manager: { label: "Manager", bg: "bg-blue-100", text: "text-blue-800" },
  sales_staff: {
    label: "Sales Staff",
    bg: "bg-slate-100",
    text: "text-slate-700",
  },
  custom: { label: "Custom", bg: "bg-amber-100", text: "text-amber-800" },
};

export function StaffDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const defaultTab = params.get("tab") ?? "profile";

  const { can } = usePermissions();
  const canManage = can("MANAGE_STAFF");

  const { data, isLoading } = useStaffMgmtDetail(id);
  const { mutate: updateStaff, isPending: updatingProfile } =
    useUpdateStaff(id);
  const { mutate: updateRole, isPending: updatingRole } =
    useUpdateStaffRole(id);

  const member = data?.staff;

  // ── Profile form ─────────────────────────────────────────
  const profileForm = useForm({
    defaultValues: {
      name: member?.name ?? "",
      mobilePrefix: member?.mobilePrefix ?? "+91",
      phone: member?.phone ?? "",
      designation: member?.designation ?? "",
      department: member?.department ?? "",
      employeeId: member?.employeeId ?? "",
    },
  });

  // ── Role form ─────────────────────────────────────────────
  const roleForm = useForm<UpdateStaffRoleInput>({
    resolver: zodResolver(updateStaffRoleSchema),
    defaultValues: {
      role: member?.role ?? "sales_staff",
      permissions: member?.permissions ?? [],
    },
  });

  const currentRole = roleForm.watch("role") as StaffRole;

  // Sync forms when data loads
  useState(() => {
    if (member) {
      profileForm.reset({
        name: member.name,
        mobilePrefix: member.mobilePrefix ?? "+91",
        phone: member.phone ?? "",
        designation: member.designation ?? "",
        department: member.department ?? "",
        employeeId: member.employeeId ?? "",
      });
      roleForm.reset({
        role: member.role,
        permissions: member.permissions ?? [],
      });
    }
  });

  if (isLoading || !member) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const rc = ROLE_CFG[member.role] ?? ROLE_CFG.custom;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500
          hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to staff
      </button>

      {/* Profile header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className="h-16 w-16 rounded-xl bg-slate-900 flex items-center
            justify-center text-white text-2xl font-bold shrink-0"
          >
            {member.avatar ? (
              <img
                src={member.avatar}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              member.name.charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  {member.name}
                </h1>
                <p className="text-slate-500 text-sm">{member.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-xs font-semibold",
                      rc.bg,
                      rc.text,
                    )}
                  >
                    {rc.label}
                  </span>
                  {member.designation && (
                    <span className="text-xs text-slate-400">
                      {member.designation}
                    </span>
                  )}
                  {member.department && (
                    <span className="text-xs text-slate-400">
                      · {member.department}
                    </span>
                  )}
                  {member.employeeId && (
                    <span
                      className="text-xs bg-slate-100 text-slate-500
                      px-2 py-0.5 rounded font-mono"
                    >
                      {member.employeeId}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end">
                  <Shield className="h-3.5 w-3.5 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {member.permissions?.length ?? 0} permissions
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {member.phone
                    ? `${member.mobilePrefix} ${member.phone}`
                    : "No phone"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={defaultTab}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          {canManage && (
            <TabsTrigger value="permissions">Role & permissions</TabsTrigger>
          )}
        </TabsList>

        {/* ── Profile tab ──────────────────────────────── */}
        <TabsContent value="profile" className="mt-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <form
              onSubmit={profileForm.handleSubmit((d) => updateStaff(d))}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Name */}
                <div className="col-span-2">
                  <Label>Full name</Label>
                  <Input
                    {...profileForm.register("name")}
                    className="mt-1"
                    readOnly={!canManage}
                  />
                </div>

                {/* Phone */}
                <div className="col-span-2">
                  <Label>Mobile number</Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      defaultValue={member.mobilePrefix ?? "+91"}
                      onValueChange={(v) =>
                        profileForm.setValue("mobilePrefix", v, {
                          shouldDirty: true,
                        })
                      }
                      disabled={!canManage}
                    >
                      <SelectTrigger className="w-36 shrink-0">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MOBILE_PREFIXES.map((p) => (
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
                      {...profileForm.register("phone")}
                      type="tel"
                      placeholder="98765 43210"
                      readOnly={!canManage}
                    />
                  </div>
                </div>

                {/* Designation */}
                <div>
                  <Label>Designation</Label>
                  <Input
                    {...profileForm.register("designation")}
                    className="mt-1"
                    readOnly={!canManage}
                    placeholder="Sales Executive"
                  />
                </div>

                {/* Department */}
                <div>
                  <Label>Department</Label>
                  <Input
                    {...profileForm.register("department")}
                    className="mt-1"
                    readOnly={!canManage}
                    placeholder="Sales"
                  />
                </div>

                {/* Employee ID */}
                <div>
                  <Label>Employee ID</Label>
                  <Input
                    {...profileForm.register("employeeId")}
                    className="mt-1"
                    readOnly={!canManage}
                    placeholder="EMP-001"
                  />
                </div>

                {/* Email (readonly) */}
                <div>
                  <Label>Email</Label>
                  <Input
                    value={member.email}
                    readOnly
                    className="mt-1 bg-slate-50"
                  />
                </div>
              </div>

              {canManage && (
                <div className="flex justify-end">
                  <Button type="submit" disabled={updatingProfile}>
                    <Save className="h-4 w-4 mr-1.5" />
                    {updatingProfile ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </TabsContent>

        {/* ── Permissions tab ──────────────────────────── */}
        {canManage && (
          <TabsContent value="permissions" className="mt-4">
            <form onSubmit={roleForm.handleSubmit((d) => updateRole(d))}>
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                {/* Role selector */}
                <div>
                  <Label className="mb-3 block">Role</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {["owner", "manager", "sales_staff", "custom"].map((r) => {
                      const cfg = ROLE_CFG[r as StaffRole];
                      const tpl = ROLE_TEMPLATES.find((t) => t.role === r);
                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            roleForm.setValue("role", r as StaffRole, {
                              shouldDirty: true,
                            });
                            const tmpl = ROLE_TEMPLATES.find(
                              (t) => t.role === r,
                            );
                            if (tmpl && r !== "custom") {
                              roleForm.setValue(
                                "permissions",
                                tmpl.permissions,
                                { shouldDirty: true },
                              );
                            }
                          }}
                          className={cn(
                            "p-3 rounded-xl border-2 text-left transition-all",
                            currentRole === r
                              ? "border-slate-900 bg-slate-50"
                              : "border-slate-200 hover:border-slate-300",
                          )}
                        >
                          <p
                            className={cn(
                              "text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-1",
                              cfg.bg,
                              cfg.text,
                            )}
                          >
                            {cfg.label}
                          </p>
                          {tpl && r !== "custom" && (
                            <p className="text-[10px] text-slate-400">
                              {tpl.permissions.length} permissions
                            </p>
                          )}
                          {r === "custom" && (
                            <p className="text-[10px] text-slate-400">
                              Pick manually below
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Permission matrix */}
                <Controller
                  name="permissions"
                  control={roleForm.control}
                  render={({ field }) => (
                    <PermissionMatrix
                      value={field.value as PermissionKey[]}
                      onChange={field.onChange}
                      currentRole={currentRole}
                    />
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={updatingRole}>
                    <Shield className="h-4 w-4 mr-1.5" />
                    {updatingRole ? "Saving..." : "Save role & permissions"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
