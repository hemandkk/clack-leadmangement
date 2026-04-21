"use client";

import { useUIStore } from "@/store/uiStore";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { NavItem } from "@/types/navigation/navItem";
type AppShellProps = {
  children: React.ReactNode;
  navItems: NavItem[];
};

export function AppShell({ children, navItems }: AppShellProps) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar items={navItems} />
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? "240px" : "64px" }}
      >
        <TopBar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
