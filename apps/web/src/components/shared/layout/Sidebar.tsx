"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Phone,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  Mail,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@leadpro/utils";
import { NavItem } from "@/types/navigation/navItem";
type SidebarProps = {
  items: NavItem[];
};
export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { can } = usePermissions();

  const visibleItems = items.filter(
    (item) => !item.permission || can(item.permission),
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-30",
        "transition-all duration-200 flex flex-col",
        sidebarOpen ? "w-60" : "w-16",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
        {sidebarOpen && (
          <span className="font-semibold text-slate-900 text-lg">LeadPro</span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-slate-100 ml-auto"
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 text-slate-500 transition-transform",
              !sidebarOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
