
import { useAuthStore } from '@/store/authStore';
import { can } from '@/lib/permissions';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  return {
    can: (permission: string) => user ? can(user.role, permission) : false,
    role: user?.role,
  };
}
