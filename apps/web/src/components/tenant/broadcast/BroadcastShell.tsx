"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MessageSquare, Send, BookTemplate } from "lucide-react";
import { cn } from "@leadpro/utils";

const TABS = [
  { href: "/broadcasts", label: "Overview", icon: Send },
  { href: "/broadcasts/email/templates", label: "Email templates", icon: Mail },
  {
    href: "/broadcasts/whatsapp/templates",
    label: "WhatsApp templates",
    icon: MessageSquare,
  },
];

export function BroadcastShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Broadcast</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Manage templates and send bulk messages via Email or WhatsApp
        </p>
      </div>
      <div className="flex items-center gap-0.5 border-b border-slate-200">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active =
            pathname === tab.href ||
            (tab.href !== "/broadcast" && pathname.startsWith(tab.href));
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
