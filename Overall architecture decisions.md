Overall architecture decisions You have two distinct portals (Super Admin +
Tenant) with a mobile app. The smart approach is a monorepo sharing design
system, types, and utilities across both web and mobile. Tech stack:

Web: Next.js 15 (App Router) Mobile: React Native with Expo Shared: Turborepo
monorepo State: Zustand + React Query (TanStack Query) Forms: React Hook Form +
Zod UI: Shadcn/ui + Tailwind CSS Real-time: Pusher or Laravel Echo (WebSockets)
Tables: TanStack Table Charts: Recharts Mobile UI: NativeWind + Expo Router

Monorepo folder structure / ├── apps/ │ ├── web/ # Next.js app (super admin +
tenant portals) │ └── mobile/ # Expo React Native app ├── packages/ │ ├── ui/ #
Shared component library │ ├── types/ # Shared TypeScript types │ ├──
api-client/ # Axios/fetch wrappers for Laravel API │ ├── validators/ # Zod
schemas shared across web + mobile │ └── utils/ # Shared helpers (date, format,
etc.) ├── turbo.json ├── package.json └── pnpm-workspace.yaml

Web app folder structure apps/web/ ├── app/ │ ├── (auth)/ │ │ ├── login/ │ │ │
└── page.tsx │ │ ├── forgot-password/ │ │ │ └── page.tsx │ │ └── layout.tsx │ │
│ ├── (super-admin)/ │ │ ├── layout.tsx # Super admin shell layout │ │ ├──
dashboard/ │ │ │ └── page.tsx │ │ ├── tenants/ │ │ │ ├── page.tsx # Tenants list
│ │ │ ├── [id]/ │ │ │ │ ├── page.tsx # Tenant details │ │ │ │ ├── billing/ │ │ │
│ └── settings/ │ │ │ └── create/ │ │ │ └── page.tsx │ │ ├── pricing/ │ │ │ ├──
page.tsx # Plans list │ │ │ └── [id]/ │ │ │ └── page.tsx │ │ ├── notifications/
│ │ │ └── page.tsx # Global notification settings │ │ └── settings/ │ │ └──
page.tsx │ │ │ ├── (tenant)/ │ │ ├── layout.tsx # Tenant shell layout
(role-aware sidebar) │ │ ├── dashboard/ │ │ │ └── page.tsx │ │ ├── leads/ │ │ │
├── page.tsx # Leads list/kanban │ │ │ ├── [id]/ │ │ │ │ └── page.tsx # Lead
detail │ │ │ ├── assign/ │ │ │ │ └── page.tsx # Manual assignment │ │ │ └──
import/ │ │ │ └── page.tsx │ │ ├── broadcasts/ │ │ │ ├── page.tsx │ │ │ └──
create/ │ │ │ └── page.tsx │ │ ├── staff/ │ │ │ ├── page.tsx # Staff list │ │ │
├── [id]/ │ │ │ │ ├── page.tsx │ │ │ │ ├── calls/ │ │ │ │ ├── targets/ │ │ │ │
└── payments/ │ │ │ └── invite/ │ │ │ └── page.tsx │ │ ├── leaves/ │ │ │ ├──
page.tsx # Manager: leaves overview │ │ │ └── apply/ │ │ │ └── page.tsx # Staff:
apply for leave │ │ ├── calls/ │ │ │ └── page.tsx # Call logs + recordings │ │
├── reports/ │ │ │ ├── page.tsx │ │ │ ├── payments/ │ │ │ └── performance/ │ │
├── integrations/ │ │ │ ├── page.tsx │ │ │ ├── whatsapp/ │ │ │ │ └── page.tsx │
│ │ └── webhooks/ │ │ │ └── page.tsx │ │ ├── settings/ │ │ │ ├── page.tsx │ │ │
├── roles/ │ │ │ └── notifications/ │ │ └── profile/ │ │ └── page.tsx │ │ │ ├──
api/ # Next.js API routes (if needed for BFF/proxying) │ │ └── auth/ │ │ └──
[...nextauth]/ │ │ └── route.ts │ │ │ ├── layout.tsx │ └── page.tsx # Root
redirect │ ├── components/ │ ├── super-admin/ # SA-specific components │ │ ├──
TenantCard.tsx │ │ ├── TenantTable.tsx │ │ ├── PricingPlanForm.tsx │ │ └──
TenantMetricsWidget.tsx │ │ │ ├── tenant/ # Tenant-specific components │ │ ├──
leads/ │ │ │ ├── LeadCard.tsx │ │ │ ├── LeadKanban.tsx │ │ │ ├── LeadTable.tsx │
│ │ ├── LeadFilters.tsx │ │ │ ├── LeadTimeline.tsx │ │ │ └── AssignLeadModal.tsx
│ │ ├── staff/ │ │ │ ├── StaffCard.tsx │ │ │ ├── StaffTargetWidget.tsx │ │ │ └──
StaffPaymentSummary.tsx │ │ ├── calls/ │ │ │ ├── CallLog.tsx │ │ │ ├──
CallRecordingPlayer.tsx │ │ │ └── CallDurationBadge.tsx │ │ ├── leaves/ │ │ │
├── LeaveCalendar.tsx │ │ │ ├── LeaveApplyForm.tsx │ │ │ └──
LeaveStatusBadge.tsx │ │ ├── broadcasts/ │ │ │ ├── BroadcastComposer.tsx │ │ │
└── BroadcastList.tsx │ │ ├── reports/ │ │ │ ├── PaymentReportTable.tsx │ │ │
├── PerformanceChart.tsx │ │ │ └── ReportDatePicker.tsx │ │ └── integrations/ │
│ ├── WhatsAppSetup.tsx │ │ └── WebhookForm.tsx │ │ │ └── shared/ # Shared
layout/UI components │ ├── layout/ │ │ ├── AppShell.tsx │ │ ├── Sidebar.tsx │ │
├── TopBar.tsx │ │ ├── MobileSidebar.tsx │ │ └── NotificationBell.tsx │ ├──
data/ │ │ ├── DataTable.tsx # TanStack Table wrapper │ │ ├── EmptyState.tsx │ │
└── LoadingRows.tsx │ └── feedback/ │ ├── Toast.tsx │ ├── ConfirmDialog.tsx │
└── PageLoader.tsx │ ├── hooks/ │ ├── useAuth.ts │ ├── usePermissions.ts #
Role-based permission check hook │ ├── useLeads.ts │ ├── useStaff.ts │ ├──
useLeaves.ts │ ├── useCalls.ts │ ├── useReports.ts │ └── useRealtime.ts #
WebSocket subscription hook │ ├── lib/ │ ├── auth.ts # NextAuth or custom auth
config │ ├── api.ts # Axios instance with interceptors │ ├── permissions.ts #
RBAC constants and helpers │ ├── pusher.ts # Pusher/Echo client │ └──
queryClient.ts # TanStack Query client config │ ├── store/ │ ├── authStore.ts #
Zustand: user, token, tenant context │ ├── uiStore.ts # Zustand: sidebar open,
modals, toasts │ └── leadStore.ts # Zustand: filters, active lead state │ ├──
types/ │ ├── auth.ts │ ├── lead.ts │ ├── staff.ts │ ├── call.ts │ ├── leave.ts │
├── report.ts │ └── tenant.ts │ ├── middleware.ts # Route protection + tenant
resolution ├── next.config.ts ├── tailwind.config.ts └── package.json

Key packages Core:

next 15, react 19, typescript @tanstack/react-query — server state zustand —
client state axios — API calls react-hook-form + @hookform/resolvers + zod —
forms + validation

UI:

shadcn/ui (built on Radix UI) — base components tailwindcss + tailwind-merge +
clsx @radix-ui/react-\* — dialog, dropdown, tooltip, etc. lucide-react — icons

Data & tables:

@tanstack/react-table — advanced tables with sorting/filtering/pagination
recharts — charts for dashboards and reports date-fns — date manipulation
@dnd-kit/core + @dnd-kit/sortable — drag-and-drop for Kanban lead board

Real-time:

pusher-js or laravel-echo + pusher-js — WebSocket for live lead updates,
notifications

Auth:

next-auth v5 or custom JWT handling with js-cookie

File & media:

react-dropzone — file upload for lead imports wavesurfer.js — call recording
audio player

Utils:

@tanstack/react-virtual — virtualized lists for large lead tables
react-hot-toast or sonner — toast notifications dayjs — lightweight date lib
xlsx — export reports to Excel

Authentication & routing flow The middleware.ts is the backbone. It handles
three concerns in one place: Request → middleware.ts ├── No token? → redirect to
/login ├── Token role = "super*admin"? → allow only /super-admin/* routes ├──
Token role = tenant role? → allow only /tenant/\_ routes └── Inject tenant
subdomain context into headers Tenant resolution can be either subdomain-based
(acme.yourapp.com) or path-based (yourapp.com/t/acme). Subdomain is cleaner for
a SaaS product. The middleware reads the host header, looks up the tenant slug,
and injects x-tenant-id for downstream use.

RBAC (Role-Based Access Control) approach Define a permissions matrix in
lib/permissions.ts: typescriptexport const ROLES = { SUPER_ADMIN: 'super_admin',
OWNER: 'owner', MANAGER: 'manager', SALES_STAFF: 'sales_staff', } as const;

export const PERMISSIONS = { VIEW_ALL_LEADS: [ROLES.OWNER, ROLES.MANAGER],
ASSIGN_LEADS: [ROLES.OWNER, ROLES.MANAGER], VIEW_OWN_LEADS: [ROLES.SALES_STAFF],
MANAGE_STAFF: [ROLES.OWNER, ROLES.MANAGER], VIEW_REPORTS: [ROLES.OWNER,
ROLES.MANAGER], VIEW_OWN_REPORTS: [ROLES.SALES_STAFF], MANAGE_INTEGRATIONS:
[ROLES.OWNER], APPROVE_LEAVES: [ROLES.MANAGER, ROLES.OWNER], APPLY_LEAVE:
[ROLES.SALES_STAFF], }; Use the usePermissions hook in components to
conditionally render UI elements. The sidebar navigation itself is generated
from a role-filtered config array — no hardcoded menus per role.

State management strategy

Server state (leads, staff, reports from API) → TanStack Query with smart cache
keys like ['leads', tenantId, filters] Auth + user session → Zustand authStore
(persisted to localStorage) UI state (sidebar, modals, active filters) → Zustand
uiStore Form state → React Hook Form (local, never in global store) Real-time
updates → WebSocket events invalidate TanStack Query cache automatically

Real-time features Use laravel-echo + pusher-js or soketi (self-hosted).
Subscribe to tenant-scoped channels:

leads.{tenantId} → new lead assigned, lead status changed staff.{staffId} →
personal notification (leave approved, new lead) calls.{tenantId} → active call
updates

The useRealtime.ts hook wraps Echo subscriptions and calls
queryClient.invalidateQueries() on relevant events.

Mobile app structure (apps/mobile) apps/mobile/ ├── app/ # Expo Router
file-based routing │ ├── (auth)/ │ │ ├── login.tsx │ │ └── \_layout.tsx │ ├──
(tabs)/ │ │ ├── \_layout.tsx # Bottom tab navigator │ │ ├── dashboard.tsx │ │
├── leads/ │ │ │ ├── index.tsx │ │ │ └── [id].tsx │ │ ├── calls.tsx │ │ └──
profile.tsx │ ├── leaves/ │ │ ├── index.tsx │ │ └── apply.tsx │ └── \_layout.tsx
│ ├── components/ │ ├── leads/ │ ├── calls/ │ └── shared/ │ ├── hooks/ # Reuse
same hooks from web (shared package) ├── store/ # Same Zustand stores └──
app.json Mobile-specific features to plan: push notifications via
expo-notifications, click-to-call via expo-linking, recording via expo-av,
offline lead caching via @tanstack/react-query with mmkv persister.

Execution phases Phase 1 — Foundation (Week 1-2): Monorepo setup, auth flows,
middleware, shared types, API client, Zustand stores, base layout shells for
both portals. Phase 2 — Super Admin portal (Week 3-4): Tenant CRUD, pricing
plans, tenant dashboard with metrics, notification settings. Phase 3 — Tenant
core (Week 5-7): Leads list/kanban/detail, lead assignment (manual + auto),
staff management, basic dashboard. Phase 4 — Advanced tenant features (Week
8-10): Leave management, call logs + recording player, reports
(daily/monthly/yearly), payment tracking against targets. Phase 5 — Integrations
(Week 11-12): WhatsApp Business API setup UI, webhook configuration, broadcast
composer. Phase 6 — Mobile app (Week 13-16): Expo setup, port core screens, push
notifications, call integration. Phase 7 — Polish (Week 17-18): Real-time
updates, performance (virtualized lists, lazy loading), error boundaries,
skeleton loading states everywhere.
