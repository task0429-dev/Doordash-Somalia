import { useEffect, useState } from 'react';
import {
  createMerchantMenuItem,
  deleteMerchantMenuItem,
  listMerchantMenu,
  updateMerchantMenuItem,
} from '@/api/menuOwnership';

function formatSos(n: number) {
  return new Intl.NumberFormat('so-SO', { style: 'currency', currency: 'SOS', maximumFractionDigits: 0 }).format(n);
}

type MenuItem = { id: number; name: string; price_sos: number; is_active: boolean };
const merchantEmail = 'merchant@demo.so';

export function MerchantMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  async function refresh() {
    try {
      const data = await listMerchantMenu(merchantEmail);
      setItems(data);
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

  const addItem = async () => {
    if (!newName.trim() || !newPrice) return;
    try {
      await createMerchantMenuItem(merchantEmail, {
        name: newName.trim(),
        price_sos: Number(newPrice),
        is_active: true,
      });
      setNewName('');
      setNewPrice('');
      setShowAdd(false);
      await refresh();
      setMessage('Menu item created.');
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const toggleActive = async (item: MenuItem) => {
    try {
      await updateMerchantMenuItem(item.id, merchantEmail, { is_active: !item.is_active });
      await refresh();
      setMessage(`Menu item ${item.is_active ? 'hidden' : 'activated'}.`);
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const removeItem = async (item: MenuItem) => {
    try {
      await deleteMerchantMenuItem(item.id, merchantEmail);
      await refresh();
      setMessage('Menu item deleted.');
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Menu</h1>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>Manage your menu items</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          + Add item
        </button>
      </div>

      {showAdd && (
        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12 }}>New menu item</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Item name"
              style={{
                flex: 1,
                minWidth: 180,
                padding: 10,
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
              }}
            />
            <input
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              placeholder="Price (SOS)"
              type="number"
              style={{
                width: 120,
                padding: 10,
                background: 'var(--bg-base)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
              }}
            />
            <button className="btn btn-primary" onClick={addItem} disabled={!newName.trim() || !newPrice}>
              Add
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>Loading live menu...</div>
        ) : null}
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
              opacity: item.is_active ? 1 : 0.6,
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{item.name}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--accent)', margin: 4 }}>{formatSos(item.price_sos)}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={`pill ${item.is_active ? 'pill-green' : 'pill-red'}`}>
                {item.is_active ? 'Active' : 'Hidden'}
              </span>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
                onClick={() => toggleActive(item)}
              >
                {item.is_active ? 'Disable' : 'Enable'}
              </button>
              <button
                className="btn btn-ghost"
                style={{ fontSize: '0.8125rem', padding: '6px 12px' }}
                onClick={() => void removeItem(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {!!message ? <p style={{ color: 'var(--text-secondary)', marginTop: 16 }}>{message}</p> : null}
    </div>
  );
}
