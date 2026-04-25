import { TelephonyShell } from "@/components/tenant/telephony/TelephonyShell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <TelephonyShell>{children}</TelephonyShell>;
}
