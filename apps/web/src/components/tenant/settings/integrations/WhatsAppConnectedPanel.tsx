"use client";

import { useState } from "react";
import {
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  useDisconnectWhatsApp,
  useWATemplates,
  useSyncWATemplates,
} from "@/hooks/useSettings";
import { SettingsCard } from "../SettingsCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { WhatsAppConfig, WhatsAppTemplate } from "@leadpro/types";

interface Props {
  config: WhatsAppConfig;
}

export function WhatsAppConnectedPanel({ config }: Props) {
  const [showDisconnect, setShowDisconnect] = useState(false);
  const { mutate: disconnect, isPending: disc } = useDisconnectWhatsApp();
  const { data: templates, isLoading: loadTpl } = useWATemplates();
  const { mutate: syncTemplates, isPending: syncing } = useSyncWATemplates();

  return (
    <div className="space-y-4">
      {/* Account info */}
      <SettingsCard
        title="Connected account"
        action={
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
            onClick={() => setShowDisconnect(true)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Disconnect
          </Button>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Display name" value={config.displayName ?? "—"} />
          <InfoRow label="Phone number" value={config.phoneNumber ?? "—"} />
          <InfoRow
            label="Account ID"
            value={config.businessAccountId ?? "—"}
            mono
          />
          <InfoRow label="Phone ID" value={config.phoneNumberId ?? "—"} mono />
          <div className="col-span-2">
            <p className="text-xs text-slate-400 mb-1">Quality rating</p>
            <QualityBadge rating={config.qualityRating} />
          </div>
        </div>
      </SettingsCard>

      {/* Templates */}
      <SettingsCard
        title="Message templates"
        description="Pre-approved templates from Meta required for outbound messages"
        action={
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => syncTemplates()}
            disabled={syncing}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${syncing ? "animate-spin" : ""}`}
            />
            {syncing ? "Syncing..." : "Sync from Meta"}
          </Button>
        }
      >
        {loadTpl ? (
          <div className="space-y-2">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-12 bg-slate-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {(templates ?? []).length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">
                No templates yet. Click &quot Sync from Meta &quot to import
                approved templates.
              </p>
            ) : (
              (templates as WhatsAppTemplate[]).map((tpl) => (
                <TemplateRow key={tpl.id} template={tpl} />
              ))
            )}
          </div>
        )}
      </SettingsCard>

      {/* Disconnect confirm */}
      <AlertDialog open={showDisconnect} onOpenChange={setShowDisconnect}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect WhatsApp?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop all WhatsApp messaging. Scheduled broadcasts and
              follow-ups using WhatsApp will be paused. You can reconnect at any
              time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                disconnect();
                setShowDisconnect(false);
              }}
              disabled={disc}
            >
              {disc ? "Disconnecting..." : "Yes, disconnect"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
      <p
        className={`text-sm text-slate-800 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function QualityBadge({ rating }: { rating?: "green" | "yellow" | "red" }) {
  const map = {
    green: {
      label: "High quality",
      cls: "bg-green-50 text-green-700",
      icon: CheckCircle2,
    },
    yellow: {
      label: "Medium quality",
      cls: "bg-yellow-50 text-yellow-700",
      icon: Clock,
    },
    red: {
      label: "Low quality",
      cls: "bg-red-50 text-red-600",
      icon: AlertCircle,
    },
  };
  if (!rating) return <span className="text-xs text-slate-400">Unknown</span>;
  const cfg = map[rating];
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {cfg.label}
    </span>
  );
}

function TemplateRow({ template }: { template: WhatsAppTemplate }) {
  const statusMap = {
    APPROVED: { label: "Approved", cls: "bg-green-50 text-green-700" },
    PENDING: { label: "Pending", cls: "bg-yellow-50 text-yellow-700" },
    REJECTED: { label: "Rejected", cls: "bg-red-50 text-red-600" },
  };
  const s = statusMap[template.status];
  return (
    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50">
      <div>
        <p className="text-sm font-medium text-slate-800">{template.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">
          {template.category} · {template.language}
        </p>
      </div>
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
        {s.label}
      </span>
    </div>
  );
}
