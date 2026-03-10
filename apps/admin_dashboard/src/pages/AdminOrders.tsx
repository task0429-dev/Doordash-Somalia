import { useEffect, useState } from 'react';
import { listAdminOrders, type AdminOrder } from '@/api/admin';

function formatSos(n: number) {
  return new Intl.NumberFormat('so-SO', { style: 'currency', currency: 'SOS', maximumFractionDigits: 0 }).format(n);
}

export function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [message, setMessage] = useState('Loading orders...');

  useEffect(() => {
    void listAdminOrders()
      .then((data) => {
        setOrders(data);
        setMessage('');
      })
      .catch((error) => {
        setMessage((error as Error).message);
      });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>All orders</h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>Platform order management</p>
      {message ? <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{message}</p> : null}

      <div className="card" style={{ overflow: 'hidden' }}>
        {orders.map((order, i) => (
          <div
            key={`order-${order.id}`}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: i < orders.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <p style={{ fontWeight: 600, margin: 0 }}>#{order.id}</p>
            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{order.merchant_name ?? order.merchant_email}</p>
            <p style={{ fontWeight: 600, margin: 0 }}>{formatSos(order.total_sos)}</p>
            <span className="pill">{order.status}</span>
          </div>
        ))}
        {!orders.length ? <div style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>No platform orders yet.</div> : null}
      </div>
    </div>
  );
}
