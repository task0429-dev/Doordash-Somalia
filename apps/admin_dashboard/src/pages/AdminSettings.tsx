import { SomaliaSettingsPanel } from '@/components/SomaliaSettingsPanel';

export function AdminSettings() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Platform settings</h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>Locale, subscription, zones</p>

      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <SomaliaSettingsPanel />
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>Zones</h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
          Mogadishu pricing is now live from Supabase in the Pricing tab. Expand new districts and future cities from there as the platform grows.
        </p>
      </div>
    </div>
  );
}
