export const MOCK_ORDERS = [
  { id: 'ORD-1', status: 'received', items: ['Bariis Iskukaris x2', 'Shaah x1'], total: 39000, time: '2 min ago' },
  { id: 'ORD-2', status: 'preparing', items: ['Suqaar x1', 'Canjeero x2'], total: 31000, time: '15 min ago' },
  { id: 'ORD-3', status: 'completed', items: ['Hilib Ari x1'], total: 27000, time: '1 hr ago' },
];

export const MOCK_STATS = {
  todayOrders: 12,
  todayRevenue: 156000,
  popularItems: [
    { name: 'Bariis Iskukaris', orders: 28 },
    { name: 'Suqaar', orders: 19 },
    { name: 'Shaah', orders: 34 },
  ],
  storeOpen: true,
};

export const MOCK_MENU = [
  { id: 1, name: 'Bariis Iskukaris', price_sos: 18000, is_active: true },
  { id: 2, name: 'Suqaar', price_sos: 15000, is_active: true },
  { id: 3, name: 'Canjeero Plate', price_sos: 8000, is_active: true },
  { id: 4, name: 'Shaah', price_sos: 3000, is_active: true },
];
