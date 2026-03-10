import { requestJson } from './client';

export type DropoffInput = {
  label: string;
  addressText: string;
  lat: number;
  lng: number;
  phone: string;
  notes?: string;
};

export type CheckoutPricing = {
  subtotalSos: number;
  deliveryFeeSos: number;
  totalSos: number;
  freeDelivery: boolean;
};

export type CheckoutPayload = {
  customer_email: string;
  merchant_email: string;
  dropoff_address_text: string;
  subtotal_sos: number;
  distance_km: number;
  zone: string;
  payment_method: string;
};

export type ApiOrder = {
  id: number;
  customer_id: number;
  customer_email?: string | null;
  customer_name?: string | null;
  merchant_id: number;
  merchant_email?: string | null;
  merchant_name?: string | null;
  courier_id: number | null;
  courier_email?: string | null;
  courier_name?: string | null;
  status: string;
  payment_method: string;
  payment_status: string;
  dropoff_address_text: string;
  subtotal_sos: number;
  delivery_fee_sos: number;
  surge_fee_sos: number;
  cod_fee_sos: number;
  total_sos: number;
  assigned_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  created_at?: string | null;
};

export function estimateCheckout(input: { subtotalSos: number; hasSubscription: boolean }): CheckoutPricing {
  const baseDelivery = 5000;
  const deliveryFee = input.hasSubscription ? 0 : baseDelivery;
  return {
    subtotalSos: input.subtotalSos,
    deliveryFeeSos: deliveryFee,
    totalSos: input.subtotalSos + deliveryFee,
    freeDelivery: input.hasSubscription,
  };
}

export async function createOrder(payload: CheckoutPayload) {
  return requestJson<ApiOrder>({ path: '/api/customer/orders', method: 'POST', body: payload });
}

export async function listCustomerOrders(customerEmail: string) {
  return requestJson<ApiOrder[]>({
    path: `/api/customer/orders?customer_email=${encodeURIComponent(customerEmail)}`,
  });
}

export type ApiOrderEvent = {
  id: number;
  from_status: string;
  to_status: string;
  actor_type: string;
  actor_id: number;
  created_at: string;
};

export async function listOrderEvents(orderId: string | number) {
  return requestJson<ApiOrderEvent[]>({
    path: `/api/orders/${encodeURIComponent(String(orderId))}/events`,
  });
}
