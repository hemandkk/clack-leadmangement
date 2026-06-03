"use client";

import { useFormContext } from "react-hook-form";
import { User } from "lucide-react";
import { cn } from "@leadpro/utils";
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
import type { Staff } from "@leadpro/types";

export function SalesOwnerField() {
  const { setValue, watch } = useFormContext();
  const { can, role } = usePermissions();
  const currentUser = useAuthStore((s) => s.user);
  const { data } = useAssignableStaff();

  const staffList: Staff[] = data?.staff ?? [
    { isOnLeave: true, name: "hemand", id: 1 },
    { isOnLeave: false, name: "anand", id: 2 },
  ];

  const selected = watch("assignedTo") ?? String(currentUser?.id);
  const canAssign = can("ASSIGN_LEADS"); // managers + owners only

  // Sales staff only see their own name — no dropdown
  if (!canAssign) {
    return (
      <div className="space-y-1.5">
        <label>Agent</label>
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
    <div className="space-y-2">
      <label>Agent</label>
      <Select
        defaultValue={String(currentUser?.id)}
        value={selected}
        onValueChange={(v) => setValue("assignedTo", v, { shouldDirty: true })}
      >
        <SelectTrigger
          className={cn("flex w-full items-center mt-1 justify-between ...")}
        >
          <SelectValue placeholder="Assign to staff member" />
        </SelectTrigger>
        <SelectContent className="rounded-xl border shadow-lg p-2 bg-white">
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
            .filter((staff) => staff.id !== currentUser?.id)
            .map((staff) => (
              <SelectItem
                className=" text-sm  font-medium py-2  px-3  rounded-md  hover:bg-slate-100  focus:bg-slate-100 "
                key={staff.id}
                value={String(staff.id)}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="bg-slate-700 text-white text-[9px] focus:text-orange-500 hover:text-orange-500">
                      {staff.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{staff.name}</span>
                  {staff.isOnLeave && (
                    <span className="text-[10px] text-red-500 ml-1">
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
