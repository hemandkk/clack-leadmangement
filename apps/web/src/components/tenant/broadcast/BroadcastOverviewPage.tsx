"use client";

import { useState } from "react";
import { useBroadcastList, useLaunchBroadcast } from "@/hooks/useBroadcast";
import { CreateBroadcastModal } from "./CreateBroadcastModal";
import { Button } from "@/components/ui/button";
import { Plus, Play, Pause, BarChart3, Send } from "lucide-react";
import { cn, formatDate } from "@leadpro/utils";
import type { BroadcastMessage } from "@leadpro/types";

const STATUS_CFG = {
  draft: { label: "Draft", bg: "bg-slate-100", text: "text-slate-500" },
  scheduled: { label: "Scheduled", bg: "bg-blue-50", text: "text-blue-700" },
  running: { label: "Running", bg: "bg-green-50", text: "text-green-700" },
  completed: {
    label: "Completed",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  paused: { label: "Paused", bg: "bg-yellow-50", text: "text-yellow-700" },
  failed: { label: "Failed", bg: "bg-red-50", text: "text-red-600" },
};

export function BroadcastOverviewPage() {
  const [showCreate, setCreate] = useState(false);
  const { data, isLoading } = useBroadcastList();
  const { mutate: launch } = useLaunchBroadcast();

  const broadcasts: BroadcastMessage[] = data?.data ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setCreate(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> New broadcast
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : broadcasts.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-xl">
          <Send className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 mb-3">No broadcasts yet</p>
          <Button variant="outline" size="sm" onClick={() => setCreate(true)}>
            Create first broadcast
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {broadcasts.map((b) => {
            const sc = STATUS_CFG[b.status];
            return (
              <div
                key={b.id}
                className="bg-white border border-slate-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {b.channel === "email" ? "📧" : "💬"}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{b.name}</p>
                      <p className="text-xs text-slate-400">
                        {b.templateName} · {b.totalAudience} recipients
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        sc.bg,
                        sc.text,
                      )}
                    >
                      {sc.label}
                    </span>
                    {b.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={() => launch(b.id)}
                      >
                        <Play className="h-3.5 w-3.5 mr-1" /> Launch
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-6 gap-3">
                  {[
                    { label: "Sent", value: b.sent, color: "text-slate-900" },
                    {
                      label: "Delivered",
                      value: b.delivered,
                      color: "text-blue-600",
                    },
                    {
                      label: "Opened",
                      value: b.opened,
                      color: "text-green-600",
                    },
                    {
                      label: "Clicked",
                      value: b.clicked,
                      color: "text-purple-600",
                    },
                    { label: "Failed", value: b.failed, color: "text-red-500" },
                    {
                      label: "Unsubscribed",
                      value: b.unsubscribed,
                      color: "text-slate-400",
                    },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="text-center bg-slate-50
                      rounded-lg py-2"
                    >
                      <p className={cn("text-base font-bold", s.color)}>
                        {s.value}
                      </p>
                      <p className="text-[10px] text-slate-400">{s.label}</p>
                    </div>
                  ))}
                </div>

                {b.scheduledAt && (
                  <p className="text-xs text-slate-400 mt-2">
                    Scheduled: {formatDate(b.scheduledAt)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <CreateBroadcastModal
        open={showCreate}
        onClose={() => setCreate(false)}
      />
    </div>
  );
}
