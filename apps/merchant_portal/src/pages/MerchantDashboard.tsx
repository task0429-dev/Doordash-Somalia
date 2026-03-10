import { MOCK_STATS, MOCK_ORDERS } from '@/data/mock';

function formatSos(n: number) {
  return new Intl.NumberFormat('so-SO', { style: 'currency', currency: 'SOS', maximumFractionDigits: 0 }).format(n);
}

export function MerchantDashboard() {
  const activeOrders = MOCK_ORDERS.filter((o) => o.status !== 'completed');

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24 }}>Dashboard</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Today's orders</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{MOCK_STATS.todayOrders}</p>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 4px' }}>Today's revenue</p>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--accent)' }}>{formatSos(MOCK_STATS.todayRevenue)}</p>
        </div>
        <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.5rem' }}>{MOCK_STATS.storeOpen ? '🟢' : '🔴'}</span>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Store status</p>
            <p style={{ fontWeight: 600, margin: 4 }}>{MOCK_STATS.storeOpen ? 'Open' : 'Closed'}</p>
          </div>
        </div>
      </div>

      {/* Active orders */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>Active orders</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {activeOrders.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
              No active orders
            </div>
          ) : (
            activeOrders.map((order) => (
              <div key={order.id} className="card" style={{ padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, margin: '0 0 4px' }}>{order.id}</p>
                  <p className="caption" style={{ margin: 0 }}>{order.items.join(', ')}</p>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: 4 }}>{order.time}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, margin: '0 0 8px' }}>{formatSos(order.total)}</p>
                  <span className={`pill ${order.status === 'received' ? 'pill-green' : 'pill'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Popular items */}
      <section>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 16 }}>Popular items</h2>
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {MOCK_STATS.popularItems.map((item, i) => (
            <div
              key={item.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 20px',
                borderBottom: i < MOCK_STATS.popularItems.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span>{item.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{item.orders} orders</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
