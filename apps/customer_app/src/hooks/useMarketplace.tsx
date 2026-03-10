import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createOrder, listCustomerOrders, type ApiOrder } from '@/api/checkout';
import {
  DEFAULT_FAVORITE_RESTAURANTS,
  DEFAULT_RECENT_SEARCHES,
  ORDER_HISTORY,
  PAYMENT_METHODS,
  SAVED_ADDRESSES,
  getRestaurantById,
  getRestaurantByMerchantEmail,
  type DriverProfile,
  type OrderHistoryEntry,
  type TrackingStageKey,
} from '@/data/mock';
import type { CartLine } from './useCart';

type MarketplaceContextValue = {
  hasSeenOnboarding: boolean;
  completeOnboarding: () => void;
  isPrimeMember: boolean;
  favoriteRestaurantIds: string[];
  toggleFavoriteRestaurant: (restaurantId: string) => void;
  recentSearches: string[];
  rememberSearch: (value: string) => void;
  activeAddressId: string;
  setActiveAddressId: (addressId: string) => void;
  activePaymentMethodId: string;
  setActivePaymentMethodId: (paymentMethodId: string) => void;
  orderHistory: OrderHistoryEntry[];
  activeTrackingOrder: OrderHistoryEntry | null;
  refreshOrders: () => Promise<void>;
  placeOrder: (input: {
    restaurantId: string;
    items: CartLine[];
    subtotalSos: number;
    totalSos: number;
    addressLabel: string;
    paymentMethod: string;
  }) => Promise<OrderHistoryEntry>;
};

const STORAGE_KEY = 'xiddig-marketplace';
const CUSTOMER_EMAIL = 'customer@demo.so';

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);

function buildDemoDriver(): DriverProfile {
  return {
    name: 'Faysal',
    rating: 4.9,
    vehicle: 'White Toyota Vitz',
    plate: 'SO 6134',
  };
}

function mapBackendStatus(status: string): TrackingStageKey {
  if (status === 'PLACED' || status === 'MERCHANT_ACCEPTED' || status === 'DISPATCHING') return 'preparing';
  if (status === 'COURIER_ASSIGNED' || status === 'PICKED_UP') return 'picked_up';
  if (status === 'DELIVERED') return 'on_the_way';
  if (status === 'COMPLETED') return 'delivered';
  return 'received';
}

function mapApiOrder(order: ApiOrder): OrderHistoryEntry {
  const restaurant = getRestaurantByMerchantEmail(order.merchant_email ?? undefined);
  return {
    id: String(order.id),
    restaurantId: restaurant?.id ?? `merchant-${order.merchant_id}`,
    restaurantName: order.merchant_name ?? restaurant?.name ?? 'Dash Partner',
    restaurantImage: restaurant?.coverImage ?? '',
    itemsPreview: [order.payment_method === 'COD' ? 'Cash on delivery' : 'Paid by mobile wallet'],
    totalSos: order.total_sos,
    placedAt: order.created_at ?? new Date().toISOString(),
    etaLabel: order.status === 'COMPLETED' ? 'Delivered' : 'Live order',
    addressLabel: order.dropoff_address_text,
    status: mapBackendStatus(order.status),
    driver: order.courier_name
      ? {
          name: order.courier_name,
          rating: 4.9,
          vehicle: 'Assigned courier',
          plate: 'SO LIVE',
        }
      : undefined,
  };
}

export function MarketplaceProvider({ children }: { children: ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [favoriteRestaurantIds, setFavoriteRestaurantIds] = useState<string[]>(DEFAULT_FAVORITE_RESTAURANTS);
  const [recentSearches, setRecentSearches] = useState<string[]>(DEFAULT_RECENT_SEARCHES);
  const [activeAddressId, setActiveAddressId] = useState(SAVED_ADDRESSES.find((address) => address.active)?.id ?? SAVED_ADDRESSES[0].id);
  const [activePaymentMethodId, setActivePaymentMethodId] = useState(
    PAYMENT_METHODS.find((method) => method.preferred)?.id ?? PAYMENT_METHODS[0].id,
  );
  const [orderHistory, setOrderHistory] = useState<OrderHistoryEntry[]>(ORDER_HISTORY);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<OrderHistoryEntry | null>(ORDER_HISTORY[0]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Partial<{
        hasSeenOnboarding: boolean;
        favoriteRestaurantIds: string[];
        recentSearches: string[];
        activeAddressId: string;
        activePaymentMethodId: string;
      }>;

      if (typeof parsed.hasSeenOnboarding === 'boolean') setHasSeenOnboarding(parsed.hasSeenOnboarding);
      if (parsed.favoriteRestaurantIds?.length) setFavoriteRestaurantIds(parsed.favoriteRestaurantIds);
      if (parsed.recentSearches?.length) setRecentSearches(parsed.recentSearches);
      if (parsed.activeAddressId) setActiveAddressId(parsed.activeAddressId);
      if (parsed.activePaymentMethodId) setActivePaymentMethodId(parsed.activePaymentMethodId);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        hasSeenOnboarding,
        favoriteRestaurantIds,
        recentSearches,
        activeAddressId,
        activePaymentMethodId,
      }),
    );
  }, [activeAddressId, activePaymentMethodId, favoriteRestaurantIds, hasSeenOnboarding, recentSearches]);

  useEffect(() => {
    void listCustomerOrders(CUSTOMER_EMAIL)
      .then((orders) => {
        if (!orders.length) return;
        const mapped = orders.map(mapApiOrder);
        setOrderHistory(mapped);
        setActiveTrackingOrder(mapped[0] ?? null);
      })
      .catch(() => {
        // Keep local fallback data when the API is unavailable.
      });
  }, []);

  const value = useMemo<MarketplaceContextValue>(() => {
    const completeOnboarding = () => setHasSeenOnboarding(true);

    const toggleFavoriteRestaurant = (restaurantId: string) => {
      setFavoriteRestaurantIds((previous) =>
        previous.includes(restaurantId)
          ? previous.filter((id) => id !== restaurantId)
          : [...previous, restaurantId],
      );
    };

    const rememberSearch = (value: string) => {
      const normalized = value.trim();
      if (!normalized) return;

      setRecentSearches((previous) => [normalized, ...previous.filter((entry) => entry !== normalized)].slice(0, 5));
    };

    const refreshOrders = async () => {
      const orders = await listCustomerOrders(CUSTOMER_EMAIL);
      const mapped = orders.map(mapApiOrder);
      setOrderHistory(mapped);
      setActiveTrackingOrder(mapped[0] ?? null);
    };

    const placeOrder = async (input: {
      restaurantId: string;
      items: CartLine[];
      subtotalSos: number;
      totalSos: number;
      addressLabel: string;
      paymentMethod: string;
    }) => {
      const restaurant = getRestaurantById(input.restaurantId);
      if (!restaurant) {
        throw new Error('Restaurant not found for the current cart.');
      }

      const apiOrder = await createOrder({
        customer_email: CUSTOMER_EMAIL,
        merchant_email: restaurant.merchantEmail,
        dropoff_address_text: input.addressLabel,
        subtotal_sos: input.subtotalSos,
        distance_km: 2,
        zone: 'mogadishu',
        payment_method: input.paymentMethod,
      });

      const order: OrderHistoryEntry = {
        ...mapApiOrder(apiOrder),
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        restaurantImage: restaurant.coverImage,
        itemsPreview: input.items.map((line) => `${line.quantity}x ${line.menuItem.name}`),
        totalSos: input.totalSos,
        addressLabel: input.addressLabel,
        driver: buildDemoDriver(),
      };

      setOrderHistory((previous) => [order, ...previous]);
      setActiveTrackingOrder(order);
      return order;
    };

    return {
      hasSeenOnboarding,
      completeOnboarding,
      isPrimeMember: true,
      favoriteRestaurantIds,
      toggleFavoriteRestaurant,
      recentSearches,
      rememberSearch,
      activeAddressId,
      setActiveAddressId,
      activePaymentMethodId,
      setActivePaymentMethodId,
      orderHistory,
      activeTrackingOrder,
      refreshOrders,
      placeOrder,
    };
  }, [activeAddressId, activePaymentMethodId, favoriteRestaurantIds, hasSeenOnboarding, orderHistory, recentSearches, activeTrackingOrder]);

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) throw new Error('useMarketplace must be used inside MarketplaceProvider');
  return context;
}
