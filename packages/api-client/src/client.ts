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
// 👉 Add interceptor
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    let subdomain: string | null = null;

    const parts = hostname.split(".");
    if (parts.length > 2) {
      subdomain = parts[0];
    }

    const EXCLUDED_ROUTES = ["/register", "/verify-otp", "/setup-tenant"];

    const isExcluded = EXCLUDED_ROUTES.some((route) =>
      config.url?.startsWith(route),
    );
    if (!isExcluded && subdomain) {
      config.headers["X-Tenant-Subdomain"] = subdomain;
    }
    if (!subdomain && hostname.includes("localhost")) {
      subdomain = "default"; // or test tenant
    }
    if (1) {
      config.headers["X-Tenant-Subdomain"] = "bharathi-airtel1";
    }
    const token = JSON.parse(localStorage.getItem("leadpro-auth") || "{}")
      ?.state?.tokens?.accessToken;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return config;
});
