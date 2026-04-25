import { apiClient } from "./client";

export const telephonyApi = {
  // ── Call logs ──────────────────────────────────────
  listCalls: (p?: unknown) => apiClient.get("/calls", { params: p }),
  getCall: (id: string) => apiClient.get(`/calls/${id}`),
  logCall: (d: unknown) => apiClient.post("/calls", d),
  updateCall: (id: string, d: unknown) => apiClient.put(`/calls/${id}`, d),
  deleteCall: (id: string) => apiClient.delete(`/calls/${id}`),
  getRecording: (id: string) => apiClient.get(`/calls/${id}/recording`),

  // Stats
  getStats: (p?: unknown) => apiClient.get("/calls/stats", { params: p }),
  getMyStats: (p?: unknown) => apiClient.get("/calls/my-stats", { params: p }),

  // ── Click-to-call (Bonvoice etc.) ─────────────────
  initiateCall: (leadId: string, phoneNumber: string) =>
    apiClient.post("/calls/initiate", { leadId, phoneNumber }),

  // ── IVR flows ──────────────────────────────────────
  listIVRFlows: () => apiClient.get("/telephony/ivr"),
  getIVRFlow: (id: string) => apiClient.get(`/telephony/ivr/${id}`),
  createIVRFlow: (d: unknown) => apiClient.post("/telephony/ivr", d),
  updateIVRFlow: (id: string, d: unknown) =>
    apiClient.put(`/telephony/ivr/${id}`, d),
  deleteIVRFlow: (id: string) => apiClient.delete(`/telephony/ivr/${id}`),
  activateIVR: (id: string) => apiClient.post(`/telephony/ivr/${id}/activate`),

  // ── Virtual numbers ────────────────────────────────
  listNumbers: () => apiClient.get("/telephony/numbers"),
  purchaseNumber: (d: unknown) => apiClient.post("/telephony/numbers", d),
  updateNumber: (id: string, d: unknown) =>
    apiClient.put(`/telephony/numbers/${id}`, d),
  releaseNumber: (id: string) => apiClient.delete(`/telephony/numbers/${id}`),

  // ── Provider settings ──────────────────────────────
  getProviderSettings: () => apiClient.get("/telephony/settings"),
  updateProviderSettings: (d: unknown) =>
    apiClient.put("/telephony/settings", d),
  testConnection: () => apiClient.post("/telephony/settings/test"),
};
