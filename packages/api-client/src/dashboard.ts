import { apiClient } from "./client";

export const dashboardApi = {
  getTenantDashboard: (period: string) =>
    apiClient.get("/dashboard/tenant", { params: { period } }),

  getStaffDashboard: (period: string) =>
    apiClient.get("/dashboard/staff", { params: { period } }),

  getSuperAdminDashboard: (period: string) =>
    apiClient.get("/dashboard/super-admin", { params: { period } }),
};
