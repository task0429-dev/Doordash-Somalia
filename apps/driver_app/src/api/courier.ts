import { requestJson } from './client';

export type Order = {
  id: number;
  customer_id: number;
  merchant_id: number;
  courier_id: number | null;
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
};

export type OrderEvent = {
  id: number;
  from_status: string;
  to_status: string;
  actor_type: string;
  actor_id: number;
  created_at: string;
};

export function listAvailableDispatches(courierEmail: string) {
  return requestJson<Order[]>(`/api/courier/dispatch/available?courier_email=${encodeURIComponent(courierEmail)}`);
}

export function acceptDispatch(orderId: number, courierEmail: string) {
  return requestJson<Order>(`/api/courier/orders/${orderId}/accept?courier_email=${encodeURIComponent(courierEmail)}`, {
    method: 'POST',
  });
}

export function pickupOrder(orderId: number, courierEmail: string) {
  return requestJson<Order>(`/api/courier/orders/${orderId}/pickup?courier_email=${encodeURIComponent(courierEmail)}`, {
    method: 'POST',
  });
}

export function deliverOrder(orderId: number, courierEmail: string) {
  return requestJson<Order>(`/api/courier/orders/${orderId}/deliver?courier_email=${encodeURIComponent(courierEmail)}`, {
    method: 'POST',
  });
}

export function collectCod(orderId: number, courierEmail: string) {
  return requestJson<Order>(`/api/courier/orders/${orderId}/cod-collected?courier_email=${encodeURIComponent(courierEmail)}`, {
    method: 'POST',
  });
}

export function getOrderEvents(orderId: number) {
  return requestJson<OrderEvent[]>(`/api/orders/${orderId}/events`);
}
