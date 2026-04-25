"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  Mail,
  Building2,
  Megaphone,
  CheckSquare,
  CalendarCheck,
  UserCog,
} from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@leadpro/utils";

const NAV = [
  {
    section: null,
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        permission: null,
      },
    ],
  },
  {
    section: "Sales",
    items: [
      { href: "/leads", label: "Leads", icon: Users, permission: null },
      {
        href: "/followups",
        label: "Follow-ups",
        icon: CalendarCheck,
        permission: null,
      },
      { href: "/tasks", label: "Tasks", icon: CheckSquare, permission: null },
      {
        href: "/campaigns",
        label: "Campaigns",
        icon: Megaphone,
        permission: null,
      },
    ],
  },
  {
    section: "Communicate",
    items: [
      { href: "/broadcast", label: "Broadcast", icon: Mail, permission: null },
      { href: "/telephony", label: "Calls", icon: PhoneCall, permission: null },
    ],
  },
  {
    section: "Team",
    items: [
      {
        href: "/staff",
        label: "Staff",
        icon: UserCog,
        permission: "MANAGE_STAFF",
      },
      { href: "/leaves", label: "Leaves", icon: Calendar, permission: null },
    ],
  },
  {
    section: "Insights",
    items: [
      { href: "/reports", label: "Reports", icon: BarChart3, permission: null },
    ],
  },
  {
    section: "Admin",
    items: [
      {
        href: "/company",
        label: "Company",
        icon: Building2,
        permission: "MANAGE_INTEGRATIONS",
      },
      {
        href: "/settings",
        label: "Settings",
        icon: Settings,
        permission: "MANAGE_INTEGRATIONS",
      },
    ],
  },
];

export function Sidebar1() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { can } = usePermissions();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-30",
        "transition-all duration-200 flex flex-col overflow-y-auto",
        sidebarOpen ? "w-56" : "w-16",
      )}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-between h-14 px-4 border-b
        border-slate-200 shrink-0"
      >
        {sidebarOpen && (
          <span className="font-bold text-slate-900 text-base tracking-tight">
            LeadPro
          </span>
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

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-4">
        {NAV.map((group, gi) => {
          const visibleItems = group.items.filter(
            (item) => !item.permission || can(item.permission),
          );
          if (!visibleItems.length) return null;

          return (
            <div key={gi}>
              {sidebarOpen && group.section && (
                <p
                  className="text-[10px] font-bold text-slate-400 uppercase
                  tracking-widest px-3 mb-1.5"
                >
                  {group.section}
                </p>
              )}
              <ul className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname.startsWith(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        title={!sidebarOpen ? item.label : undefined}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg",
                          "text-sm transition-colors",
                          active
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
