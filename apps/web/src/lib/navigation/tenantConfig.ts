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
  Radio,
  CalendarCheck,
  UserCog,
  Phone,
} from "lucide-react";

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
      { href: "/broadcasts", label: "Broadcast", icon: Mail, permission: null },
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

export const TENANT_NAV_ITEMS = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: null,
  },
  { href: "/leads", label: "Leads", icon: Users, permission: null },
  { href: "/staff", label: "Staff", icon: Users, permission: "MANAGE_STAFF" },
  { href: "/tasks", label: "Tasks", icon: CheckSquare, permission: null },
  { href: "/campaigns", label: "Campaign", icon: Megaphone, permission: null },
  { href: "/broadcasts", label: "Broadcasts", icon: Mail, permission: null },
  { href: "/telephony", label: "Calls", icon: PhoneCall, permission: null },
  { href: "/leaves", label: "Leaves", icon: Calendar, permission: null },
  { href: "/followups", label: "Follow-ups", icon: Mail, permission: null },
  { href: "/reports", label: "Reports", icon: BarChart3, permission: null },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    permission: "MANAGE_INTEGRATIONS",
  },
  {
    href: "/company",
    label: "Company",
    icon: Building2,
    permission: "MANAGE_INTEGRATIONS",
  },
];
