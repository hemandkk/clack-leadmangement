"use client";

import { useRouter } from "next/navigation";
import { MessageSquare, Mail, Clock } from "lucide-react";
import { formatDateTime } from "@leadpro/utils";
import type { FollowupItem } from "@leadpro/types";

interface Props {
  followups: FollowupItem[];
  isLoading: boolean;
}

const CHANNEL_ICON = {
  whatsapp: MessageSquare,
  email: Mail,
};

export function UpcomingFollowupsWidget({ followups, isLoading }: Props) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-slate-900">
            Upcoming follow-ups
          </h3>
        </div>
        <button
          onClick={() => router.push("/followups")}
          className="text-xs text-slate-400 hover:text-slate-700"
        >
          View all →
        </button>
      </div>

      {isLoading ? (
        <div className="p-4 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
      ) : followups.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-400">
          No upcoming follow-ups
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {followups.map((f) => {
            const Icon =
              CHANNEL_ICON[f.channel as keyof typeof CHANNEL_ICON] ?? Mail;
            return (
              <div
                key={f.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer"
                onClick={() => router.push(`/followups`)}
              >
                <div
                  className="h-7 w-7 rounded-full bg-blue-50 flex items-center
                  justify-center shrink-0"
                >
                  <Icon className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {f.leadName}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {formatDateTime(f.scheduledAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
