import { AcceptInvitePage } from "@/components/auth/AcceptInvitePage";
export default function Page({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <AcceptInvitePage token={searchParams.token ?? ""} />;
}
