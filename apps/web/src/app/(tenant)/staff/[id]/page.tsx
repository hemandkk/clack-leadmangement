import { StaffDetailClient } from "@/components/tenant/staff/StaffDetailClient";
export default function StaffDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return <StaffDetailClient id={params.id} />;
}
