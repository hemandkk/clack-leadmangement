import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { broadcastApi } from "@leadpro/api-client";

export const broadcastKeys = {
  emailTemplates: (p?: unknown) => ["broadcast", "email-tpl", p] as const,
  emailTemplate: (id: string) => ["broadcast", "email-tpl-one", id] as const,
  waTemplates: (p?: unknown) => ["broadcast", "wa-tpl", p] as const,
  waTemplate: (id: string) => ["broadcast", "wa-tpl-one", id] as const,
  broadcasts: (p?: unknown) => ["broadcast", "list", p] as const,
  broadcast: (id: string) => ["broadcast", "one", id] as const,
};

// ─── Email templates ───────────────────────────────────────
export const useEmailTemplates = (p?: unknown) =>
  useQuery({
    queryKey: broadcastKeys.emailTemplates(p),
    queryFn: async () => (await broadcastApi.listEmailTemplates(p)).data,
  });

export const useEmailTemplate = (id: string) =>
  useQuery({
    queryKey: broadcastKeys.emailTemplate(id),
    queryFn: async () => (await broadcastApi.getEmailTemplate(id)).data,
    enabled: !!id,
  });

export function useCreateEmailTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => broadcastApi.createEmailTemplate(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broadcast", "email-tpl"] });
      toast.success("Email template created");
    },
    onError: () => toast.error("Failed to create template"),
  });
}

export function useUpdateEmailTemplate(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => broadcastApi.updateEmailTemplate(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: broadcastKeys.emailTemplate(id) });
      qc.invalidateQueries({ queryKey: ["broadcast", "email-tpl"] });
      toast.success("Template saved");
    },
  });
}

export function useDeleteEmailTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => broadcastApi.deleteEmailTemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broadcast", "email-tpl"] });
      toast.success("Template deleted");
    },
  });
}

// ─── WhatsApp templates ────────────────────────────────────
export const useWATemplates = (p?: unknown) =>
  useQuery({
    queryKey: broadcastKeys.waTemplates(p),
    queryFn: async () => (await broadcastApi.listWATemplates(p)).data,
  });

export const useWATemplate = (id: string) =>
  useQuery({
    queryKey: broadcastKeys.waTemplate(id),
    queryFn: async () => (await broadcastApi.getWATemplate(id)).data,
    enabled: !!id,
  });

export function useCreateWATemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => broadcastApi.createWATemplate(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broadcast", "wa-tpl"] });
      toast.success("WhatsApp template created");
    },
    onError: () => toast.error("Failed to create template"),
  });
}

export function useUpdateWATemplate(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => broadcastApi.updateWATemplate(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: broadcastKeys.waTemplate(id) });
      qc.invalidateQueries({ queryKey: ["broadcast", "wa-tpl"] });
      toast.success("Template saved");
    },
  });
}

export function useDeleteWATemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => broadcastApi.deleteWATemplate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broadcast", "wa-tpl"] });
      toast.success("Template deleted");
    },
  });
}

export function useSubmitWAForApproval() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => broadcastApi.submitWAForApproval(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: broadcastKeys.waTemplate(id) });
      qc.invalidateQueries({ queryKey: ["broadcast", "wa-tpl"] });
      toast.success("Submitted to Meta for approval");
    },
  });
}

export function useSyncWATemplates() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => broadcastApi.syncWATemplates(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broadcast", "wa-tpl"] });
      toast.success("Templates synced from Meta");
    },
    onError: () => toast.error("Sync failed"),
  });
}

// ─── Broadcasts ────────────────────────────────────────────
export const useBroadcastList = (p?: unknown) =>
  useQuery({
    queryKey: broadcastKeys.broadcasts(p),
    queryFn: async () => (await broadcastApi.listBroadcasts(p)).data,
  });

export const useBroadcastDetail = (id: string) =>
  useQuery({
    queryKey: broadcastKeys.broadcast(id),
    queryFn: async () => (await broadcastApi.getBroadcast(id)).data,
    enabled: !!id,
  });

export function useCreateBroadcast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => broadcastApi.createBroadcast(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["broadcast", "list"] });
      toast.success("Broadcast created");
    },
  });
}

export function useLaunchBroadcast() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => broadcastApi.launchBroadcast(id),
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: broadcastKeys.broadcast(id) });
      qc.invalidateQueries({ queryKey: ["broadcast", "list"] });
      toast.success("Broadcast launched!");
    },
    onError: () => toast.error("Failed to launch broadcast"),
  });
}
