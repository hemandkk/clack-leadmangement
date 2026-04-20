
import type { UserRole } from '@leadpro/types';
import type { Feature } from '@leadpro/types';

export const ROLES = {
  SUPER_ADMIN: 'super_admin' as UserRole,
  OWNER:       'owner'       as UserRole,
  MANAGER:     'manager'     as UserRole,
  SALES_STAFF: 'sales_staff' as UserRole,
};

// Which roles can do what
export const PERMISSIONS: Record<string, UserRole[]> = {
  VIEW_ALL_LEADS:    [ROLES.OWNER, ROLES.MANAGER],
  ASSIGN_LEADS:      [ROLES.OWNER, ROLES.MANAGER],
  VIEW_OWN_LEADS:    [ROLES.SALES_STAFF],
  MANAGE_STAFF:      [ROLES.OWNER, ROLES.MANAGER],
  VIEW_ALL_REPORTS:  [ROLES.OWNER, ROLES.MANAGER],
  VIEW_OWN_REPORTS:  [ROLES.SALES_STAFF],
  MANAGE_INTEGRATIONS: [ROLES.OWNER],
  APPROVE_LEAVES:    [ROLES.MANAGER, ROLES.OWNER],
  APPLY_LEAVE:       [ROLES.SALES_STAFF],
};

export const can = (role: UserRole, permission: string): boolean =>
  PERMISSIONS[permission]?.includes(role) ?? false;
