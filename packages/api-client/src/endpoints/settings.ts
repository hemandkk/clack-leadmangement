import { apiClient } from "../client";

export const settingsApi = {
  // Tenant general settings
  get: () => apiClient.get("/tenant/settings"),
  update: (data: unknown) => apiClient.put("/tenant/settings", data),

  // WhatsApp
  getWhatsApp: () => apiClient.get("/integrations/whatsapp"),
  connectWhatsApp: (data: unknown) =>
    apiClient.post("/integrations/whatsapp/connect", data),
  disconnectWhatsApp: () => apiClient.delete("/integrations/whatsapp"),
  verifyWebhook: () => apiClient.post("/integrations/whatsapp/verify-webhook"),
  getWATemplates: () => apiClient.get("/integrations/whatsapp/templates"),
  syncWATemplates: () =>
    apiClient.post("/integrations/whatsapp/templates/sync"),

  // Webhooks
  listWebhooks: () => apiClient.get("/integrations/webhooks"),
  createWebhook: (data: unknown) =>
    apiClient.post("/integrations/webhooks", data),
  updateWebhook: (id: string, d: unknown) =>
    apiClient.put(`/integrations/webhooks/${id}`, d),
  deleteWebhook: (id: string) =>
    apiClient.delete(`/integrations/webhooks/${id}`),
  testWebhook: (id: string) =>
    apiClient.post(`/integrations/webhooks/${id}/test`),
  getDeliveries: (id: string) =>
    apiClient.get(`/integrations/webhooks/${id}/deliveries`),

  // Business hours
  getBusinessHours: () => apiClient.get("/tenant/business-hours"),
  updateBusinessHours: (data: unknown) =>
    apiClient.put("/tenant/business-hours", data),
};
