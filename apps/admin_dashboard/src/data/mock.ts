export const MOCK_METRICS = {
  totalOrders: 1247,
  totalMerchants: 48,
  activeUsers: 3200,
  subscriptionsCount: 312,
  revenueToday: 458000,
  revenueWeek: 2100000,
};

export const MOCK_MERCHANTS = [
  { id: '1', name: 'Xawaash House', status: 'active', orders: 156 },
  { id: '2', name: 'Shabelle Grill', status: 'active', orders: 89 },
  { id: '3', name: 'Bakaro Cafe', status: 'active', orders: 203 },
  { id: '4', name: 'Suuqa Weyne Kitchen', status: 'pending', orders: 0 },
];

export const MOCK_RECENT_ORDERS = [
  { id: 'ORD-1247', merchant: 'Bakaro Cafe', total: 25000, status: 'delivered' },
  { id: 'ORD-1246', merchant: 'Xawaash House', total: 45000, status: 'on_the_way' },
  { id: 'ORD-1245', merchant: 'Shabelle Grill', total: 28000, status: 'preparing' },
];
