import { cn } from "@leadpro/utils";
import { getTargetPercent } from "@/lib/staffConfig";

interface Props {
  label: string;
  achieved: number;
  target: number;
  unit?: string;
}

export function TargetProgressBar({
  label,
  achieved,
  target,
  unit = "",
}: Props) {
  const pct = getTargetPercent(achieved, target);
  const color =
    pct >= 100
      ? "bg-green-500"
      : pct >= 60
        ? "bg-blue-500"
        : pct >= 30
          ? "bg-yellow-400"
          : "bg-red-400";

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-medium text-slate-700">
          {achieved}
          {unit} / {target}
          {unit}
          <span
            className={cn(
              "ml-1.5 text-[10px] font-semibold",
              pct >= 100
                ? "text-green-600"
                : pct >= 60
                  ? "text-blue-600"
                  : "text-slate-400",
            )}
          >
            ({pct}%)
          </span>
        </span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
