interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function SettingsCard({ title, description, children, action }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl">
      <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}
