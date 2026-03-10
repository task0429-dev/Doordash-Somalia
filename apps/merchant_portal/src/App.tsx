import { MerchantLayout } from '@/components/MerchantLayout';
import { useHashRouter } from '@/lib/router';
import { MerchantDashboard } from '@/pages/MerchantDashboard';
import { MerchantOrders } from '@/pages/MerchantOrders';
import { MerchantMenu } from '@/pages/MerchantMenu';
import { MerchantSettings } from '@/pages/MerchantSettings';
import './index.css';

export default function App() {
  const { path } = useHashRouter();

  return (
    <MerchantLayout>
      {path === 'dashboard' || path === '/' || !path ? <MerchantDashboard /> : null}
      {path === 'orders' ? <MerchantOrders /> : null}
      {path === 'menu' ? <MerchantMenu /> : null}
      {path === 'settings' ? <MerchantSettings /> : null}
      {!['dashboard', 'orders', 'menu', 'settings', '/'].includes(path) ? <MerchantDashboard /> : null}
    </MerchantLayout>
  );
}
