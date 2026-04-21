interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  height?: number;
}

export function ChartCard({
  title,
  description,
  action,
  children,
  isLoading,
  height = 260,
}: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          {description && (
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {isLoading ? (
        <div
          className="bg-slate-100 rounded-lg animate-pulse"
          style={{ height }}
        />
      ) : (
        children
      )}
    </div>
  );
}
