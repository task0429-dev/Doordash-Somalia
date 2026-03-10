import { requestJson } from './client';

export type LiveMerchantMenuItem = {
  id: number;
  merchant_id: number;
  name: string;
  price_sos: number;
  is_active: boolean;
};

export async function listMerchantMenu(merchantEmail: string) {
  return requestJson<LiveMerchantMenuItem[]>({
    path: `/api/merchant/menu?merchant_email=${encodeURIComponent(merchantEmail)}`,
  });
}
