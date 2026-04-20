import { apiClient } from "./client";
import type { LoginInput } from "@leadpro/validators";

// Auth
export const authApi = {
  login: (data: LoginInput) => apiClient.post("/auth/login", data),
  logout: () => apiClient.post("/auth/logout"),
  me: () => apiClient.get("/auth/me"),
  refresh: (token: string) => apiClient.post("/auth/refresh", { token }),
};

// Leads
export const leadsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/leads", { params }),
  get: (id: string) => apiClient.get(`/leads/${id}`),
  create: (data: unknown) => apiClient.post("/leads", data),
  update: (id: string, data: unknown) => apiClient.put(`/leads/${id}`, data),
  delete: (id: string) => apiClient.delete(`/leads/${id}`),
  assign: (id: string, staffId: string) =>
    apiClient.post(`/leads/${id}/assign`, { staffId }),
};

// Staff
export const staffApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/staff", { params }),
  get: (id: string) => apiClient.get(`/staff/${id}`),
  invite: (data: unknown) => apiClient.post("/staff/invite", data),
  update: (id: string, data: unknown) => apiClient.put(`/staff/${id}`, data),
};

// Leaves
export const leavesApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/leaves", { params }),
  apply: (data: unknown) => apiClient.post("/leaves", data),
  approve: (id: string) => apiClient.post(`/leaves/${id}/approve`),
  reject: (id: string, reason: string) =>
    apiClient.post(`/leaves/${id}/reject`, { reason }),
};
