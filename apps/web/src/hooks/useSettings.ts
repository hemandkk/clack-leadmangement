import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsApi } from "@leadpro/api-client";

export const settingKeys = {
  general: () => ["settings", "general"] as const,
  whatsapp: () => ["settings", "whatsapp"] as const,
  waTemplates: () => ["settings", "wa-templates"] as const,
  webhooks: () => ["settings", "webhooks"] as const,
  deliveries: (id: string) => ["settings", "webhook-deliveries", id] as const,
  businessHours: () => ["settings", "business-hours"] as const,
};

// ─── General settings ──────────────────────────────────────
export function useTenantSettings() {
  return useQuery({
    queryKey: settingKeys.general(),
    queryFn: async () => (await settingsApi.get()).data,
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => settingsApi.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.general() });
      toast.success("Settings saved");
    },
    onError: () => toast.error("Failed to save settings"),
  });
}

// ─── WhatsApp ──────────────────────────────────────────────
export function useWhatsAppConfig() {
  return useQuery({
    queryKey: settingKeys.whatsapp(),
    queryFn: async () => (await settingsApi.getWhatsApp()).data,
  });
}

export function useConnectWhatsApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => settingsApi.connectWhatsApp(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.whatsapp() });
      toast.success("WhatsApp connected successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Connection failed");
    },
  });
}

export function useDisconnectWhatsApp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => settingsApi.disconnectWhatsApp(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.whatsapp() });
      toast.success("WhatsApp disconnected");
    },
  });
}

export function useWATemplates() {
  return useQuery({
    queryKey: settingKeys.waTemplates(),
    queryFn: async () => (await settingsApi.getWATemplates()).data,
  });
}

export function useSyncWATemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => settingsApi.syncWATemplates(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.waTemplates() });
      toast.success("Templates synced from Meta");
    },
    onError: () => toast.error("Sync failed"),
  });
}

// ─── Webhooks ──────────────────────────────────────────────
export function useWebhooks() {
  return useQuery({
    queryKey: settingKeys.webhooks(),
    queryFn: async () => (await settingsApi.listWebhooks()).data,
  });
}

export function useCreateWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => settingsApi.createWebhook(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.webhooks() });
      toast.success("Webhook created");
    },
    onError: () => toast.error("Failed to create webhook"),
  });
}

export function useUpdateWebhook(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => settingsApi.updateWebhook(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.webhooks() });
      toast.success("Webhook updated");
    },
  });
}

export function useDeleteWebhook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsApi.deleteWebhook(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.webhooks() });
      toast.success("Webhook deleted");
    },
  });
}

export function useTestWebhook() {
  return useMutation({
    mutationFn: (id: string) => settingsApi.testWebhook(id),
    onSuccess: () => toast.success("Test payload sent"),
    onError: () => toast.error("Test delivery failed"),
  });
}

export function useWebhookDeliveries(id: string) {
  return useQuery({
    queryKey: settingKeys.deliveries(id),
    queryFn: async () => (await settingsApi.getDeliveries(id)).data,
    enabled: !!id,
  });
}

// ─── Business hours ────────────────────────────────────────
export function useBusinessHours() {
  return useQuery({
    queryKey: settingKeys.businessHours(),
    queryFn: async () => (await settingsApi.getBusinessHours()).data,
  });
}

export function useUpdateBusinessHours() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => settingsApi.updateBusinessHours(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.businessHours() });
      toast.success("Business hours saved");
    },
  });
}
