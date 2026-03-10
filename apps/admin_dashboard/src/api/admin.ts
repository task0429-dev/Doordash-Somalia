import { requestJson } from './client';

export type AdminOrder = {
  id: number;
  customer_email: string | null;
  customer_name: string | null;
  merchant_email: string | null;
  merchant_name: string | null;
  courier_email: string | null;
  courier_name: string | null;
  status: string;
  payment_method: string;
  payment_status: string;
  dropoff_address_text: string;
  total_sos: number;
  created_at: string | null;
};

export type AdminUser = {
  id: number;
  role: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  order_count: number;
  created_at: string | null;
};

export type PricingRule = {
  id: number;
  zone: string;
  base_fee_sos: number;
  per_km_sos: number;
  surge_multiplier: number;
  cod_fee_sos: number;
  active: boolean;
};

export type AdminOverview = {
  metrics: {
    total_orders: number;
    total_merchants: number;
    active_users: number;
    subscriptions_count: number;
    revenue_today: number;
  };
  recent_orders: AdminOrder[];
};

export function getAdminOverview() {
  return requestJson<AdminOverview>('/api/admin/overview');
}

export function listAdminOrders() {
  return requestJson<AdminOrder[]>('/api/admin/orders');
}

export function listAdminMerchants() {
  return requestJson<AdminUser[]>('/api/admin/merchants');
}

export function listAdminUsers() {
  return requestJson<AdminUser[]>('/api/admin/users');
}

export function listPricingRules() {
  return requestJson<PricingRule[]>('/api/admin/pricing-rules');
}

export function updatePricingRule(ruleId: number, payload: Partial<PricingRule>) {
  return requestJson<PricingRule>(`/api/admin/pricing-rules/${ruleId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
