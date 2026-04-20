export interface Tenant {
  id: string;
  name: string;
  slug: string;
  planId: string;
  isActive: boolean;
  createdAt: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
}