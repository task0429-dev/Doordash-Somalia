export type SupportedLocale = 'so-SO' | 'ar-SO' | 'en-US';

export type LocaleState = {
  locale: SupportedLocale;
  currency: 'SOS';
  rtl: boolean;
};

export const SOMALIA_LOCALES: LocaleState[] = [
  { locale: 'so-SO', currency: 'SOS', rtl: false },
  { locale: 'ar-SO', currency: 'SOS', rtl: true },
  { locale: 'en-US', currency: 'SOS', rtl: false },
];

export function formatSos(amount: number, locale: SupportedLocale): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'SOS',
    maximumFractionDigits: 0,
  }).format(amount);
}
