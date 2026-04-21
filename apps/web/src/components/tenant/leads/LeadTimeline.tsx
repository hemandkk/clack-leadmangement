"use client";

import {
  Phone,
  MessageSquare,
  Mail,
  FileText,
  RefreshCw,
  UserCheck,
  Circle,
} from "lucide-react";
import { formatDateTime } from "@leadpro/utils";
import { cn } from "@leadpro/utils";
import type { LeadActivity } from "@leadpro/types";

const ACTIVITY_ICONS = {
  call: { icon: Phone, color: "bg-blue-50 text-blue-600" },
  whatsapp: { icon: MessageSquare, color: "bg-green-50 text-green-600" },
  email: { icon: Mail, color: "bg-purple-50 text-purple-600" },
  note: { icon: FileText, color: "bg-slate-50 text-slate-600" },
  status_change: { icon: RefreshCw, color: "bg-orange-50 text-orange-600" },
  assignment: { icon: UserCheck, color: "bg-teal-50 text-teal-600" },
};

interface Props {
  activities: LeadActivity[];
}

export function LeadTimeline({ activities }: Props) {
  if (!activities.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
        <Circle className="h-8 w-8 text-slate-200 mx-auto mb-2" />
        <p className="text-sm text-slate-400">No activity yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <p className="text-sm font-medium mb-4">Activity</p>
      <div className="space-y-0">
        {activities.map((activity, idx) => {
          const cfg = ACTIVITY_ICONS[activity.type] ?? ACTIVITY_ICONS.note;
          const Icon = cfg.icon;
          const isLast = idx === activities.length - 1;

          return (
            <div key={activity.id} className="flex gap-3">
              {/* Icon + line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-7 w-7 rounded-full flex items-center justify-center shrink-0",
                    cfg.color,
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                {!isLast && <div className="w-px flex-1 bg-slate-100 my-1" />}
              </div>

              {/* Content */}
              <div className={cn("pb-4 flex-1 min-w-0", isLast && "pb-0")}>
                <p className="text-sm text-slate-700">{activity.description}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activity.createdByName} ·{" "}
                  {formatDateTime(activity.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
