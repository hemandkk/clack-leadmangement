import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { telephonyApi } from "@leadpro/api-client";
import type { CallFilters } from "@leadpro/types";

export const telephonyKeys = {
  calls: (f?: unknown) => ["calls", "list", f] as const,
  call: (id: string) => ["calls", "one", id] as const,
  stats: (p?: unknown) => ["calls", "stats", p] as const,
  ivrFlows: () => ["ivr", "list"] as const,
  ivrFlow: (id: string) => ["ivr", "one", id] as const,
  numbers: () => ["telephony", "numbers"] as const,
  settings: () => ["telephony", "settings"] as const,
};

// ─── Calls ─────────────────────────────────────────────────
export const useCallList = (f?: CallFilters) =>
  useQuery({
    queryKey: telephonyKeys.calls(f),
    queryFn: async () => (await telephonyApi.listCalls(f)).data,
  });

export const useCallDetail = (id: string) =>
  useQuery({
    queryKey: telephonyKeys.call(id),
    queryFn: async () => (await telephonyApi.getCall(id)).data,
    enabled: !!id,
  });

export const useCallStats = (p?: unknown) =>
  useQuery({
    queryKey: telephonyKeys.stats(p),
    queryFn: async () => (await telephonyApi.getStats(p)).data,
    staleTime: 1000 * 60 * 2,
  });

export function useLogCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => telephonyApi.logCall(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calls"] });
      toast.success("Call logged");
    },
  });
}

export function useUpdateCall(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => telephonyApi.updateCall(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: telephonyKeys.call(id) });
      qc.invalidateQueries({ queryKey: ["calls", "list"] });
      toast.success("Call updated");
    },
  });
}

export function useInitiateCall() {
  return useMutation({
    mutationFn: ({ leadId, phone }: { leadId: string; phone: string }) =>
      telephonyApi.initiateCall(leadId, phone),
    onSuccess: () => toast.success("Calling..."),
    onError: () => toast.error("Failed to initiate call"),
  });
}

// ─── IVR ───────────────────────────────────────────────────
export const useIVRFlows = () =>
  useQuery({
    queryKey: telephonyKeys.ivrFlows(),
    queryFn: async () => (await telephonyApi.listIVRFlows()).data,
  });

export const useIVRFlow = (id: string) =>
  useQuery({
    queryKey: telephonyKeys.ivrFlow(id),
    queryFn: async () => (await telephonyApi.getIVRFlow(id)).data,
    enabled: !!id,
  });

export function useCreateIVRFlow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => telephonyApi.createIVRFlow(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: telephonyKeys.ivrFlows() });
      toast.success("IVR flow created");
    },
  });
}

export function useUpdateIVRFlow(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => telephonyApi.updateIVRFlow(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: telephonyKeys.ivrFlow(id) });
      toast.success("IVR flow saved");
    },
  });
}

// ─── Numbers ───────────────────────────────────────────────
export const useVirtualNumbers = () =>
  useQuery({
    queryKey: telephonyKeys.numbers(),
    queryFn: async () => (await telephonyApi.listNumbers()).data,
  });

// ─── Settings ──────────────────────────────────────────────
export const useTelephonySettings = () =>
  useQuery({
    queryKey: telephonyKeys.settings(),
    queryFn: async () => (await telephonyApi.getProviderSettings()).data,
  });

export function useUpdateTelephonySettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => telephonyApi.updateProviderSettings(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: telephonyKeys.settings() });
      toast.success("Telephony settings saved");
    },
  });
}

export function useTestTelephonyConnection() {
  return useMutation({
    mutationFn: () => telephonyApi.testConnection(),
    onSuccess: (res) => toast.success(`Connected! ${res.data.message ?? ""}`),
    onError: () => toast.error("Connection test failed"),
  });
}
