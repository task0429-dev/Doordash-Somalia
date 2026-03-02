// COD Fraud Guards 🛡️
// Memory store for MVP (Redis in prod)
const abuseCache = new Map();
const MAX_ORDERS_HOUR = 5;
const MIN_ORDER_VALUE = 5000;

module.exports = (req, res, next) => {
  const ip = req.ip;
  const { phone, amount } = req.body;

  // High-freq check
  const key = `cod:${ip || phone}`;
  const now = Date.now();
  let orders = abuseCache.get(key) || [];
  orders = orders.filter(t => now - t < 60 * 60 * 1000); // 1h window
  if (orders.length >= MAX_ORDERS_HOUR) {
    return res.status(429).json({ error: 'COD abuse detected: too many orders' });
  }
  if (amount < MIN_ORDER_VALUE) {
    return res.status(400).json({ error: 'COD min value not met' });
  }

  orders.push(now);
  abuseCache.set(key, orders);
  next();
};
