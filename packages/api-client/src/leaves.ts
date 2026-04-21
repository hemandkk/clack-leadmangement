import { apiClient } from "./client";

export const leavesApi = {
  // All leaves (manager view)
  list: (params?: unknown) => apiClient.get("/leaves", { params }),
  get: (id: string) => apiClient.get(`/leaves/${id}`),
  approve: (id: string) => apiClient.post(`/leaves/${id}/approve`),
  reject: (id: string, reason: string) =>
    apiClient.post(`/leaves/${id}/reject`, { reason }),

  // Staff applies for own leave
  apply: (data: unknown) => apiClient.post("/leaves", data),
  cancel: (id: string) => apiClient.post(`/leaves/${id}/cancel`),

  // Calendar view — returns leaves for a month
  calendar: (year: number, month: number) =>
    apiClient.get("/leaves/calendar", { params: { year, month } }),
};
