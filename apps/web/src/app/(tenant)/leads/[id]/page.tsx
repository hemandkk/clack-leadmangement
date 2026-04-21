import { LeadDetailClient } from "@/components/tenant/leads/LeadDetailClient";

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  return <LeadDetailClient id={params.id} />;
}
