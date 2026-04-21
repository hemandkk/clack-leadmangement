"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import CountUp from "react-countup";
import { cn } from "@leadpro/utils";
import type { KPIValue } from "@leadpro/types";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  kpi: KPIValue;
  icon: LucideIcon;
  iconColor: string; // tailwind bg class  e.g. "bg-blue-50"
  iconText: string; // tailwind text class e.g. "text-blue-600"
  prefix?: string; // "₹", "%"
  suffix?: string; // " leads", " calls"
  decimals?: number;
  formatter?: (v: number) => string;
  isLoading?: boolean;
}

export function KPICard({
  title,
  kpi,
  icon: Icon,
  iconColor,
  iconText,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatter,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
        <div className="flex justify-between mb-4">
          <div className="h-4 w-28 bg-slate-100 rounded" />
          <div className="h-9 w-9 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-8 w-24 bg-slate-100 rounded mb-2" />
        <div className="h-3 w-20 bg-slate-100 rounded" />
      </div>
    );
  }

  const TrendIcon =
    kpi.changeDir === "up"
      ? TrendingUp
      : kpi.changeDir === "down"
        ? TrendingDown
        : Minus;

  const trendColor =
    kpi.changeDir === "up"
      ? "text-green-600"
      : kpi.changeDir === "down"
        ? "text-red-500"
        : "text-slate-400";

  const displayValue = formatter ? formatter(kpi.value) : undefined;

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl p-5
      hover:shadow-sm hover:border-slate-300 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center",
            iconColor,
          )}
        >
          <Icon className={cn("h-4 w-4", iconText)} />
        </div>
      </div>

      <div className="mb-1.5">
        {displayValue ? (
          <p className="text-2xl font-bold text-slate-900">{displayValue}</p>
        ) : (
          <p className="text-2xl font-bold text-slate-900">
            {prefix}
            <CountUp
              end={kpi.value}
              duration={1.2}
              decimals={decimals}
              separator=","
            />
            {suffix}
          </p>
        )}
      </div>

      <div
        className={cn(
          "flex items-center gap-1 text-xs font-medium",
          trendColor,
        )}
      >
        <TrendIcon className="h-3 w-3" />
        <span>
          {kpi.change > 0 ? "+" : ""}
          {kpi.change.toFixed(1)}% vs last period
        </span>
      </div>
    </div>
  );
}
