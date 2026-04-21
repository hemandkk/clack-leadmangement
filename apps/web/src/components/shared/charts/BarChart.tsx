"use client";

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { tooltipStyle, axisStyle } from "@/lib/chartConfig";
import type { ChartDataPoint } from "@leadpro/types";

interface Props {
  data: ChartDataPoint[];
  height?: number;
  radius?: number;
  horizontal?: boolean;
}

export function BarChart({
  data,
  height = 220,
  radius = 4,
  horizontal,
}: Props) {
  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ReBarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#f1f5f9"
            horizontal={false}
          />
          <XAxis
            type="number"
            tick={axisStyle.tick}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={axisStyle.tick}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="value" radius={[0, radius, radius, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color ?? "#3b82f6"} />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <ReBarChart
        data={data}
        margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f1f5f9"
          vertical={false}
        />
        <XAxis
          dataKey="name"
          tick={axisStyle.tick}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={axisStyle.tick} axisLine={false} tickLine={false} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="value" radius={[radius, radius, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color ?? "#3b82f6"} />
          ))}
        </Bar>
      </ReBarChart>
    </ResponsiveContainer>
  );
}
