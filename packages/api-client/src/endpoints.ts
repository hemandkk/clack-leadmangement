import { apiClient } from "./client";
import type {
  LoginInput,
  UpdateLeadInput,
  CreateLeadInput,
} from "@leadpro/validators";

import type { LeadFilters } from "@leadpro/types";
// Auth
export const authApi = {
  login: (data: LoginInput) => apiClient.post("/auth/login", data),
  logout: () => apiClient.post("/auth/logout"),
  me: () => apiClient.get("/auth/me"),
  refresh: (token: string) => apiClient.post("/auth/refresh", { token }),
};

// Leads
export const leadsApi = {
  list: (filters?: LeadFilters) => apiClient.get("/leads", { params: filters }),

  get: (id: string) => apiClient.get(`/leads/${id}`),

  create: (data: CreateLeadInput) => apiClient.post("/leads", data),

  update: (id: string, data: UpdateLeadInput) =>
    apiClient.put(`/leads/${id}`, data),

  delete: (id: string) => apiClient.delete(`/leads/${id}`),

  assign: (id: string, staffId: string) =>
    apiClient.post(`/leads/${id}/assign`, { staffId }),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/leads/${id}/status`, { status }),

  addNote: (id: string, note: string) =>
    apiClient.post(`/leads/${id}/notes`, { note }),

  getActivity: (id: string) => apiClient.get(`/leads/${id}/activity`),

  bulkAssign: (leadIds: string[], staffId: string) =>
    apiClient.post("/leads/bulk-assign", { leadIds, staffId }),

  bulkUpdateStatus: (leadIds: string[], status: string) =>
    apiClient.post("/leads/bulk-status", { leadIds, status }),

  getKanban: () => apiClient.get("/leads/kanban"), // returns leads grouped by status
};
