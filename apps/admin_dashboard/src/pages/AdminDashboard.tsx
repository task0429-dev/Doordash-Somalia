import { useEffect, useState } from 'react';
import { getAdminOverview, type AdminOverview } from '@/api/admin';

function formatSos(n: number) {
  return new Intl.NumberFormat('so-SO', { style: 'currency', currency: 'SOS', maximumFractionDigits: 0 }).format(n);
}

export function AdminDashboard() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [message, setMessage] = useState('Loading platform overview...');

  useEffect(() => {
    void getAdminOverview()
      .then((data) => {
        setOverview(data);
        setMessage('');
      })
      .catch((error) => {
        setMessage((error as Error).message);
      });
  }, []);

  const metrics = overview?.metrics;
  const recentOrders = overview?.recent_orders ?? [];

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Platform overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Total orders</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{metrics?.total_orders.toLocaleString() ?? '...'}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Merchants</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{metrics?.total_merchants ?? '...'}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Active users</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{metrics?.active_users.toLocaleString() ?? '...'}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Prime subscribers</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--accent)' }}>{metrics?.subscriptions_count ?? '...'}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Revenue (today)</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--accent)' }}>
            {metrics ? formatSos(metrics.revenue_today) : '...'}
          </p>
        </div>
      </div>

      {message ? <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>{message}</p> : null}

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>Recent orders</h2>
        <div className="card" style={{ overflow: 'hidden' }}>
          {recentOrders.map((order, i) => (
            <div
              key={`order-${order.id}`}
              style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '14px 20px',
              borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
              <div>
                <p style={{ fontWeight: 600, margin: 0 }}>Order #{order.id}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 4 }}>
                  {order.merchant_name ?? order.merchant_email ?? 'Unknown merchant'}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 600, margin: 0 }}>{formatSos(order.total_sos)}</p>
                <span className="pill">{order.status}</span>
              </div>
            </div>
          ))}
          {!recentOrders.length ? <div style={{ padding: 20, color: 'var(--text-secondary)' }}>No orders yet.</div> : null}
        </div>
      </section>
    </div>
  );
}
