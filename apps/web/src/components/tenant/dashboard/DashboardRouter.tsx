"use client";

import { useAuthStore } from "@/store/authStore";
import { ManagerDashboard } from "./ManagerDashboard";
import { StaffDashboard } from "./StaffDashboard";

export function DashboardRouter() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  if (user.role === "sales_staff") {
    return <StaffDashboard />;
  }

  // owner and manager see the same tenant dashboard
  return <ManagerDashboard />;
}
