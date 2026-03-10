import { MOCK_STATS } from '@/data/mock';

export function MerchantSettings() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Store settings</h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>Manage your store configuration</p>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Store status</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0 }}>Accepting orders</p>
            <p className="caption" style={{ margin: 4 }}>When closed, customers won't see your store</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{MOCK_STATS.storeOpen ? '🟢 Open' : '🔴 Closed'}</span>
            <button className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
              {MOCK_STATS.storeOpen ? 'Close' : 'Open'}
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Business info</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Store name</label>
            <input
              defaultValue="Xawaash House"
              style={{
                width: '100%',
                padding: 10,
                marginTop: 4,
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Address</label>
            <input
              defaultValue="KM4, Mogadishu"
              style={{
                width: '100%',
                padding: 10,
                marginTop: 4,
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
