"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  MoreVertical,
  Mail,
  Shield,
  UserX,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  useStaffMgmtList,
  useDeactivateStaff,
  useResendInvite,
} from "@/hooks/useStaffManagement";
import { InviteStaffModal } from "./InviteStaffModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@leadpro/utils";
import type { StaffMember } from "@leadpro/types";

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

const STATUS_CFG = {
  active: { dot: "bg-green-500", label: "Active" },
  inactive: { dot: "bg-slate-400", label: "Inactive" },
  invited: { dot: "bg-yellow-400", label: "Invited" },
  suspended: { dot: "bg-red-500", label: "Suspended" },
};

export function StaffPageClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showInvite, setInvite] = useState(false);
  const [deactivating, setDeactivating] = useState<StaffMember | null>(null);

  const { data, isLoading } = useStaffMgmtList({
    search: search || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const { mutate: deactivate } = useDeactivateStaff();
  const { mutate: resendInvite } = useResendInvite();

  const staff: StaffMember[] = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Staff & Users</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {staff.length} team member{staff.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button size="sm" onClick={() => setInvite(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Invite member
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2
            h-3.5 w-3.5 text-slate-400"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="h-8 w-36 text-sm">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="sales_staff">Sales Staff</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Staff table */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl">
          <p className="text-2xl mb-2">👥</p>
          <p className="text-slate-400 mb-3">No staff members found</p>
          <Button variant="outline" size="sm" onClick={() => setInvite(true)}>
            Invite first team member
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {[
                  "Name",
                  "Contact",
                  "Role",
                  "Permissions",
                  "Status",
                  "Last login",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold
                    text-slate-500 first:pl-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((member) => {
                const rc = ROLE_CFG[member.role] ?? ROLE_CFG.custom;
                const sc = STATUS_CFG[member.status];
                return (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 cursor-pointer"
                    onClick={() => router.push(`/staff/${member.id}`)}
                  >
                    {/* Name + avatar */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="h-9 w-9 rounded-full bg-slate-900
                          flex items-center justify-center text-white text-sm
                          font-bold shrink-0"
                        >
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              className="h-9 w-9 rounded-full object-cover"
                            />
                          ) : (
                            member.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {member.name}
                          </p>
                          {member.designation && (
                            <p className="text-xs text-slate-400">
                              {member.designation}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700">{member.email}</p>
                      {member.phone && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {member.mobilePrefix} {member.phone}
                        </p>
                      )}
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-semibold",
                          rc.bg,
                          rc.text,
                        )}
                      >
                        {rc.label}
                      </span>
                    </td>

                    {/* Permission count */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-slate-600">
                          {member.permissions?.length ?? 0} permissions
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs
                        font-medium text-slate-600"
                      >
                        <span className={cn("h-2 w-2 rounded-full", sc.dot)} />
                        {sc.label}
                      </span>
                      {member.isOnLeave && (
                        <span
                          className="ml-2 text-[10px] font-medium bg-orange-50
                          text-orange-600 px-1.5 py-0.5 rounded-full"
                        >
                          On leave
                        </span>
                      )}
                    </td>

                    {/* Last login */}
                    <td className="px-4 py-3.5 text-slate-400 text-xs">
                      {member.lastLogin
                        ? new Date(member.lastLogin).toLocaleDateString()
                        : member.status === "invited"
                          ? "Invite pending"
                          : "—"}
                    </td>

                    {/* Actions */}
                    <td
                      className="px-4 py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-sm">
                          <DropdownMenuItem
                            onClick={() => router.push(`/staff/${member.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/staff/${member.id}?tab=permissions`)
                            }
                          >
                            <Shield className="h-4 w-4 mr-2" /> Edit permissions
                          </DropdownMenuItem>
                          {member.status === "invited" && (
                            <DropdownMenuItem
                              onClick={() => resendInvite(member.id)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" /> Resend
                              invite
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {member.status === "active" ? (
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => setDeactivating(member)}
                            >
                              <UserX className="h-4 w-4 mr-2" /> Deactivate
                            </DropdownMenuItem>
                          ) : member.status !== "invited" ? (
                            <DropdownMenuItem
                              className="text-green-600"
                              onClick={() => router.push(`/staff/${member.id}`)}
                            >
                              Reactivate
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <InviteStaffModal open={showInvite} onClose={() => setInvite(false)} />

      {/* Deactivate confirm */}
      <AlertDialog
        open={!!deactivating}
        onOpenChange={() => setDeactivating(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deactivate {deactivating?.name}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              They will lose access immediately. Their leads and data remain
              intact. You can reactivate at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                deactivate({ id: deactivating!.id });
                setDeactivating(null);
              }}
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
