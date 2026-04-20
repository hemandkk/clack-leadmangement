"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  Bell,
  Users2,
  Webhook,
  MessageSquareMore,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@leadpro/utils";
import { useFeature } from "@/hooks/useFeature";
import { FEATURES } from "@leadpro/types";

const NAV = [
  {
    group: "General",
    items: [
      { href: "/settings", label: "Company", icon: Building2 },
      { href: "/settings/notifications", label: "Notifications", icon: Bell },
      {
        href: "/settings/business-hours",
        label: "Business Hours",
        icon: Clock,
      },
      { href: "/settings/leads", label: "Leads", icon: Users2 },
    ],
  },
  {
    group: "Integrations",
    items: [
      {
        href: "/settings/integrations/whatsapp",
        label: "WhatsApp",
        icon: MessageSquareMore,
        feature: FEATURES.WHATSAPP_BROADCAST,
      },
      {
        href: "/settings/integrations/webhooks",
        label: "Webhooks",
        icon: Webhook,
        feature: FEATURES.WEBHOOK_INTEGRATION,
      },
    ],
  },
  {
    group: "Security",
    items: [
      {
        href: "/settings/roles",
        label: "Roles & Permissions",
        icon: ShieldCheck,
      },
    ],
  },
];

export function SettingsShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasWA = useFeature(FEATURES.WHATSAPP_BROADCAST);
  const hasWebhooks = useFeature(FEATURES.WEBHOOK_INTEGRATION);

  const featureMap: Record<string, boolean> = {
    [FEATURES.WHATSAPP_BROADCAST]: hasWA,
    [FEATURES.WEBHOOK_INTEGRATION]: hasWebhooks,
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage your workspace configuration and integrations
        </p>
      </div>

      <div className="flex gap-8">
        {/* Settings sidebar nav */}
        <aside className="w-52 shrink-0">
          <nav className="space-y-5">
            {NAV.map((group) => (
              <div key={group.group}>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-3">
                  {group.group}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    // Hide locked features from nav entirely
                    //if (item.feature && !featureMap[item.feature]) return null;
                    const Icon = item.icon;
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
                            active
                              ? "bg-slate-900 text-white"
                              : "text-slate-600 hover:bg-slate-100",
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Page content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
