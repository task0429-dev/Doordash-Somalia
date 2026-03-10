import { useEffect, useState } from 'react';
import { listAdminUsers, type AdminUser } from '@/api/admin';

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [message, setMessage] = useState('Loading users...');

  useEffect(() => {
    void listAdminUsers()
      .then((data) => {
        setUsers(data);
        setMessage('');
      })
      .catch((error) => {
        setMessage((error as Error).message);
      });
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>User management</h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: 24 }}>Platform user accounts</p>
      {message ? <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{message}</p> : null}

      <div className="card" style={{ overflow: 'hidden' }}>
        {users.map((user, index) => (
          <div
            key={user.id}
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr) auto',
              gap: 16,
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: index < users.length - 1 ? '1px solid var(--border)' : 'none',
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{user.full_name ?? user.email}</p>
              <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)' }}>{user.email}</p>
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              <div>{user.role}</div>
              <div>{user.order_count} linked orders</div>
            </div>
            <span className="pill">{user.phone ?? 'No phone'}</span>
          </div>
        ))}
        {!users.length ? (
          <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)' }}>
            No users found in Supabase yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}
