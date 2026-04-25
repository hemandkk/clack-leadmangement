export type CallDirection = "inbound" | "outbound";
export type CallStatus =
  | "ringing"
  | "answered"
  | "missed"
  | "rejected"
  | "busy"
  | "failed";
export type CallOutcome =
  | "interested"
  | "not_interested"
  | "callback"
  | "converted"
  | "wrong_number"
  | "no_answer";

export interface CallRecord {
  id: string;
  tenantId: string;
  staffId: string;
  staffName: string;
  leadId?: string;
  leadName?: string;
  leadPhone?: string;
  direction: CallDirection;
  status: CallStatus;
  duration: number; // seconds
  startedAt: string;
  endedAt?: string;
  recordingUrl?: string;
  recordingSize?: number; // bytes
  outcome?: CallOutcome;
  notes?: string;
  // IVR / telephony provider fields
  providerCallId?: string;
  providerName?: string; // "bonvoice", "twilio", etc.
  cost?: number;
  createdAt: string;
}

export interface CallFilters {
  staffId?: string;
  leadId?: string;
  direction?: CallDirection;
  status?: CallStatus;
  dateFrom?: string;
  dateTo?: string;
  hasRecording?: boolean;
  page?: number;
  perPage?: number;
}

export interface CallStats {
  total: number;
  answered: number;
  missed: number;
  totalDuration: number; // seconds
  avgDuration: number;
  byStaff: {
    staffId: string;
    staffName: string;
    count: number;
    duration: number;
  }[];
  byHour: { hour: number; count: number }[];
  byDay: { date: string; count: number }[];
}

// ─── IVR ───────────────────────────────────────────────────
export type IVRNodeType =
  | "start"
  | "greeting"
  | "menu"
  | "transfer"
  | "voicemail"
  | "schedule"
  | "callback"
  | "hangup";

export interface IVRNode {
  id: string;
  type: IVRNodeType;
  label: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface IVREdge {
  id: string;
  source: string;
  target: string;
  label?: string; // e.g. "Press 1"
}

export interface IVRFlow {
  id: string;
  tenantId: string;
  name: string;
  isActive: boolean;
  nodes: IVRNode[];
  edges: IVREdge[];
  createdAt: string;
  updatedAt: string;
}

// ─── Virtual numbers ───────────────────────────────────────
export interface VirtualNumber {
  id: string;
  tenantId: string;
  number: string;
  displayName: string;
  provider: string;
  ivrFlowId?: string;
  isActive: boolean;
  monthlyFee: number;
  createdAt: string;
}
