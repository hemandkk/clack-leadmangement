import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@leadpro/api-client";
import type { DashboardPeriod } from "@leadpro/types";

export const dashboardKeys = {
  tenant: (p: DashboardPeriod) => ["dashboard", "tenant", p] as const,
  staff: (p: DashboardPeriod) => ["dashboard", "staff", p] as const,
  superAdmin: (p: DashboardPeriod) => ["dashboard", "super-admin", p] as const,
};

export function useTenantDashboard(period: DashboardPeriod) {
  return useQuery({
    queryKey: dashboardKeys.tenant(period),
    queryFn: async () => (await dashboardApi.getTenantDashboard(period)).data,
    staleTime: 1000 * 60 * 3, // 3 min — dashboard can be slightly stale
  });
}

export function useStaffDashboard(period: DashboardPeriod) {
  return useQuery({
    queryKey: dashboardKeys.staff(period),
    queryFn: async () => (await dashboardApi.getStaffDashboard(period)).data,
    staleTime: 1000 * 60 * 2,
  });
}

export function useSuperAdminDashboard(period: DashboardPeriod) {
  return useQuery({
    queryKey: dashboardKeys.superAdmin(period),
    queryFn: async () =>
      (await dashboardApi.getSuperAdminDashboard(period)).data,
    staleTime: 1000 * 60 * 5,
  });
}
