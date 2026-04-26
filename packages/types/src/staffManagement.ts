// ─── Permissions ────────────────────────────────────────────
export type PermissionKey =
  // Leads
  | "leads.view_all"
  | "leads.view_own"
  | "leads.create"
  | "leads.edit"
  | "leads.delete"
  | "leads.assign"
  | "leads.import"
  | "leads.export"
  // Contacts
  | "contacts.view"
  | "contacts.create"
  | "contacts.edit"
  | "contacts.delete"
  // Staff / Users
  | "staff.view"
  | "staff.create"
  | "staff.edit"
  | "staff.delete"
  | "staff.manage_roles"
  // Reports
  | "reports.view_own"
  | "reports.view_all"
  | "reports.export"
  // Campaigns
  | "campaigns.view"
  | "campaigns.create"
  | "campaigns.edit"
  | "campaigns.delete"
  // Broadcasts
  | "broadcasts.view"
  | "broadcasts.send"
  | "broadcasts.manage_templates"
  // Calls
  | "calls.view_own"
  | "calls.view_all"
  | "calls.log"
  | "calls.delete"
  | "calls.view_recordings"
  // Leaves
  | "leaves.view_own"
  | "leaves.view_all"
  | "leaves.apply"
  | "leaves.approve"
  // Tasks
  | "tasks.view_own"
  | "tasks.view_all"
  | "tasks.create"
  | "tasks.assign"
  // Follow-ups
  | "followups.view_own"
  | "followups.view_all"
  | "followups.create"
  // Settings
  | "settings.view"
  | "settings.edit"
  // Billing
  | "billing.view"
  | "billing.manage"
  // Telephony
  | "telephony.view"
  | "telephony.manage_ivr";

export type StaffRole = "owner" | "manager" | "sales_staff" | "custom";

export interface RoleTemplate {
  role: StaffRole;
  label: string;
  description: string;
  permissions: PermissionKey[];
}

export interface StaffMember {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  mobilePrefix: string; // "+91", "+971" etc.
  role: StaffRole;
  permissions: PermissionKey[];
  status: "active" | "inactive" | "invited" | "suspended";
  avatar?: string;
  designation?: string; // job title e.g. "Senior Sales Executive"
  department?: string;
  employeeId?: string;
  joinedAt?: string;
  lastLogin?: string;
  invitedAt?: string;
  inviteToken?: string;
  isOnLeave: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InvitePayload {
  name: string;
  email: string;
  mobilePrefix: string;
  phone: string;
  role: StaffRole;
  permissions: PermissionKey[];
  designation?: string;
  department?: string;
  employeeId?: string;
  sendInviteEmail: boolean;
}

export interface AcceptInvitePayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone?: string;
  mobilePrefix: string;
  designation?: string;
  department?: string;
  avatar?: string;
}

export interface UpdateStaffRolePayload {
  role: StaffRole;
  permissions: PermissionKey[];
}
