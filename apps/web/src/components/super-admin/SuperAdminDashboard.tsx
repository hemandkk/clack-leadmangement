"use client";

import { useState } from "react";
import { Building2, Users, TrendingUp, DollarSign } from "lucide-react";
import { useSuperAdminDashboard } from "@/hooks/useDashboard";
import { KPICard } from "@/components/shared/charts/KPICard";
import { ChartCard } from "@/components/shared/charts/ChartCard";
import { AreaChart } from "@/components/shared/charts/AreaChart";
import { DonutChart } from "@/components/shared/charts/DonutChart";
import { ChartLegend } from "@/components/shared/charts/ChartLegend";
import { BarChart } from "@/components/shared/charts/BarChart";
import { PeriodSelector } from "@/components/shared/charts/PeriodSelector";
import { formatCurrency, formatDate } from "@leadpro/utils";
import { CHART_COLORS } from "@/lib/chartConfig";
import type {
  DashboardPeriod,
  RecentTenantRow,
  TenantPerformanceRow,
} from "@leadpro/types";

export function SuperAdminDashboard() {
  const [period, setPeriod] = useState<DashboardPeriod>("month");
  const { data, isLoading } = useSuperAdminDashboard(period);
  const kpis = data?.kpis;

  const planColors: Record<string, string> = {
    Basic: CHART_COLORS.slate,
    Pro: CHART_COLORS.blue,
    Enterprise: CHART_COLORS.purple,
  };

  const planData = (data?.planDistribution ?? []).map((d) => ({
    ...d,
    color: planColors[d.name] ?? CHART_COLORS.teal,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Overview</h1>
          <p className="text-sm text-slate-500 mt-0.5">Platform-wide metrics</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total tenants"
          kpi={
            kpis?.totalTenants ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={Building2}
          iconColor="bg-blue-50"
          iconText="text-blue-600"
          isLoading={isLoading}
        />
        <KPICard
          title="Active tenants"
          kpi={
            kpis?.activeTenants ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={Users}
          iconColor="bg-green-50"
          iconText="text-green-600"
          isLoading={isLoading}
        />
        <KPICard
          title="New this month"
          kpi={
            kpis?.newThisMonth ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={TrendingUp}
          iconColor="bg-purple-50"
          iconText="text-purple-600"
          isLoading={isLoading}
        />
        <KPICard
          title="MRR"
          kpi={
            kpis?.totalRevenue ?? { value: 0, change: 0, changeDir: "neutral" }
          }
          icon={DollarSign}
          iconColor="bg-amber-50"
          iconText="text-amber-600"
          formatter={(v) => formatCurrency(v)}
          isLoading={isLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <ChartCard
            title="Tenant growth"
            description="New tenants over time"
            isLoading={isLoading}
            height={220}
          >
            <AreaChart
              data={data?.tenantGrowth ?? []}
              series={[
                {
                  key: "value",
                  label: "New tenants",
                  color: CHART_COLORS.blue,
                },
              ]}
            />
          </ChartCard>
        </div>
        <ChartCard title="Plan distribution" isLoading={isLoading} height={220}>
          <DonutChart data={planData} height={160} />
          <ChartLegend data={planData} />
        </ChartCard>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent tenants */}
        <div className="bg-white border border-slate-200 rounded-xl">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold">Recently joined</h3>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-100 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(data?.recentTenants ?? ([] as RecentTenantRow[])).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between
                  px-5 py-3 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {t.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatDate(t.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs bg-slate-100 text-slate-600
                      px-2 py-0.5 rounded-full"
                    >
                      {t.plan}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${
                        t.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top tenants by activity */}
        <div className="bg-white border border-slate-200 rounded-xl">
          <div className="px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold">Top tenants</h3>
          </div>
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-slate-100 rounded animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {(data?.topTenants ?? ([] as TenantPerformanceRow[])).map(
                (t, i) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 px-5 py-3
                  hover:bg-slate-50"
                  >
                    <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-slate-400">{t.staff} staff</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-slate-900">
                        {t.leads} leads
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatCurrency(t.revenue)}
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
