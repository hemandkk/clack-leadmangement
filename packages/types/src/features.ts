export const FEATURES = {
  CALL_RECORDING:       'call_recording',
  IVR_CALLING:          'ivr_calling',
  WHATSAPP_BROADCAST:   'whatsapp_broadcast',
  SCHEDULED_FOLLOWUPS:  'scheduled_followups',
  WEBHOOK_INTEGRATION:  'webhook_integration',
  ADVANCED_REPORTS:     'advanced_reports',
  LEAD_AUTO_ASSIGN:     'lead_auto_assign',
  MULTI_STAFF:          'multi_staff',
} as const;

export type Feature = typeof FEATURES[keyof typeof FEATURES];
export type TenantFeatureMap = Record<Feature, boolean>;