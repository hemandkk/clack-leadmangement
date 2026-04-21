import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { leadsApi } from "@leadpro/api-client";
import type { LeadFilters } from "@leadpro/types";
import type { UpdateLeadInput } from "@leadpro/validators";

// ─── Query keys ────────────────────────────────────────────
export const leadKeys = {
  all: () => ["leads"] as const,
  list: (f: LeadFilters) => ["leads", "list", f] as const,
  kanban: () => ["leads", "kanban"] as const,
  detail: (id: string) => ["leads", "detail", id] as const,
  activity: (id: string) => ["leads", "activity", id] as const,
};

// ─── Queries ───────────────────────────────────────────────
export function useLeadsList(filters: LeadFilters) {
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: async () => {
      const res = await leadsApi.list(filters);
      return res.data;
    },
    placeholderData: (prev) => prev, // keeps old data while fetching
  });
}

export function useLeadsKanban() {
  return useQuery({
    queryKey: leadKeys.kanban(),
    queryFn: async () => {
      const res = await leadsApi.getKanban();
      return res.data;
    },
  });
}

export function useLeadDetail(id: string) {
  return useQuery({
    queryKey: leadKeys.detail(id),
    queryFn: async () => {
      const res = await leadsApi.get(id);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useLeadActivity(id: string) {
  return useQuery({
    queryKey: leadKeys.activity(id),
    queryFn: async () => {
      const res = await leadsApi.getActivity(id);
      return res.data;
    },
    enabled: !!id,
  });
}

// ─── Mutations ─────────────────────────────────────────────
export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => leadsApi.create(data as any),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadKeys.all() });
      toast.success("Lead created successfully");
    },
    onError: () => toast.error("Failed to create lead"),
  });
}

export function useUpdateLead(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateLeadInput) => leadsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadKeys.detail(id) });
      qc.invalidateQueries({ queryKey: leadKeys.all() });
      toast.success("Lead updated");
    },
    onError: () => toast.error("Failed to update lead"),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadKeys.all() });
      toast.success("Lead deleted");
    },
    onError: () => toast.error("Failed to delete lead"),
  });
}

export function useUpdateLeadStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      leadsApi.updateStatus(id, status),
    // Optimistic update — update kanban instantly, revert on error
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: leadKeys.kanban() });
      const prev = qc.getQueryData(leadKeys.kanban());
      // optimistic mutation handled in kanban component
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(leadKeys.kanban(), ctx.prev);
      toast.error("Failed to update status");
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: leadKeys.kanban() });
    },
  });
}

export function useAssignLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, staffId }: { id: string; staffId: string }) =>
      leadsApi.assign(id, staffId),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: leadKeys.detail(id) });
      qc.invalidateQueries({ queryKey: leadKeys.all() });
      toast.success("Lead assigned");
    },
    onError: () => toast.error("Failed to assign lead"),
  });
}

export function useAddNote(leadId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (note: string) => leadsApi.addNote(leadId, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadKeys.activity(leadId) });
      toast.success("Note added");
    },
    onError: () => toast.error("Failed to add note"),
  });
}
