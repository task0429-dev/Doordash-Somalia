import { useEffect, useState } from 'react';
import { listPricingRules, updatePricingRule, type PricingRule } from '@/api/admin';

function formatSos(n: number) {
  return new Intl.NumberFormat('so-SO', { style: 'currency', currency: 'SOS', maximumFractionDigits: 0 }).format(n);
}

export function AdminPricing() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [message, setMessage] = useState('Loading pricing rules...');

  useEffect(() => {
    void listPricingRules()
      .then((data) => {
        setRules(data);
        setMessage('');
      })
      .catch((error) => {
        setMessage((error as Error).message);
      });
  }, []);

  const updateField = (ruleId: number, field: keyof PricingRule, value: string | boolean) => {
    setRules((previous) =>
      previous.map((rule) =>
        rule.id === ruleId
          ? {
              ...rule,
              [field]:
                typeof value === 'boolean'
                  ? value
                  : field === 'surge_multiplier'
                    ? Number(value)
                    : Number(value),
            }
          : rule,
      ),
    );
  };

  const saveRule = async (rule: PricingRule) => {
    setMessage(`Saving ${rule.zone} pricing...`);
    try {
      await updatePricingRule(rule.id, {
        base_fee_sos: rule.base_fee_sos,
        per_km_sos: rule.per_km_sos,
        surge_multiplier: rule.surge_multiplier,
        cod_fee_sos: rule.cod_fee_sos,
        active: rule.active,
      });
      setMessage(`${rule.zone} pricing saved.`);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Pricing logic</h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>Delivery fees, COD, subscription rules</p>
      {message ? <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{message}</p> : null}

      <div style={{ display: 'grid', gap: 16 }}>
        {rules.map((rule) => (
          <div key={rule.id} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{rule.zone}</h3>
                <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>
                  Current minimum delivery path: {formatSos(rule.base_fee_sos)} + {formatSos(rule.per_km_sos)}/km
                </p>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={rule.active} onChange={(event) => updateField(rule.id, 'active', event.target.checked)} />
                Active
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
              <Field
                label="Base fee"
                value={String(rule.base_fee_sos)}
                suffix="SOS"
                onChange={(value) => updateField(rule.id, 'base_fee_sos', value)}
              />
              <Field
                label="Per km"
                value={String(rule.per_km_sos)}
                suffix="SOS"
                onChange={(value) => updateField(rule.id, 'per_km_sos', value)}
              />
              <Field
                label="COD fee"
                value={String(rule.cod_fee_sos)}
                suffix="SOS"
                onChange={(value) => updateField(rule.id, 'cod_fee_sos', value)}
              />
              <Field
                label="Surge"
                value={String(rule.surge_multiplier)}
                onChange={(value) => updateField(rule.id, 'surge_multiplier', value)}
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <button className="btn btn-primary" onClick={() => void saveRule(rule)}>
                Save pricing
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>Subscription rules</h3>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>
          Prime members receive free delivery on all orders. COD fee still applies.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  suffix,
  onChange,
}: {
  label: string;
  value: string;
  suffix?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        {suffix ? <span style={{ color: 'var(--text-secondary)' }}>{suffix}</span> : null}
      </div>
    </label>
  );
}
