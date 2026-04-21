"use client";

import { useState } from "react";
import {
  Users,
  PhoneCall,
  TrendingUp,
  DollarSign,
  Target,
  Clock,
  UserCheck,
  CalendarX,
} from "lucide-react";
import { useTenantDashboard } from "@/hooks/useDashboard";
import { KPICard } from "@/components/shared/charts/KPICard";
import { ChartCard } from "@/components/shared/charts/ChartCard";
import { AreaChart } from "@/components/shared/charts/AreaChart";
import { BarChart } from "@/components/shared/charts/BarChart";
import { DonutChart } from "@/components/shared/charts/DonutChart";
import { ChartLegend } from "@/components/shared/charts/ChartLegend";
import { PeriodSelector } from "@/components/shared/charts/PeriodSelector";
import { StaffLeaderboard } from "./widgets/StaffLeaderboard";
import { RecentLeadsWidget } from "./widgets/RecentLeadsWidget";
import { AlertsWidget } from "./widgets/AlertsWidget";
import {
  CHART_COLORS,
  STATUS_CHART_COLORS,
  SOURCE_CHART_COLORS,
} from "@/lib/chartConfig";
import { formatCurrency } from "@leadpro/utils";
import type { DashboardPeriod } from "@leadpro/types";

export function ManagerDashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const { data, isLoading } = useTenantDashboard(period);

  const kpis = data?.kpis;

  // Attach colors to chart data
  const leadsByStatus = (data?.leadsByStatus ?? []).map((d) => ({
    ...d,
    color: STATUS_CHART_COLORS[d.name.toLowerCase()] ?? CHART_COLORS.slate,
  }));

  const leadsBySource = (data?.leadsBySource ?? []).map((d) => ({
    ...d,
    color: SOURCE_CHART_COLORS[d.name.toLowerCase()] ?? CHART_COLORS.slate,
  }));

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your team performance at a glance
          </p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Alerts strip (pending leaves, unassigned leads) */}
      <AlertsWidget
        pendingLeaves={data?.pendingLeaves ?? 0}
        isLoading={isLoading}
      />

      {/* KPI row — 4 cols */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total leads"
          kpi={
            kpis?.totalLeads ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={Users}
          iconColor="bg-blue-50"
          iconText="text-blue-600"
          isLoading={isLoading}
        />
        <KPICard
          title="New today"
          kpi={
            kpis?.newLeadsToday ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={TrendingUp}
          iconColor="bg-green-50"
          iconText="text-green-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Won leads"
          kpi={kpis?.wonLeads ?? { value: 0, change: 0, changeDir: "neutral" }}
          icon={Target}
          iconColor="bg-purple-50"
          iconText="text-purple-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Conversion rate"
          kpi={
            kpis?.conversionRate ?? {
              value: 0,
              change: 0,
              changeDir: "neutral",
            }
          }
          icon={UserCheck}
          iconColor="bg-teal-50"
          iconText="text-teal-600"
          suffix="%"
          decimals={1}
          isLoading={isLoading}
        />
      </div>

      {/* Second KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total calls"
          kpi={
            kpis?.totalCalls ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={PhoneCall}
          iconColor="bg-orange-50"
          iconText="text-orange-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Avg call duration"
          kpi={
            kpis?.avgCallDuration ?? {
              value: 0,
              change: 0,
              changeDir: "neutral",
            }
          }
          icon={Clock}
          iconColor="bg-amber-50"
          iconText="text-amber-600"
          formatter={(v) => `${Math.floor(v / 60)}m ${v % 60}s`}
          isLoading={isLoading}
        />
        <KPICard
          title="Total revenue"
          kpi={
            kpis?.totalRevenue ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={DollarSign}
          iconColor="bg-emerald-50"
          iconText="text-emerald-600"
          formatter={(v) => formatCurrency(v)}
          isLoading={isLoading}
        />
        <KPICard
          title="Pending leaves"
          kpi={
            kpis?.pendingLeaves ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={CalendarX}
          iconColor="bg-red-50"
          iconText="text-red-500"
          isLoading={isLoading}
        />
      </div>

      {/* Charts row 1: Leads over time (wide) + Leads by status (narrow) */}
      <div className="grid grid-cols-3 gap-4">
        <ChartCard
          title="Leads over time"
          description="New leads vs won leads"
          isLoading={isLoading}
          height={220}
          action={
            <span className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-blue-500" /> New
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" /> Won
              </span>
            </span>
          }
        >
          <AreaChart
            data={data?.leadsOverTime ?? []}
            series={[
              { key: "value", label: "New leads", color: CHART_COLORS.blue },
              { key: "value2", label: "Won leads", color: CHART_COLORS.green },
            ]}
            showLegend={false}
          />
        </ChartCard>

        <div className="col-span-1">
          <ChartCard title="Leads by status" isLoading={isLoading} height={200}>
            <DonutChart data={leadsByStatus} />
            <ChartLegend data={leadsByStatus} />
          </ChartCard>
        </div>
      </div>

      {/* Charts row 2: Calls over time + Leads by source */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ChartCard
            title="Call activity"
            description="Total calls per day"
            isLoading={isLoading}
            height={220}
          >
            <BarChart
              data={(data?.callsOverTime ?? []).map((d) => ({
                name: d.date.slice(5),
                value: d.value,
                color: CHART_COLORS.purple,
              }))}
            />
          </ChartCard>
        </div>

        <ChartCard title="Leads by source" isLoading={isLoading} height={220}>
          <BarChart data={leadsBySource} horizontal height={220} />
        </ChartCard>
      </div>

      {/* Bottom row: Staff leaderboard + Recent leads */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <StaffLeaderboard
            staff={data?.topStaff ?? []}
            isLoading={isLoading}
          />
        </div>
        <RecentLeadsWidget
          leads={data?.recentLeads ?? []}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
