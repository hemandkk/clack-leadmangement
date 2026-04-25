import { apiClient } from "./client";

export const masterApi = {
  // Products master list
  listProducts: (search?: string) =>
    apiClient.get("/master/products", { params: { search } }),
  createProduct: (d: unknown) => apiClient.post("/master/products", d),
  updateProduct: (id: string, d: unknown) =>
    apiClient.put(`/master/products/${id}`, d),
  deleteProduct: (id: string) => apiClient.delete(`/master/products/${id}`),

  // Organisations
  listOrganisations: (search?: string) =>
    apiClient.get("/master/organisations", { params: { search } }),
  createOrganisation: (d: unknown) =>
    apiClient.post("/master/organisations", d),

  // Staff list (for assignment dropdown)
  listAssignableStaff: () => apiClient.get("/staff/assignable"),
};
