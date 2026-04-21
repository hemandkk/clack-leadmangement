import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { leavesApi } from "@leadpro/api-client";
import type { LeaveFilters } from "@leadpro/types";

export const leaveKeys = {
  all: () => ["leaves"] as const,
  list: (f?: LeaveFilters) => ["leaves", "list", f] as const,
  detail: (id: string) => ["leaves", "detail", id] as const,
  calendar: (y: number, m: number) => ["leaves", "calendar", y, m] as const,
};

export function useLeavesList(filters?: LeaveFilters) {
  return useQuery({
    queryKey: leaveKeys.list(filters),
    queryFn: async () => (await leavesApi.list(filters)).data,
  });
}

export function useLeaveCalendar(year: number, month: number) {
  return useQuery({
    queryKey: leaveKeys.calendar(year, month),
    queryFn: async () => (await leavesApi.calendar(year, month)).data,
  });
}

export function useApplyLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => leavesApi.apply(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leaveKeys.all() });
      toast.success("Leave application submitted");
    },
    onError: () => toast.error("Failed to submit leave application"),
  });
}

export function useApproveLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leavesApi.approve(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leaveKeys.all() });
      toast.success("Leave approved");
    },
  });
}

export function useRejectLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      leavesApi.reject(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leaveKeys.all() });
      toast.success("Leave rejected");
    },
  });
}

export function useCancelLeave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leavesApi.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leaveKeys.all() });
      toast.success("Leave cancelled");
    },
  });
}
