import { SOMALIA_DEFAULT } from './locale';

export function formatSos(amount: number): string {
  return new Intl.NumberFormat(SOMALIA_DEFAULT.locale, {
    style: 'currency',
    currency: 'SOS',
    maximumFractionDigits: 0,
  }).format(amount);
}
