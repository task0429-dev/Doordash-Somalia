import { AdminLayout } from '@/components/AdminLayout';
import { useHashRouter } from '@/lib/router';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminMerchants } from '@/pages/AdminMerchants';
import { AdminOrders } from '@/pages/AdminOrders';
import { AdminUsers } from '@/pages/AdminUsers';
import { AdminPricing } from '@/pages/AdminPricing';
import { AdminSettings } from '@/pages/AdminSettings';
import './index.css';

export default function App() {
  const { path } = useHashRouter();

  return (
    <AdminLayout>
      {(path === 'dashboard' || path === '/' || !path) && <AdminDashboard />}
      {path === 'merchants' && <AdminMerchants />}
      {path === 'orders' && <AdminOrders />}
      {path === 'users' && <AdminUsers />}
      {path === 'pricing' && <AdminPricing />}
      {path === 'settings' && <AdminSettings />}
      {!['dashboard', 'merchants', 'orders', 'users', 'pricing', 'settings', '/'].includes(path) && <AdminDashboard />}
    </AdminLayout>
  );
}
