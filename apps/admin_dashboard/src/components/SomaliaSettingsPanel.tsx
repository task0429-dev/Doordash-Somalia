import { useMemo, useState } from 'react';
import { SOMALIA_LOCALES, formatSos, type SupportedLocale } from '@/lib/locale';

type PrimePlan = {
  active: boolean;
  freeDeliveryCapSos: number;
};

export function SomaliaSettingsPanel() {
  const [locale, setLocale] = useState<SupportedLocale>('so-SO');
  const [primePlan] = useState<PrimePlan>({ active: true, freeDeliveryCapSos: 15000 });

  const selected = useMemo(() => SOMALIA_LOCALES.find((item) => item.locale === locale)!, [locale]);

  return (
    <section dir={selected.rtl ? 'rtl' : 'ltr'} style={{ border: '1px solid #ddd', padding: 12 }}>
      <h2>Somalia Locale & Subscription Controls</h2>
      <label>
        Locale:{' '}
        <select value={locale} onChange={(event) => setLocale(event.target.value as SupportedLocale)}>
          {SOMALIA_LOCALES.map((option) => (
            <option key={option.locale} value={option.locale}>
              {option.locale} {option.rtl ? '(RTL)' : ''}
            </option>
          ))}
        </select>
      </label>

      <p>
        Currency locked to <strong>{selected.currency}</strong>
      </p>
      <p>
        Prime free-delivery: <strong>{primePlan.active ? 'Enabled' : 'Disabled'}</strong> up to{' '}
        {formatSos(primePlan.freeDeliveryCapSos, selected.locale)}
      </p>
    </section>
  );
}
