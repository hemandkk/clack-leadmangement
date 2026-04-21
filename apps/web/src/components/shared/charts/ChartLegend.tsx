import type { ChartDataPoint } from "@leadpro/types";

interface Props {
  data: ChartDataPoint[];
  total?: number;
}

export function ChartLegend({ data, total }: Props) {
  const sum = total ?? data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="space-y-1.5 mt-3">
      {data.map((item) => (
        <div key={item.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ background: item.color }}
            />
            <span className="text-xs text-slate-600">{item.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-800">
              {item.value}
            </span>
            <span className="text-[10px] text-slate-400 w-8 text-right">
              {sum ? ((item.value / sum) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
