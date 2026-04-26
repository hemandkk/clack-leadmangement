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
export const staffMgmtApi = {
  // ── Staff CRUD ─────────────────────────────────────────
  list: (p?: unknown) => apiClient.get("/staff", { params: p }),
  get: (id: string) => apiClient.get(`/staff/${id}`),
  invite: (d: unknown) => apiClient.post("/staff/invite", d),
  update: (id: string, d: unknown) => apiClient.put(`/staff/${id}`, d),
  updateRole: (id: string, d: unknown) => apiClient.put(`/staff/${id}/role`, d),
  deactivate: (id: string, reason?: string) =>
    apiClient.post(`/staff/${id}/deactivate`, { reason }),
  reactivate: (id: string) => apiClient.post(`/staff/${id}/reactivate`),
  resendInvite: (id: string) => apiClient.post(`/staff/${id}/resend-invite`),
  delete: (id: string) => apiClient.delete(`/staff/${id}`),

  // ── Profile (own) ──────────────────────────────────────
  getMyProfile: () => apiClient.get("/profile"),
  updateMyProfile: (d: unknown) => apiClient.put("/profile", d),
  uploadAvatar: (file: FormData) =>
    apiClient.post("/profile/avatar", file, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  changePassword: (d: unknown) => apiClient.post("/profile/change-password", d),

  // ── Invite acceptance ──────────────────────────────────
  getInviteInfo: (token: string) => apiClient.get(`/auth/invite/${token}`),
  acceptInvite: (d: unknown) => apiClient.post("/auth/accept-invite", d),

  // ── Roles & permissions reference ─────────────────────
  getRoleTemplates: () => apiClient.get("/staff/role-templates"),
};
