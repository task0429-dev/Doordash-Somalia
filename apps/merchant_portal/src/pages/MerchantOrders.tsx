import { useEffect, useState } from 'react';
import { acceptMerchantOrder, listMerchantOrders, type MerchantOrder } from '@/api/orders';

function formatSos(n: number) {
  return new Intl.NumberFormat('so-SO', { style: 'currency', currency: 'SOS', maximumFractionDigits: 0 }).format(n);
}

const merchantEmail = 'merchant@demo.so';
const FILTERS = ['All', 'Placed', 'Dispatching', 'Completed'] as const;

export function MerchantOrders() {
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [loading, setLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  async function refresh() {
    try {
      const data = await listMerchantOrders(merchantEmail);
      setOrders(data);
      setMessage('');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function accept(orderId: number) {
    setBusyOrderId(orderId);
    try {
      await acceptMerchantOrder(orderId, merchantEmail);
      await refresh();
      setMessage(`Order #${orderId} moved into dispatch for couriers.`);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusyOrderId(null);
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'All') return true;
    if (filter === 'Placed') return order.status === 'PLACED';
    if (filter === 'Dispatching') return ['MERCHANT_ACCEPTED', 'DISPATCHING', 'COURIER_ASSIGNED', 'PICKED_UP', 'DELIVERED'].includes(order.status);
    return order.status === 'COMPLETED';
  });

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Orders</h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
        Manage live merchant orders and release accepted ones into courier dispatch
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {FILTERS.map((value) => (
          <button
            key={value}
            className="btn btn-secondary"
            style={{
              fontSize: '0.8125rem',
              padding: '8px 14px',
              border: filter === value ? '1px solid var(--accent)' : '1px solid transparent',
            }}
            onClick={() => setFilter(value)}
          >
            {value}
          </button>
        ))}
        <button className="btn btn-ghost" style={{ fontSize: '0.8125rem', padding: '8px 14px' }} onClick={() => void refresh()}>
          Refresh
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {loading ? <div className="card" style={{ padding: 20, color: 'var(--text-secondary)' }}>Loading live orders...</div> : null}
        {!loading && !filteredOrders.length ? (
          <div className="card" style={{ padding: 20, color: 'var(--text-secondary)' }}>
            No orders in this state yet. Place a customer order to begin the flow.
          </div>
        ) : null}

        {filteredOrders.map((order) => (
          <div key={order.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Order #{order.id}</h3>
              <span className={`pill ${order.status === 'PLACED' ? 'pill-green' : 'pill'}`}>{order.status}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 8px' }}>{order.dropoff_address_text}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Payment {order.payment_method} · {order.payment_status}
              </span>
              <span style={{ fontWeight: 700 }}>{formatSos(order.total_sos)}</span>
            </div>
            {order.status === 'PLACED' ? (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  className="btn btn-primary"
                  style={{ fontSize: '0.8125rem', padding: '8px 16px' }}
                  onClick={() => void accept(order.id)}
                  disabled={busyOrderId === order.id}
                >
                  {busyOrderId === order.id ? 'Accepting...' : 'Accept for dispatch'}
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {!!message ? <p style={{ color: 'var(--text-secondary)', marginTop: 18 }}>{message}</p> : null}
    </div>
  );
}
