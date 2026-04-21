"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Mail, Calendar } from "lucide-react";
import { useStaffDetail } from "@/hooks/useStaff";
import { StaffAvatar } from "./StaffAvatar";
import { StaffTargetsTab } from "./tabs/StaffTargetsTab";
import { StaffCallsTab } from "./tabs/StaffCallsTab";
import { StaffPaymentsTab } from "./tabs/StaffPaymentsTab";
import { StaffLeavesTab } from "./tabs/StaffLeavesTab";
import { ROLE_CONFIG, STAFF_STATUS_CONFIG } from "@/lib/staffConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@leadpro/utils";
import { formatDate } from "@leadpro/utils";

export function StaffDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { data: staff, isLoading } = useStaffDetail(id);

  if (isLoading)
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
        <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  if (!staff) return <p className="text-slate-400 text-sm">Staff not found</p>;

  const roleCfg = ROLE_CONFIG[staff.role];
  const statusCfg = STAFF_STATUS_CONFIG[staff.status];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to staff
      </button>

      {/* Profile header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <StaffAvatar
            name={staff.name}
            avatar={staff.avatar}
            isOnLeave={staff.isOnLeave}
            size="lg"
          />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {staff.name}
                </h1>
                <div className="flex items-center gap-2 mt-1.5">
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
                    <span
                      className={cn("h-1.5 w-1.5 rounded-full", statusCfg.dot)}
                    />
                    {statusCfg.label}
                  </span>
                  {staff.isOnLeave && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-600">
                      On leave until {formatDate(staff.currentLeaveEndDate!)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Mail className="h-4 w-4" />
                {staff.email}
              </div>
              {staff.phone && (
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Phone className="h-4 w-4" />
                  {staff.phone}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                Joined {formatDate(staff.joinedAt)}
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-6 shrink-0">
            {[
              { label: "Active leads", value: staff.activeLeads ?? 0 },
              { label: "Total leads", value: staff.totalLeads ?? 0 },
              { label: "Calls today", value: staff.callsToday ?? 0 },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="targets">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="targets">Targets</TabsTrigger>
          <TabsTrigger value="calls">Call logs</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="leaves">Leaves</TabsTrigger>
        </TabsList>

        <TabsContent value="targets" className="mt-4">
          <StaffTargetsTab staffId={id} />
        </TabsContent>
        <TabsContent value="calls" className="mt-4">
          <StaffCallsTab staffId={id} />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <StaffPaymentsTab staffId={id} />
        </TabsContent>
        <TabsContent value="leaves" className="mt-4">
          <StaffLeavesTab staffId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
