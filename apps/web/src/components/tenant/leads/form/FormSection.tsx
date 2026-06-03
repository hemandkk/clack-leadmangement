import { LucideIcon } from "lucide-react";

interface SectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  iconSize?: number;
  iconColor?: string;
}

export function FormSection({
  title,
  description,
  icon: Icon,
  iconSize = 20,
  iconColor = "#F97316",
}: SectionProps) {
  return (
    <section className="space-y-5 py-6">
      <div>
        <div className="flex items-center gap-2">
          {Icon && <Icon size={iconSize} color={iconColor} />}

          <h3 className="font-semibold text-slate-900">{title}</h3>
        </div>

        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </section>
  );
}
