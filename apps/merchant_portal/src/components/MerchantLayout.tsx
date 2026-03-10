import type { ReactNode } from 'react';
import { useHashRouter } from '@/lib/router';

type Props = { children: ReactNode };

export function MerchantLayout({ children }: Props) {
  const { path, navigate } = useHashRouter();
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'menu', label: 'Menu', icon: '🍽️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)', padding: '12px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>Dash</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>MERCHANT</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="pill pill-green">Xawaash House</span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>merchant@demo.so</span>
          </div>
        </div>
      </header>
      <div style={{ display: 'flex', flex: 1 }}>
        <aside style={{ width: 200, background: 'var(--bg-elevated)', borderRight: '1px solid var(--border)', padding: '20px 0' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(`/${item.id}`)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '12px 20px',
                background: path === item.id ? 'var(--accent-muted)' : 'transparent',
                border: 'none',
                color: path === item.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.9375rem',
                fontWeight: path === item.id ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </aside>
        <main style={{ flex: 1, padding: 24, maxWidth: 900 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
