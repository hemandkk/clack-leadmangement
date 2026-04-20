"use client";

import { useWhatsAppConfig } from "@/hooks/useSettings";
import { WhatsAppConnectWizard } from "./WhatsAppConnectWizard";
import { WhatsAppConnectedPanel } from "./WhatsAppConnectedPanel";
import { SettingsCard } from "../SettingsCard";

export function WhatsAppSettingsPage() {
  const { data: config, isLoading } = useWhatsAppConfig();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const isConnected = config?.status === "connected";

  return (
    <div className="space-y-6">
      {/* Header card */}
      <SettingsCard
        title="WhatsApp Business API"
        description="Send messages, broadcast campaigns, and receive leads via WhatsApp"
      >
        <div className="flex items-center gap-3">
          {/* WhatsApp icon */}
          <div className="h-10 w-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              WhatsApp Business
            </p>
            <p className="text-xs text-slate-400">
              Connect via Meta's Cloud API (no hardware required)
            </p>
          </div>
          <div className="ml-auto">
            <StatusPill status={config?.status ?? "not_connected"} />
          </div>
        </div>
      </SettingsCard>

      {/* Main content: wizard or connected panel */}
      {isConnected ? (
        <WhatsAppConnectedPanel config={config!} />
      ) : (
        <WhatsAppConnectWizard currentConfig={config} />
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    not_connected: {
      label: "Not connected",
      cls: "bg-slate-100 text-slate-500",
    },
    pending_verification: {
      label: "Pending",
      cls: "bg-yellow-50 text-yellow-700",
    },
    connected: { label: "Connected", cls: "bg-green-50 text-green-700" },
    disconnected: { label: "Disconnected", cls: "bg-red-50 text-red-600" },
    error: { label: "Error", cls: "bg-red-50 text-red-600" },
  };
  const cfg = map[status] ?? map.not_connected;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}
