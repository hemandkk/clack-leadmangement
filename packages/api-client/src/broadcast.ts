import { apiClient } from "./client";

export const broadcastApi = {
  // ── Email templates ────────────────────────────────
  listEmailTemplates: (p?: unknown) =>
    apiClient.get("/broadcast/templates/email", { params: p }),
  getEmailTemplate: (id: string) =>
    apiClient.get(`/broadcast/templates/email/${id}`),
  createEmailTemplate: (d: unknown) =>
    apiClient.post("/broadcast/templates/email", d),
  updateEmailTemplate: (id: string, d: unknown) =>
    apiClient.put(`/broadcast/templates/email/${id}`, d),
  deleteEmailTemplate: (id: string) =>
    apiClient.delete(`/broadcast/templates/email/${id}`),
  duplicateEmailTemplate: (id: string) =>
    apiClient.post(`/broadcast/templates/email/${id}/duplicate`),

  // ── WhatsApp templates ─────────────────────────────
  listWATemplates: (p?: unknown) =>
    apiClient.get("/broadcast/templates/whatsapp", { params: p }),
  getWATemplate: (id: string) =>
    apiClient.get(`/broadcast/templates/whatsapp/${id}`),
  createWATemplate: (d: unknown) =>
    apiClient.post("/broadcast/templates/whatsapp", d),
  updateWATemplate: (id: string, d: unknown) =>
    apiClient.put(`/broadcast/templates/whatsapp/${id}`, d),
  deleteWATemplate: (id: string) =>
    apiClient.delete(`/broadcast/templates/whatsapp/${id}`),
  submitWAForApproval: (id: string) =>
    apiClient.post(`/broadcast/templates/whatsapp/${id}/submit`),
  syncWATemplates: () => apiClient.post("/broadcast/templates/whatsapp/sync"),

  // ── Broadcasts ─────────────────────────────────────
  listBroadcasts: (p?: unknown) => apiClient.get("/broadcasts", { params: p }),
  getBroadcast: (id: string) => apiClient.get(`/broadcasts/${id}`),
  createBroadcast: (d: unknown) => apiClient.post("/broadcasts", d),
  updateBroadcast: (id: string, d: unknown) =>
    apiClient.put(`/broadcasts/${id}`, d),
  deleteBroadcast: (id: string) => apiClient.delete(`/broadcasts/${id}`),
  launchBroadcast: (id: string) => apiClient.post(`/broadcasts/${id}/launch`),
  pauseBroadcast: (id: string) => apiClient.post(`/broadcasts/${id}/pause`),
  cancelBroadcast: (id: string) => apiClient.post(`/broadcasts/${id}/cancel`),

  // ── Send single message ────────────────────────────
  sendEmail: (
    leadId: string,
    templateId: string,
    vars: Record<string, string>,
  ) =>
    apiClient.post("/broadcast/send/email", {
      leadId,
      templateId,
      variables: vars,
    }),
  sendWhatsApp: (
    leadId: string,
    templateId: string,
    vars: Record<string, string>,
  ) =>
    apiClient.post("/broadcast/send/whatsapp", {
      leadId,
      templateId,
      variables: vars,
    }),
};
