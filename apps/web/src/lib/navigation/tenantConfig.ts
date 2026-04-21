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

export const TENANT_NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: null,
  },
  { href: "/leads", label: "Leads", icon: Users, permission: null },
  { href: "/staff", label: "Staff", icon: Users, permission: "MANAGE_STAFF" },
  { href: "/calls", label: "Calls", icon: Phone, permission: null },
  { href: "/leaves", label: "Leaves", icon: Calendar, permission: null },
  { href: "/followups", label: "Follow-ups", icon: Mail, permission: null },
  { href: "/reports", label: "Reports", icon: BarChart3, permission: null },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    permission: "MANAGE_INTEGRATIONS",
  },
];
