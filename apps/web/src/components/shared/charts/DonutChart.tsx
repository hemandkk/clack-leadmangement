"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { tooltipStyle } from "@/lib/chartConfig";
import type { ChartDataPoint } from "@leadpro/types";

interface Props {
  data: ChartDataPoint[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
}

export function DonutChart({
  data,
  height = 200,
  innerRadius = 55,
  outerRadius = 80,
}: Props) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? "#3b82f6"} />
            ))}
          </Pie>
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number | string | undefined) => {
              if (value === undefined || typeof value !== "number")
                return ["", ""];
              return [`${value} (${((value / total) * 100).toFixed(1)}%)`, ""];
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="text-2xl font-bold text-slate-900">{total}</p>
        <p className="text-xs text-slate-400">Total</p>
      </div>
    </div>
  );
}
