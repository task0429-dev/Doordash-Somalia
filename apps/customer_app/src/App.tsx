import { Layout } from '@/components/Layout';
import { CartProvider } from '@/hooks/useCart';
import { LanguageProvider } from '@/hooks/useLanguage';
import { MarketplaceProvider, useMarketplace } from '@/hooks/useMarketplace';
import { useHashRouter } from '@/lib/router';
import { AddressesPage } from '@/pages/AddressesPage';
import { CartPage } from '@/pages/CartPage';
import { CategoryPage } from '@/pages/CategoryPage';
import { CheckoutPage } from '@/pages/CheckoutPage';
import { HomePage } from '@/pages/HomePage';
import { OrdersPage } from '@/pages/OrdersPage';
import { PrimePage } from '@/pages/PrimePage';
import { ProfilePage } from '@/pages/ProfilePage';
import { RestaurantPage } from '@/pages/RestaurantPage';
import { SearchPage } from '@/pages/SearchPage';
import { SplashPage } from '@/pages/SplashPage';
import { TrackingPage } from '@/pages/TrackingPage';
import './index.css';

function AppRoutes() {
  const { hasSeenOnboarding, completeOnboarding } = useMarketplace();
  const { path, navigate } = useHashRouter();

  if (!hasSeenOnboarding || path === 'splash') {
    return (
      <SplashPage
        onContinue={() => {
          completeOnboarding();
          navigate('/home');
        }}
      />
    );
  }

  return (
    <Layout>
      {(path === 'home' || path === '/') && <HomePage />}
      {path === 'search' && <SearchPage />}
      {path === 'category' && <CategoryPage />}
      {path === 'restaurant' && <RestaurantPage />}
      {path === 'cart' && <CartPage />}
      {path === 'checkout' && <CheckoutPage />}
      {path === 'orders' && <OrdersPage />}
      {path === 'tracking' && <TrackingPage />}
      {path === 'profile' && <ProfilePage />}
      {path === 'addresses' && <AddressesPage />}
      {path === 'prime' && <PrimePage />}
      {!['home', '/', 'search', 'category', 'restaurant', 'cart', 'checkout', 'orders', 'tracking', 'profile', 'addresses', 'prime'].includes(path) && (
        <HomePage />
      )}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MarketplaceProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </MarketplaceProvider>
    </LanguageProvider>
  );
}
