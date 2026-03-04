import { requestJson } from './client';

export type MenuItem = {
  id: number;
  merchant_id: number;
  name: string;
  price_sos: number;
  is_active: boolean;
};

export async function listMerchantMenu(merchantEmail: string): Promise<MenuItem[]> {
  return requestJson(`/merchant/menu?merchant_email=${encodeURIComponent(merchantEmail)}`);
}

export async function createMerchantMenuItem(
  merchantEmail: string,
  payload: Omit<MenuItem, 'id' | 'merchant_id'>,
): Promise<MenuItem> {
  return requestJson(`/merchant/menu?merchant_email=${encodeURIComponent(merchantEmail)}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateMerchantMenuItem(
  itemId: number,
  merchantEmail: string,
  payload: Partial<Omit<MenuItem, 'id' | 'merchant_id'>>,
): Promise<MenuItem> {
  return requestJson(`/merchant/menu/${itemId}?merchant_email=${encodeURIComponent(merchantEmail)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteMerchantMenuItem(itemId: number, merchantEmail: string): Promise<{ success: boolean }> {
  return requestJson(`/merchant/menu/${itemId}?merchant_email=${encodeURIComponent(merchantEmail)}`, {
    method: 'DELETE',
  });
}
