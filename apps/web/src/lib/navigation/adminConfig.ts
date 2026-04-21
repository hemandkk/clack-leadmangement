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

export const ADMIN_NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: null,
  },
  {
    href: "/admin/notification",
    label: "Notification",
    icon: Users,
    permission: "null",
  },
  { href: "/admin/pricing", label: "Pricing", icon: Phone, permission: null },
  {
    href: "/admin/tenants",
    label: "Tenants",
    icon: Calendar,
    permission: null,
  },
];
