import { requestJson } from './client';

export type MerchantOrder = {
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
};

export function listMerchantOrders(merchantEmail: string) {
  return requestJson<MerchantOrder[]>(`/merchant/orders?merchant_email=${encodeURIComponent(merchantEmail)}`);
}

export function acceptMerchantOrder(orderId: number, merchantEmail: string) {
  return requestJson<MerchantOrder>(`/merchant/orders/${orderId}/accept?merchant_email=${encodeURIComponent(merchantEmail)}`, {
    method: 'POST',
  });
}
