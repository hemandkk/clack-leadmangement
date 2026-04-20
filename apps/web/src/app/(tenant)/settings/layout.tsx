import { SettingsShell } from "@/components/tenant/settings/SettingsShell";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SettingsShell>{children}</SettingsShell>;
}
