import { useEffect, useState } from 'react';
import {
  createMerchantMenuItem,
  deleteMerchantMenuItem,
  listMerchantMenu,
  type MenuItem,
  updateMerchantMenuItem,
} from '@/api/menuOwnership';

const merchantEmail = 'merchant@demo.so';

export function MenuOwnershipManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('12000');
  const [status, setStatus] = useState('');

  async function refresh() {
    try {
      const data = await listMerchantMenu(merchantEmail);
      setItems(data);
      setStatus('');
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function onCreate() {
    try {
      await createMerchantMenuItem(merchantEmail, {
        name,
        price_sos: Number(price),
        is_active: true,
      });
      setName('');
      await refresh();
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  async function onToggle(item: MenuItem) {
    try {
      await updateMerchantMenuItem(item.id, merchantEmail, { is_active: !item.is_active });
      await refresh();
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  async function onDelete(item: MenuItem) {
    try {
      await deleteMerchantMenuItem(item.id, merchantEmail);
      await refresh();
    } catch (error) {
      setStatus((error as Error).message);
    }
  }

  return (
    <section>
      <h2>Merchant Menu Ownership</h2>
      <p>Only scoped by merchant_email to enforce ownership CRUD boundaries.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Menu item" />
        <input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Price SOS" />
        <button onClick={onCreate} disabled={!name.trim()}>
          Create item
        </button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} - SOS {item.price_sos}{' '}
            <em>{item.is_active ? 'Active' : 'Hidden'}</em>{' '}
            <button onClick={() => onToggle(item)}>{item.is_active ? 'Disable' : 'Enable'}</button>{' '}
            <button onClick={() => onDelete(item)}>Delete</button>
          </li>
        ))}
      </ul>
      {!!status && <p>{status}</p>}
    </section>
  );
}
