// Consistent colors used across all charts
export const CHART_COLORS = {
  blue: "#3b82f6",
  green: "#22c55e",
  purple: "#a855f7",
  orange: "#f97316",
  red: "#ef4444",
  teal: "#14b8a6",
  amber: "#f59e0b",
  pink: "#ec4899",
  slate: "#94a3b8",
  indigo: "#6366f1",
};

// Status-specific colors (matches leadConfig)
export const STATUS_CHART_COLORS: Record<string, string> = {
  new: CHART_COLORS.blue,
  contacted: CHART_COLORS.amber,
  qualified: CHART_COLORS.purple,
  proposal: CHART_COLORS.orange,
  won: CHART_COLORS.green,
  lost: CHART_COLORS.red,
};

// Source-specific colors
export const SOURCE_CHART_COLORS: Record<string, string> = {
  website: CHART_COLORS.blue,
  whatsapp: CHART_COLORS.green,
  phone: CHART_COLORS.purple,
  referral: CHART_COLORS.teal,
  social: CHART_COLORS.pink,
  manual: CHART_COLORS.slate,
};

// Recharts custom tooltip style helper
export const tooltipStyle = {
  contentStyle: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "12px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
  itemStyle: { color: "#475569" },
  labelStyle: { color: "#0f172a", fontWeight: 500 },
};

export const axisStyle = {
  tick: { fill: "#94a3b8", fontSize: 11 },
  line: { stroke: "#f1f5f9" },
};
