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
  return requestJson({ path: '/customer/orders', method: 'POST', body: payload });
}
