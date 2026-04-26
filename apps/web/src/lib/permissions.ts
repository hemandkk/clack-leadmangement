import type { UserRole } from "@leadpro/types";
import type { Feature } from "@leadpro/types";
import type { PermissionKey, RoleTemplate, StaffRole } from "@leadpro/types";
export const ROLES = {
  SUPER_ADMIN: "super_admin" as UserRole,
  OWNER: "owner" as UserRole,
  MANAGER: "manager" as UserRole,
  SALES_STAFF: "sales_staff" as UserRole,
};
export const PERMISSION_GROUPS: {
  group: string;
  icon: string;
  items: { key: PermissionKey; label: string; description: string }[];
}[] = [
  {
    group: "Leads",
    icon: "👥",
    items: [
      {
        key: "leads.view_all",
        label: "View all leads",
        description: "See leads assigned to any staff",
      },
      {
        key: "leads.view_own",
        label: "View own leads",
        description: "See only their assigned leads",
      },
      {
        key: "leads.create",
        label: "Create leads",
        description: "Add new leads to the system",
      },
      {
        key: "leads.edit",
        label: "Edit leads",
        description: "Update lead details and status",
      },
      {
        key: "leads.delete",
        label: "Delete leads",
        description: "Permanently delete leads",
      },
      {
        key: "leads.assign",
        label: "Assign leads",
        description: "Assign leads to staff members",
      },
      {
        key: "leads.import",
        label: "Import leads",
        description: "Bulk import from CSV/Excel",
      },
      {
        key: "leads.export",
        label: "Export leads",
        description: "Export leads to CSV/Excel",
      },
    ],
  },
  {
    group: "Staff",
    icon: "👤",
    items: [
      {
        key: "staff.view",
        label: "View staff",
        description: "See staff list and profiles",
      },
      {
        key: "staff.create",
        label: "Add staff",
        description: "Invite new staff members",
      },
      {
        key: "staff.edit",
        label: "Edit staff",
        description: "Update staff details",
      },
      {
        key: "staff.delete",
        label: "Remove staff",
        description: "Deactivate staff accounts",
      },
      {
        key: "staff.manage_roles",
        label: "Manage roles",
        description: "Change roles and permissions",
      },
    ],
  },
  {
    group: "Calls",
    icon: "📞",
    items: [
      {
        key: "calls.view_own",
        label: "View own calls",
        description: "See their own call logs",
      },
      {
        key: "calls.view_all",
        label: "View all calls",
        description: "See call logs of all staff",
      },
      {
        key: "calls.log",
        label: "Log calls",
        description: "Manually log call records",
      },
      {
        key: "calls.delete",
        label: "Delete calls",
        description: "Delete call log entries",
      },
      {
        key: "calls.view_recordings",
        label: "Listen to recordings",
        description: "Play call recordings",
      },
    ],
  },
  {
    group: "Broadcasts",
    icon: "📣",
    items: [
      {
        key: "broadcasts.view",
        label: "View broadcasts",
        description: "See broadcast history",
      },
      {
        key: "broadcasts.send",
        label: "Send broadcasts",
        description: "Launch broadcast campaigns",
      },
      {
        key: "broadcasts.manage_templates",
        label: "Manage templates",
        description: "Create/edit templates",
      },
    ],
  },
  {
    group: "Campaigns",
    icon: "🎯",
    items: [
      {
        key: "campaigns.view",
        label: "View campaigns",
        description: "See all campaigns",
      },
      {
        key: "campaigns.create",
        label: "Create campaigns",
        description: "Create new ad campaigns",
      },
      {
        key: "campaigns.edit",
        label: "Edit campaigns",
        description: "Update campaign details",
      },
      {
        key: "campaigns.delete",
        label: "Delete campaigns",
        description: "Remove campaigns",
      },
    ],
  },
  {
    group: "Reports",
    icon: "📊",
    items: [
      {
        key: "reports.view_own",
        label: "View own reports",
        description: "See their own performance",
      },
      {
        key: "reports.view_all",
        label: "View all reports",
        description: "See all staff reports",
      },
      {
        key: "reports.export",
        label: "Export reports",
        description: "Download report files",
      },
    ],
  },
  {
    group: "Leaves",
    icon: "📅",
    items: [
      {
        key: "leaves.view_own",
        label: "View own leaves",
        description: "See their leave history",
      },
      {
        key: "leaves.view_all",
        label: "View all leaves",
        description: "See all staff leaves",
      },
      {
        key: "leaves.apply",
        label: "Apply for leave",
        description: "Submit leave applications",
      },
      {
        key: "leaves.approve",
        label: "Approve leaves",
        description: "Approve/reject leave apps",
      },
    ],
  },
  {
    group: "Tasks & Follow-ups",
    icon: "✅",
    items: [
      {
        key: "tasks.view_own",
        label: "View own tasks",
        description: "See their tasks",
      },
      {
        key: "tasks.view_all",
        label: "View all tasks",
        description: "See all staff tasks",
      },
      {
        key: "tasks.create",
        label: "Create tasks",
        description: "Add new tasks",
      },
      {
        key: "tasks.assign",
        label: "Assign tasks",
        description: "Assign tasks to staff",
      },
      {
        key: "followups.view_own",
        label: "View own follow-ups",
        description: "See their follow-ups",
      },
      {
        key: "followups.view_all",
        label: "View all follow-ups",
        description: "See all follow-ups",
      },
      {
        key: "followups.create",
        label: "Create follow-ups",
        description: "Schedule follow-ups",
      },
    ],
  },
  {
    group: "Settings",
    icon: "⚙️",
    items: [
      {
        key: "settings.view",
        label: "View settings",
        description: "See workspace settings",
      },
      {
        key: "settings.edit",
        label: "Edit settings",
        description: "Change workspace settings",
      },
      {
        key: "billing.view",
        label: "View billing",
        description: "See subscription & bills",
      },
      {
        key: "billing.manage",
        label: "Manage billing",
        description: "Change plans & pay",
      },
      {
        key: "telephony.view",
        label: "View telephony",
        description: "Access call module",
      },
      {
        key: "telephony.manage_ivr",
        label: "Manage IVR",
        description: "Configure IVR flows",
      },
    ],
  },
];
// Which roles can do what
export const PERMISSIONS: Record<string, UserRole[]> = {
  VIEW_ALL_LEADS: [ROLES.OWNER, ROLES.MANAGER],
  ASSIGN_LEADS: [ROLES.OWNER, ROLES.MANAGER],
  VIEW_OWN_LEADS: [ROLES.SALES_STAFF],
  MANAGE_STAFF: [ROLES.OWNER, ROLES.MANAGER],
  VIEW_ALL_REPORTS: [ROLES.OWNER, ROLES.MANAGER],
  VIEW_OWN_REPORTS: [ROLES.SALES_STAFF],
  MANAGE_INTEGRATIONS: [ROLES.OWNER],
  APPROVE_LEAVES: [ROLES.MANAGER, ROLES.OWNER],
  APPLY_LEAVE: [ROLES.SALES_STAFF],
};
// ─── Role templates ─────────────────────────────────────────
export const ROLE_TEMPLATES: RoleTemplate[] = [
  {
    role: "owner",
    label: "Owner",
    description: "Full access to everything",
    permissions: PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.key)),
  },
  {
    role: "manager",
    label: "Manager",
    description: "Manage team, leads, and reports",
    permissions: [
      "leads.view_all",
      "leads.create",
      "leads.edit",
      "leads.assign",
      "leads.import",
      "leads.export",
      "staff.view",
      "staff.create",
      "staff.edit",
      "calls.view_all",
      "calls.log",
      "calls.view_recordings",
      "broadcasts.view",
      "broadcasts.send",
      "broadcasts.manage_templates",
      "campaigns.view",
      "campaigns.create",
      "campaigns.edit",
      "reports.view_all",
      "reports.export",
      "leaves.view_all",
      "leaves.approve",
      "tasks.view_all",
      "tasks.create",
      "tasks.assign",
      "followups.view_all",
      "followups.create",
      "settings.view",
      "telephony.view",
    ],
  },
  {
    role: "sales_staff",
    label: "Sales Staff",
    description: "Handle own leads and calls",
    permissions: [
      "leads.view_own",
      "leads.create",
      "leads.edit",
      "calls.view_own",
      "calls.log",
      "broadcasts.view",
      "reports.view_own",
      "leaves.view_own",
      "leaves.apply",
      "tasks.view_own",
      "tasks.create",
      "followups.view_own",
      "followups.create",
    ],
  },
];

export const getRoleTemplate = (role: StaffRole): RoleTemplate | undefined =>
  ROLE_TEMPLATES.find((r) => r.role === role);

export const can = (role: UserRole, permission: string): boolean =>
  PERMISSIONS[permission]?.includes(role) ?? false;

export const canHave = (
  permissions: PermissionKey[],
  key: PermissionKey,
): boolean => permissions.includes(key);
