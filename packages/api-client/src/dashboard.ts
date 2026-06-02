import { apiClient } from "./client";
import type {
  DashboardPeriod,
  StaffDashboardData,
  SuperAdminDashboardData,
  TenantDashboardData,
} from "@leadpro/types";

export const dashboardApi = {
  getTenantDashboard: (period: DashboardPeriod) =>
    apiClient.get<TenantDashboardData>("/dashboard/tenant", {
      params: { period },
    }),

  getStaffDashboard: (period: DashboardPeriod) =>
    apiClient.get<StaffDashboardData>("/dashboard/staff", {
      params: { period },
    }),

  getSuperAdminDashboard: (period: DashboardPeriod) =>
    apiClient.get<SuperAdminDashboardData>("/dashboard/super-admin", {
      params: { period },
    }),
};
