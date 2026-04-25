"use client";

import { useUIStore } from "@/store/uiStore";
import { Sidebar } from "./Sidebar";
import { Sidebar1 } from "./Sidebar1";
import { TopBar } from "./TopBar";
import { NavItem } from "@/types/navigation/navItem";
type AppShellProps = {
  children: React.ReactNode;
  navItems: NavItem[];
};

export function AppShell({ children, navItems }: AppShellProps) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 ">
      <Sidebar items={navItems} />
      {/*  <Sidebar1 /> */}
      <div
        className="flex-1 flex flex-col min-w-0 transition-all duration-200"
        style={{ marginLeft: sidebarOpen ? "240px" : "64px" }}
      >
        <TopBar />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </div>
  );
}
