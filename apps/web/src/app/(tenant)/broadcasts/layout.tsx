import { BroadcastShell } from "@/components/tenant/broadcast/BroadcastShell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <BroadcastShell>{children}</BroadcastShell>;
}
