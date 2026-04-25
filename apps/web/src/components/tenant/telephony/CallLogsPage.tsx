"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useCallList,
  useCallStats,
  useInitiateCall,
} from "@/hooks/useTelephony";
import { useStaffList } from "@/hooks/useStaff";
import { useAuthStore } from "@/store/authStore";
import { usePermissions } from "@/hooks/usePermissions";
import { LogCallModal } from "./LogCallModal";
import { CallRecordingPlayer } from "./CallRecordingPlayer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Play,
  Plus,
  Search,
  Download,
} from "lucide-react";
import { cn, formatDate } from "@leadpro/utils";
import { formatDuration } from "@/lib/staffConfig";
import type { CallRecord, CallDirection, CallStatus } from "@leadpro/types";

const DIRECTION_CFG: Record<
  CallDirection,
  { icon: typeof PhoneIncoming; color: string; bg: string }
> = {
  inbound: { icon: PhoneIncoming, color: "text-green-600", bg: "bg-green-50" },
  outbound: { icon: PhoneOutgoing, color: "text-blue-600", bg: "bg-blue-50" },
};

const STATUS_CFG: Record<CallStatus, { label: string; color: string }> = {
  ringing: { label: "Ringing", color: "text-yellow-600" },
  answered: { label: "Answered", color: "text-green-600" },
  missed: { label: "Missed", color: "text-red-500" },
  rejected: { label: "Rejected", color: "text-red-400" },
  busy: { label: "Busy", color: "text-orange-500" },
  failed: { label: "Failed", color: "text-red-600" },
};

export function CallLogsPage() {
  const router = useRouter();
  const { can } = usePermissions();
  const currentUser = useAuthStore((s) => s.user);
  const isManager = can("MANAGE_STAFF");

  const [search, setSearch] = useState("");
  const [direction, setDirection] = useState("all");
  const [status, setStatus] = useState("all");
  const [staffId, setStaffId] = useState("all");
  const [period, setPeriod] = useState("today");
  const [showLog, setShowLog] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useCallList({
    direction: direction === "all" ? undefined : (direction as CallDirection),
    status: status === "all" ? undefined : (status as CallStatus),
    staffId: isManager
      ? staffId === "all"
        ? undefined
        : staffId
      : currentUser?.id,
    page: 1,
    perPage: 50,
  });

  const { data: statsData } = useCallStats({ period });
  const { data: staffData } = useStaffList();
  const { mutate: initCall } = useInitiateCall();

  const calls: CallRecord[] = data?.data ?? [];
  const stats = statsData;

  return (
    <div className="space-y-4">
      {/* Stats strip */}
      {stats && (
        <div className="grid grid-cols-5 gap-3">
          {[
            {
              label: "Total calls",
              value: stats.total,
              color: "text-slate-900",
            },
            {
              label: "Answered",
              value: stats.answered,
              color: "text-green-600",
            },
            { label: "Missed", value: stats.missed, color: "text-red-500" },
            {
              label: "Total duration",
              value: formatDuration(stats.totalDuration ?? 0),
              color: "text-slate-900",
            },
            {
              label: "Avg duration",
              value: formatDuration(stats.avgDuration ?? 0),
              color: "text-slate-700",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-slate-200 rounded-xl p-4 text-center"
            >
              <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search calls..."
            className="pl-8 h-8 text-sm w-44"
          />
        </div>

        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="h-8 text-sm w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This week</SelectItem>
            <SelectItem value="month">This month</SelectItem>
          </SelectContent>
        </Select>

        <Select value={direction} onValueChange={setDirection}>
          <SelectTrigger className="h-8 text-sm w-32">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All calls</SelectItem>
            <SelectItem value="inbound">Inbound</SelectItem>
            <SelectItem value="outbound">Outbound</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 text-sm w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All status</SelectItem>
            <SelectItem value="answered">Answered</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {isManager && (
          <Select value={staffId} onValueChange={setStaffId}>
            <SelectTrigger className="h-8 text-sm w-40">
              <SelectValue placeholder="All staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All staff</SelectItem>
              {(staffData?.data ?? []).map((s: any) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowLog(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Log call
          </Button>
        </div>
      </div>

      {/* Call table */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-14 bg-slate-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : calls.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl">
          <Phone className="h-10 w-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">No calls in this period</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {[
                  "Direction",
                  "Contact",
                  "Staff",
                  "Status",
                  "Duration",
                  "Date",
                  "Recording",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-4 py-3 text-xs font-semibold
                    text-slate-500 first:pl-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {calls.map((call) => {
                const dc = DIRECTION_CFG[call.direction];
                const sc = STATUS_CFG[call.status];
                const DIcon = dc.icon;

                return (
                  <tr
                    key={call.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full flex items-center justify-center",
                          dc.bg,
                        )}
                      >
                        <DIcon className={cn("h-4 w-4", dc.color)} />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {call.leadName ? (
                        <button
                          onClick={() =>
                            call.leadId && router.push(`/leads/${call.leadId}`)
                          }
                          className="text-left"
                        >
                          <p className="font-medium text-slate-800 hover:text-blue-600">
                            {call.leadName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {call.leadPhone}
                          </p>
                        </button>
                      ) : (
                        <p className="text-slate-500">
                          {call.leadPhone ?? "Unknown"}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {call.staffName}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn("text-sm font-medium", sc.color)}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-mono text-xs">
                      {call.status === "answered"
                        ? formatDuration(call.duration)
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {formatDate(call.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {call.recordingUrl ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-blue-500 hover:text-blue-700"
                          onClick={() =>
                            setPlayingId(playingId === call.id ? null : call.id)
                          }
                          title="Play recording"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        <span className="text-slate-300 text-xs">
                          No recording
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {/* Click to call */}
                      {call.leadPhone && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-green-600 hover:text-green-700"
                          onClick={() =>
                            call.leadId &&
                            initCall({
                              leadId: call.leadId,
                              phone: call.leadPhone!,
                            })
                          }
                          title="Call back"
                        >
                          <PhoneOutgoing className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Recording player modal */}
      {playingId &&
        (() => {
          const call = calls.find((c) => c.id === playingId);
          return call?.recordingUrl ? (
            <CallRecordingPlayer
              url={call.recordingUrl}
              callInfo={call}
              onClose={() => setPlayingId(null)}
            />
          ) : null;
        })()}

      <LogCallModal open={showLog} onClose={() => setShowLog(false)} />
    </div>
  );
}
