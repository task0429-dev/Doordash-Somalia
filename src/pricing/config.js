/**
 * pricing/config.js
 * Somalia MVP - DoorDash for Somalia
 * Fixed fee mode, COD-first, SOS-native
 */

module.exports = {
  // Fixed delivery fee in SOS (≈ $3.00)
  deliveryFee: 5000,

  // Fee applied per COD order (risk buffer ≈ $0.60)
  codFee: 1000,

  // Subscription monthly cost in SOS (≈ $3.00)
  subscriptionMonthlyFee: 4990,

  // Enable distance-based pricing (future-ready, off for MVP)
  enableDistancePricing: false,

  // Enable surge pricing (future-ready, off for MVP)
  enableSurgePricing: false,

  // Currency code
  currency: 'SOS',

  // Max order value for affordability cap (optional)
  maxOrderValue: 100000, // ≈ $60

  // Minimum order value for free delivery eligibility (n/a in MVP, but config-ready)
  minOrderValueForFreeDelivery: null,

  // Rider cost per delivery (used for margin calc)
  riderCostPerDelivery: 4500, // ≈ $2.70

  // Default contribution margin target per order
  targetContributionMargin: 2000 // ≈ $1.20
};