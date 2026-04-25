"use client";

import { useFormContext } from "react-hook-form";
import { User } from "lucide-react";
import { useAssignableStaff } from "@/hooks/useMasterData";
import { useAuthStore } from "@/store/authStore";
import { usePermissions } from "@/hooks/usePermissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function SalesOwnerField() {
  const { setValue, watch } = useFormContext();
  const { can, role } = usePermissions();
  const currentUser = useAuthStore((s) => s.user);
  const { data } = useAssignableStaff();

  const staffList = data?.staff ?? [];

  const selected = watch("assignedTo") ?? String(currentUser?.id);
  const canAssign = can("ASSIGN_LEADS"); // managers + owners only

  // Sales staff only see their own name — no dropdown
  if (!canAssign) {
    return (
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          Sales owner
        </label>
        <div
          className="flex items-center gap-2 px-3 py-2 border border-slate-200
          rounded-lg bg-slate-50"
        >
          <Avatar className="h-6 w-6">
            <AvatarFallback className="bg-slate-700 text-white text-[10px]">
              {currentUser?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-slate-700">{currentUser?.name}</span>
          <span className="text-xs text-slate-400 ml-auto">(you)</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">
        Sales owner
      </label>
      <Select
        defaultValue={String(currentUser?.id)}
        value={selected}
        onValueChange={(v) => setValue("assignedTo", v, { shouldDirty: true })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Assign to staff member" />
        </SelectTrigger>
        <SelectContent>
          {/* Self option always first */}
          {currentUser && currentUser.id && currentUser.name && (
            <SelectItem value={currentUser.id}>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-slate-700 text-white text-[9px]">
                    {currentUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span>{currentUser.name}</span>
                <span className="text-xs text-slate-400">(you)</span>
              </div>
            </SelectItem>
          )}

          {/* Other staff */}
          {staffList
            .filter((s: any) => s.id !== currentUser?.id)
            .map((s: any) => (
              <SelectItem key={s.id} value={String(s.id)}>
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-slate-800 text-white text-[9px]">
                      {s.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{s.name}</span>
                  {s.isOnLeave && (
                    <span className="text-[10px] text-orange-500 ml-1">
                      On leave
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  );
}
