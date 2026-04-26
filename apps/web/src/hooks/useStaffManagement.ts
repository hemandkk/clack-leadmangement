import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { staffMgmtApi } from "@leadpro/api-client";

export const staffMgmtKeys = {
  all: () => ["staff-mgmt"] as const,
  list: (p?: unknown) => ["staff-mgmt", "list", p] as const,
  detail: (id: string) => ["staff-mgmt", "one", id] as const,
  profile: () => ["staff-mgmt", "profile"] as const,
};

// ─── Queries ───────────────────────────────────────────────
export const useStaffMgmtList = (p?: unknown) =>
  useQuery({
    queryKey: staffMgmtKeys.list(p),
    queryFn: async () => (await staffMgmtApi.list(p)).data,
  });

export const useStaffMgmtDetail = (id: string) =>
  useQuery({
    queryKey: staffMgmtKeys.detail(id),
    queryFn: async () => (await staffMgmtApi.get(id)).data,
    enabled: !!id,
  });

export const useMyProfile = () =>
  useQuery({
    queryKey: staffMgmtKeys.profile(),
    queryFn: async () => (await staffMgmtApi.getMyProfile()).data,
  });

// ─── Mutations ─────────────────────────────────────────────
export function useInviteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => staffMgmtApi.invite(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffMgmtKeys.all() });
      toast.success("Invite sent successfully");
    },
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Failed to send invite"),
  });
}

export function useUpdateStaff(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => staffMgmtApi.update(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffMgmtKeys.detail(id) });
      qc.invalidateQueries({ queryKey: staffMgmtKeys.all() });
      toast.success("Staff updated");
    },
  });
}

export function useUpdateStaffRole(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => staffMgmtApi.updateRole(id, d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffMgmtKeys.detail(id) });
      qc.invalidateQueries({ queryKey: staffMgmtKeys.all() });
      toast.success("Role & permissions updated");
    },
    onError: () => toast.error("Failed to update role"),
  });
}

export function useDeactivateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      staffMgmtApi.deactivate(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffMgmtKeys.all() });
      toast.success("Staff deactivated");
    },
  });
}

export function useResendInvite() {
  return useMutation({
    mutationFn: (id: string) => staffMgmtApi.resendInvite(id),
    onSuccess: () => toast.success("Invite email resent"),
    onError: () => toast.error("Failed to resend invite"),
  });
}

export function useUpdateMyProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (d: unknown) => staffMgmtApi.updateMyProfile(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: staffMgmtKeys.profile() });
      toast.success("Profile updated");
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (d: unknown) => staffMgmtApi.changePassword(d),
    onSuccess: () => toast.success("Password changed successfully"),
    onError: (e: any) =>
      toast.error(e?.response?.data?.message ?? "Failed to change password"),
  });
}
