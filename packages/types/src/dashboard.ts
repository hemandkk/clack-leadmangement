// ─── Tenant dashboard (owner / manager) ───────────────────
export interface TenantDashboardData {
  kpis: TenantKPIs;
  leadsByStatus: ChartDataPoint[];
  leadsBySource: ChartDataPoint[];
  leadsOverTime: TimeSeriesPoint[];
  callsOverTime: TimeSeriesPoint[];
  topStaff: StaffPerformanceSummary[];
  recentLeads: RecentLeadRow[];
  pendingLeaves: number;
  activeStaff: number;
  staffOnLeave: number;
}

export interface TenantKPIs {
  totalLeads: KPIValue;
  newLeadsToday: KPIValue;
  wonLeads: KPIValue;
  conversionRate: KPIValue;
  totalCalls: KPIValue;
  avgCallDuration: KPIValue; // seconds
  totalRevenue: KPIValue;
  pendingLeaves: KPIValue;
}

export interface KPIValue {
  value: number;
  change: number; // % change vs previous period
  changeDir: "up" | "down" | "neutral";
}

// ─── Staff dashboard (sales_staff) ────────────────────────
export interface StaffDashboardData {
  kpis: StaffKPIs;
  myLeadsByStatus: ChartDataPoint[];
  callsToday: TimeSeriesPoint[];
  recentActivity: ActivityItem[];
  myTarget: TargetSummary;
  upcomingFollowups: FollowupItem[];
}

export interface StaffKPIs {
  myActiveLeads: KPIValue;
  myCallsToday: KPIValue;
  myWonThisMonth: KPIValue;
  targetProgress: KPIValue; // percent
}

// ─── Super admin dashboard ─────────────────────────────────
export interface SuperAdminDashboardData {
  kpis: SuperAdminKPIs;
  tenantGrowth: TimeSeriesPoint[];
  planDistribution: ChartDataPoint[];
  recentTenants: RecentTenantRow[];
  topTenants: TenantPerformanceRow[];
}

export interface SuperAdminKPIs {
  totalTenants: KPIValue;
  activeTenants: KPIValue;
  newThisMonth: KPIValue;
  totalRevenue: KPIValue;
}

// ─── Shared primitives ─────────────────────────────────────
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  value2?: number; // optional second line
}

export interface StaffPerformanceSummary {
  id: string;
  name: string;
  avatar?: string;
  leads: number;
  calls: number;
  won: number;
  targetPct: number;
  isOnLeave: boolean;
}

export interface RecentLeadRow {
  id: string;
  name: string;
  status: string;
  source: string;
  assignedTo?: string;
  createdAt: string;
}

export interface RecentTenantRow {
  id: string;
  name: string;
  plan: string;
  status: string;
  createdAt: string;
}

export interface TenantPerformanceRow {
  id: string;
  name: string;
  leads: number;
  staff: number;
  revenue: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

export interface TargetSummary {
  leadsTarget: number;
  leadsAchieved: number;
  callsTarget: number;
  callsAchieved: number;
  revenueTarget: number;
  revenueAchieved: number;
}

export interface FollowupItem {
  id: string;
  leadName: string;
  channel: string;
  scheduledAt: string;
}

export type DashboardPeriod = "today" | "week" | "month" | "quarter";
