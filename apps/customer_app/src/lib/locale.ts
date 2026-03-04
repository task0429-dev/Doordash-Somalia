export type LocaleConfig = {
  locale: string;
  currency: string;
  rtl: boolean;
};

export const SOMALIA_DEFAULT: LocaleConfig = {
  locale: 'so-SO',
  currency: 'SOS',
  rtl: false,
};

export const formatMoney = (amount: number, config: LocaleConfig): string =>
  new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    maximumFractionDigits: 0,
  }).format(amount);
