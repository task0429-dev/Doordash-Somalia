import { useEffect, useState } from 'react';
import { listAdminMerchants, type AdminUser } from '@/api/admin';

export function AdminMerchants() {
  const [merchants, setMerchants] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState('Loading merchants...');

  useEffect(() => {
    void listAdminMerchants()
      .then((data) => {
        setMerchants(data);
        setMessage('');
      })
      .catch((error) => {
        setMessage((error as Error).message);
      });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Manage merchants</h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>Platform merchant accounts</p>
      {message ? <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{message}</p> : null}

      <div className="card" style={{ overflow: 'hidden' }}>
        {merchants.map((merchant, i) => (
          <div
            key={merchant.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: i < merchants.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{merchant.full_name ?? merchant.email}</p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 4 }}>
                {merchant.order_count} orders · {merchant.email}
              </p>
            </div>
            <span className="pill pill-green">active</span>
          </div>
        ))}
        {!merchants.length ? <div style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>No merchants found.</div> : null}
      </div>
    </div>
  );
}
