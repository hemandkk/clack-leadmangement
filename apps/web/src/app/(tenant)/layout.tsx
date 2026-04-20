import { AppShell } from '@/components/shared/layout/AppShell';

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}