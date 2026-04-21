"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, MoreVertical, UserX, RefreshCw } from "lucide-react";
import {
  useStaffList,
  useDeactivateStaff,
  useUpdateStaff,
} from "@/hooks/useStaff";
import { StaffAvatar } from "./StaffAvatar";
import { TargetProgressBar } from "./TargetProgressBar";
import { InviteStaffModal } from "./InviteStaffModal";
import { ROLE_CONFIG, STAFF_STATUS_CONFIG } from "@/lib/staffConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@leadpro/utils";
import type { Staff, StaffRole } from "@leadpro/types";

export function StaffListPageClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<StaffRole | "all">("all");
  const [showInvite, setShowInvite] = useState(false);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);

  const { data, isLoading } = useStaffList({
    search,
    role: roleFilter === "all" ? undefined : roleFilter,
  });
  const { mutate: deactivate } = useDeactivateStaff();

  const staff: Staff[] = data?.data ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Staff</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {staff.length} member{staff.length !== 1 ? "s" : ""} in your team
          </p>
        </div>
        <Button onClick={() => setShowInvite(true)} size="sm">
          <Plus className="h-4 w-4 mr-1.5" /> Invite staff
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Search staff..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
        <Select
          value={roleFilter}
          onValueChange={(v) => setRoleFilter(v as StaffRole | "all")}
        >
          <SelectTrigger className="h-8 text-sm w-36">
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="sales_staff">Sales Staff</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Staff grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-52 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : staff.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-400 text-sm mb-3">No staff members found</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInvite(true)}
          >
            <Plus className="h-4 w-4 mr-1.5" /> Invite your first team member
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {staff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              onView={() => router.push(`/staff/${member.id}`)}
              onDeactivate={() => setDeactivateId(member.id)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <InviteStaffModal
        open={showInvite}
        onClose={() => setShowInvite(false)}
      />

      <AlertDialog
        open={!!deactivateId}
        onOpenChange={() => setDeactivateId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate staff member?</AlertDialogTitle>
            <AlertDialogDescription>
              They will lose access immediately. Their leads will remain
              assigned but auto-assignment will skip them. You can reactivate at
              any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                deactivate(deactivateId!);
                setDeactivateId(null);
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

function StaffCard({
  staff,
  onView,
  onDeactivate,
}: {
  staff: Staff;
  onView: () => void;
  onDeactivate: () => void;
}) {
  const roleCfg = ROLE_CONFIG[staff.role];
  const statusCfg = STAFF_STATUS_CONFIG[staff.status];

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm
        hover:border-slate-300 transition-all cursor-pointer group"
      onClick={onView}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <StaffAvatar
            name={staff.name}
            avatar={staff.avatar}
            isOnLeave={staff.isOnLeave}
            size="md"
          />
          <div>
            <p className="text-sm font-medium text-slate-900">{staff.name}</p>
            <p className="text-xs text-slate-400">{staff.email}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="text-sm">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
            >
              View profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
              Set targets
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                onDeactivate();
              }}
            >
              <UserX className="h-3.5 w-3.5 mr-2" /> Deactivate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Role + status */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            roleCfg.color,
            roleCfg.text,
          )}
        >
          {roleCfg.label}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
            statusCfg.color,
            statusCfg.text,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dot)} />
          {statusCfg.label}
        </span>
        {staff.isOnLeave && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
            On leave
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3 pt-3 border-t border-slate-100">
        <Stat label="Active leads" value={staff.activeLeads ?? 0} />
        <Stat label="Calls today" value={staff.callsToday ?? 0} />
        <Stat label="Total leads" value={staff.totalLeads ?? 0} />
      </div>

      {/* Monthly target progress */}
      {staff.monthlyTarget !== undefined && (
        <TargetProgressBar
          label="Monthly target"
          achieved={staff.monthlyAchieved ?? 0}
          target={staff.monthlyTarget}
          unit=" leads"
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-base font-semibold text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-400 leading-tight">{label}</p>
    </div>
  );
}
