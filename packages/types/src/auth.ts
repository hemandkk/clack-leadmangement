import { TenantFeatureMap } from "./features";
export type UserRole = "super_admin" | "owner" | "manager" | "sales_staff";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  avatar?: string;
  mobile_prefix: string;
  mobile: string;
  status: true;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  features: TenantFeatureMap;
}
