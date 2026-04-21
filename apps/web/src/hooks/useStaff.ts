import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { staffApi } from "@leadpro/api-client";

export const staffKeys = {
  all: () => ["staff"] as const,
  list: (p?: unknown) => ["staff", "list", p] as const,
  detail: (id: string) => ["staff", "detail", id] as const,
  targets: (id: string, p?: unknown) => ["staff", "targets", id, p] as const,
  calls: (id: string, p?: unknown) => ["staff", "calls", id, p] as const,
  payments: (id: string, p?: unknown) => ["staff", "payments", id, p] as const,
  balance: (id: string) => ["staff", "balance", id] as const,
};

export function useStaffList(params?: unknown) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: async () => (await staffApi.list(params)).data,
  });
}

export function useStaffDetail(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: async () => (await staffApi.get(id)).data,
    enabled: !!id,
  });
}

export function useStaffTargets(id: string, params?: unknown) {
  return useQuery({
    queryKey: staffKeys.targets(id, params),
    queryFn: async () => (await staffApi.getTargets(id, params)).data,
    enabled: !!id,
  });
}

export function useStaffCalls(id: string, params?: unknown) {
  return useQuery({
    queryKey: staffKeys.calls(id, params),
    queryFn: async () => (await staffApi.getCalls(id, params)).data,
    enabled: !!id,
  });
}

export function useStaffPayments(id: string, params?: unknown) {
  return useQuery({
    queryKey: staffKeys.payments(id, params),
    queryFn: async () => (await staffApi.getPayments(id, params)).data,
    enabled: !!id,
  });
}

export function useLeaveBalance(id: string) {
  return useQuery({
    queryKey: staffKeys.balance(id),
    queryFn: async () => (await staffApi.getLeaveBalance(id)).data,
    enabled: !!id,
  });
}

export function useInviteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => staffApi.invite(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffKeys.all() });
      toast.success("Invite sent successfully");
    },
    onError: () => toast.error("Failed to send invite"),
  });
}

export function useUpdateStaff(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => staffApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffKeys.detail(id) });
      qc.invalidateQueries({ queryKey: staffKeys.all() });
      toast.success("Staff updated");
    },
  });
}

export function useDeactivateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => staffApi.deactivate(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffKeys.all() });
      toast.success("Staff deactivated");
    },
  });
}

export function useSetTarget(staffId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => staffApi.setTarget(staffId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffKeys.targets(staffId) });
      toast.success("Target saved");
    },
    onError: () => toast.error("Failed to save target"),
  });
}

export function useMarkPaid(staffId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => staffApi.markPaid(staffId, paymentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffKeys.payments(staffId) });
      toast.success("Marked as paid");
    },
  });
}
