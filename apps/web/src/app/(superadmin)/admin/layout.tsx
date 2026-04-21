"use client";
import { AppShell } from "@/components/shared/layout/AppShell";
import { TENANT_NAV_ITEMS } from "@/lib/navigation/tenantConfig";
import { ADMIN_NAV_ITEMS } from "@/lib/navigation/adminConfig";
import { useAuthStore } from "@/store/authStore";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const navItems =
    user?.role === "super_admin" ? ADMIN_NAV_ITEMS : TENANT_NAV_ITEMS;
  return <AppShell navItems={navItems}>{children}</AppShell>;
}
