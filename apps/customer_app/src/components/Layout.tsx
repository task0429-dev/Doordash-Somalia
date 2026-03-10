import type { ReactNode } from 'react';
import { StarMark } from './StarMark';
import { SAVED_ADDRESSES } from '@/data/mock';
import { useHashRouter } from '@/lib/router';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useCart } from '@/hooks/useCart';
import { type LocaleCode, useLanguage } from '@/hooks/useLanguage';

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  const { path, navigate } = useHashRouter();
  const { activeAddressId, isPrimeMember } = useMarketplace();
  const { itemCount } = useCart();
  const { locale, setLocale, languageOptions, t, translateText } = useLanguage();
  const address = SAVED_ADDRESSES.find((entry) => entry.id === activeAddressId) ?? SAVED_ADDRESSES[0];

  const navItems = [
    { id: 'home', label: t('layout.home', 'Home') },
    { id: 'search', label: t('layout.search', 'Search') },
    { id: 'orders', label: t('layout.orders', 'Orders') },
    { id: 'profile', label: t('layout.account', 'Account') },
  ];

  return (
    <div className="app-shell">
      <div className="app-frame">
        <header className="topbar">
          <button className="brand-lockup" onClick={() => navigate('/home')}>
            <span className="brand-mark">
              <StarMark size={20} />
            </span>
            <span className="brand-copy">
              <strong>Dash</strong>
              <small>{t('layout.brandTagline', 'Food & essentials')}</small>
            </span>
          </button>
          <div className="topbar-actions">
            <label className="language-switcher">
              <span>{t('layout.languageLabel', 'Language')}</span>
              <select value={locale} onChange={(event) => setLocale(event.target.value as LocaleCode)}>
                {languageOptions.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button className="location-pill" onClick={() => navigate('/addresses')}>
              <span className="location-label">{t('layout.deliverTo', 'Deliver to')}</span>
              <strong>{translateText(address.label)}</strong>
            </button>
            {isPrimeMember ? (
              <button className="prime-badge" onClick={() => navigate('/prime')}>
                <StarMark size={14} />
                Prime
              </button>
            ) : null}
          </div>
        </header>

        <main className="page-content">{children}</main>

        <nav className="bottom-nav" aria-label="Primary">
          {navItems.map((item) => {
            const active =
              path === item.id ||
              (item.id === 'home' && ['splash', 'category', 'restaurant', 'cart', 'checkout', 'prime'].includes(path));

            return (
              <button
                key={item.id}
                className={active ? 'bottom-nav-item active' : 'bottom-nav-item'}
                onClick={() => navigate(`/${item.id}`)}
              >
                <span>{item.label}</span>
                {item.id === 'orders' && itemCount > 0 ? <small>{itemCount}</small> : null}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
