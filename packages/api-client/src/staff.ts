import { apiClient } from "./client";

export const staffApi = {
  // Staff CRUD
  list: (params?: unknown) => apiClient.get("/staff", { params }),
  get: (id: string) => apiClient.get(`/staff/${id}`),
  invite: (data: unknown) => apiClient.post("/staff/invite", data),
  update: (id: string, d: unknown) => apiClient.put(`/staff/${id}`, d),
  deactivate: (id: string) => apiClient.post(`/staff/${id}/deactivate`),
  reactivate: (id: string) => apiClient.post(`/staff/${id}/reactivate`),
  resendInvite: (id: string) => apiClient.post(`/staff/${id}/resend-invite`),

  // Targets
  getTargets: (id: string, params?: unknown) =>
    apiClient.get(`/staff/${id}/targets`, { params }),
  setTarget: (id: string, data: unknown) =>
    apiClient.post(`/staff/${id}/targets`, data),
  updateTarget: (id: string, targetId: string, data: unknown) =>
    apiClient.put(`/staff/${id}/targets/${targetId}`, data),

  // Call logs
  getCalls: (id: string, params?: unknown) =>
    apiClient.get(`/staff/${id}/calls`, { params }),

  // Payment reports
  getPayments: (id: string, params?: unknown) =>
    apiClient.get(`/staff/${id}/payments`, { params }),
  markPaid: (id: string, paymentId: string) =>
    apiClient.post(`/staff/${id}/payments/${paymentId}/mark-paid`),

  // Leave balance
  getLeaveBalance: (id: string) => apiClient.get(`/staff/${id}/leave-balance`),
};
