import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Call after login to attach token to every request
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

// Call after login to scope all requests to the tenant
export const setTenantId = (tenantId: string | null) => {
  if (tenantId) {
    apiClient.defaults.headers.common["X-Tenant-ID"] = tenantId;
  } else {
    delete apiClient.defaults.headers.common["X-Tenant-ID"];
  }
};

// Response interceptor: handle 401 globally
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect — handled by app-level listener
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);
