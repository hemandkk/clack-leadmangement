"use client";

import {
  AreaChart as ReAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { tooltipStyle, axisStyle } from "@/lib/chartConfig";
import type { TimeSeriesPoint } from "@leadpro/types";

interface Series {
  key: string;
  label: string;
  color: string;
  filled?: boolean;
}

interface Props {
  data: TimeSeriesPoint[];
  series: Series[];
  height?: number;
  showLegend?: boolean;
}

export function AreaChart({ data, series, height = 220, showLegend }: Props) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReAreaChart
        data={data}
        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient
              key={s.key}
              id={`grad-${s.key}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={s.color} stopOpacity={0.15} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={axisStyle.tick}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v.slice(5)} // show MM-DD
        />
        <YAxis tick={axisStyle.tick} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        {showLegend && <Legend iconType="circle" iconSize={8} />}
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key === series[0].key ? "value" : "value2"}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
