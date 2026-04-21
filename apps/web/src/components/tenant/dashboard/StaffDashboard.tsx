"use client";

import { useState } from "react";
import { Users, PhoneCall, Trophy, TrendingUp } from "lucide-react";
import { useStaffDashboard } from "@/hooks/useDashboard";
import { useAuthStore } from "@/store/authStore";
import { KPICard } from "@/components/shared/charts/KPICard";
import { ChartCard } from "@/components/shared/charts/ChartCard";
import { AreaChart } from "@/components/shared/charts/AreaChart";
import { DonutChart } from "@/components/shared/charts/DonutChart";
import { ChartLegend } from "@/components/shared/charts/ChartLegend";
import { PeriodSelector } from "@/components/shared/charts/PeriodSelector";
import { MyTargetWidget } from "./widgets/MyTargetWidget";
import { UpcomingFollowupsWidget } from "./widgets/UpcomingFollowupsWidget";
import { CHART_COLORS, STATUS_CHART_COLORS } from "@/lib/chartConfig";
import type { DashboardPeriod } from "@leadpro/types";

export function StaffDashboard() {
  const user = useAuthStore((s) => s.user);
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const { data, isLoading } = useStaffDashboard(period);
  const kpis = data?.kpis;

  const myLeadsByStatus = (data?.myLeadsByStatus ?? []).map((d) => ({
    ...d,
    color: STATUS_CHART_COLORS[d.name.toLowerCase()] ?? CHART_COLORS.slate,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Hey, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Here's how you're doing
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="My active leads"
          kpi={
            kpis?.myActiveLeads ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={Users}
          iconColor="bg-blue-50"
          iconText="text-blue-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Calls today"
          kpi={
            kpis?.myCallsToday ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={PhoneCall}
          iconColor="bg-orange-50"
          iconText="text-orange-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Won this month"
          kpi={
            kpis?.myWonThisMonth ?? {
              value: 0,
              change: 0,
              changeDir: "neutral",
            }
          }
          icon={Trophy}
          iconColor="bg-green-50"
          iconText="text-green-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Target progress"
          kpi={
            kpis?.targetProgress ?? {
              value: 0,
              change: 0,
              changeDir: "neutral",
            }
          }
          icon={TrendingUp}
          iconColor="bg-purple-50"
          iconText="text-purple-600"
          suffix="%"
          decimals={0}
          isLoading={isLoading}
        />
      </div>

      {/* Charts + target row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Calls trend */}
        <div className="col-span-2">
          <ChartCard
            title="My call activity"
            description="Calls made per day"
            isLoading={isLoading}
            height={200}
          >
            <AreaChart
              data={data?.callsToday ?? []}
              series={[
                { key: "value", label: "Calls", color: CHART_COLORS.orange },
              ]}
              height={200}
            />
          </ChartCard>
        </div>

        {/* My leads donut */}
        <ChartCard
          title="My leads by status"
          isLoading={isLoading}
          height={200}
        >
          <DonutChart data={myLeadsByStatus} height={160} />
          <ChartLegend data={myLeadsByStatus} />
        </ChartCard>
      </div>

      {/* Target + Follow-ups */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <MyTargetWidget
            target={
              data?.myTarget ?? {
                leadsTarget: 0,
                leadsAchieved: 0,
                callsTarget: 0,
                callsAchieved: 0,
                revenueTarget: 0,
                revenueAchieved: 0,
              }
            }
            isLoading={isLoading}
          />
        </div>
        <div className="col-span-2">
          <UpcomingFollowupsWidget
            followups={data?.upcomingFollowups ?? []}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
