"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, GitBranch, Hash, Settings } from "lucide-react";
import { cn } from "@leadpro/utils";
import { useFeature } from "@/hooks/useFeature";
import { FEATURES } from "@leadpro/types";

export function TelephonyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasIVR = useFeature(FEATURES.IVR_CALLING);
  const hasRec = useFeature(FEATURES.CALL_RECORDING);

  const TABS = [
    { href: "/telephony", label: "Call logs", icon: Phone },
    ...(hasIVR
      ? [{ href: "/telephony/ivr", label: "IVR flows", icon: GitBranch }]
      : []),
    { href: "/telephony/numbers", label: "Numbers", icon: Hash },
    { href: "/telephony/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Telephony</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Call logs, recordings, IVR flows and virtual numbers
        </p>
      </div>
      <div className="flex items-center gap-0.5 border-b border-slate-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium",
                "border-b-2 -mb-px transition-colors",
                active
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </div>
      {children}
    </div>
  );
}
