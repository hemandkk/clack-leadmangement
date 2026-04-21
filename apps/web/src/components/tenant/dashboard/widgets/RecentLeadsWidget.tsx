"use client";

import { useRouter } from "next/navigation";
import { LeadStatusBadge } from "@/components/tenant/leads/LeadStatusBadge";
import { SOURCE_CONFIG } from "@/lib/leadConfig";
import { timeAgo } from "@leadpro/utils";
import type { RecentLeadRow, LeadStatus, LeadSource } from "@leadpro/types";

interface Props {
  leads: RecentLeadRow[];
  isLoading: boolean;
}

export function RecentLeadsWidget({ leads, isLoading }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-xl flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-900">Recent leads</h3>
        <button
          onClick={() => router.push("/leads")}
          className="text-xs text-slate-400 hover:text-slate-700"
        >
          View all →
        </button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div
          className="flex-1 flex items-center justify-center py-12
          text-sm text-slate-400"
        >
          No leads yet
        </div>
      ) : (
        <div className="divide-y divide-slate-100 flex-1 overflow-auto">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => router.push(`/leads/${lead.id}`)}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50
                cursor-pointer transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {lead.name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {SOURCE_CONFIG[lead.source as LeadSource]?.icon}{" "}
                  {timeAgo(lead.createdAt)}
                </p>
              </div>
              <LeadStatusBadge status={lead.status as LeadStatus} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
