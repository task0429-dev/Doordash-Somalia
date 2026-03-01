/**
 * pricing/calculateOrderTotal.js
 * Calculate final order total with detailed fee breakdown
 * Handles fixed fees, COD, and subscription overrides
 */

const config = require('./config');

/**
 * @param {Object} params
 * @param {number} params.subtotal - Order subtotal in SOS
 * @param {boolean} params.isCod - Whether payment method is COD
 * @param {boolean} params.isSubscriber - Whether user has active subscription
 * @param {number} [params.distance] - Optional: distance in km (for future logic)
 * @param {number} [params.surgeMultiplier] - Optional: surge multiplier (for future logic)
 * @returns {Object} - Total, fees, breakdown, margin
 */
function calculateOrderTotal({
  subtotal,
  isCod = false,
  isSubscriber = false,
  distance,
  surgeMultiplier = 1.0
}) {
  // Validate input
  if (typeof subtotal !== 'number' || subtotal <= 0) {
    throw new Error('Invalid subtotal');
  }

  // Base delivery fee
  let deliveryFee = config.deliveryFee;

  // Override if subscriber
  if (isSubscriber) {
    deliveryFee = 0;
  }

  // Apply COD fee if applicable
  const codFee = isCod ? config.codFee : 0;

  // Future-ready: distance/surge logic (MVP off)
  // if (config.enableDistancePricing && distance) { ... }
  // if (config.enableSurgePricing && surgeMultiplier > 1) { ... }

  // Calculate total
  const total = subtotal + deliveryFee + codFee;

  // Fee breakdown for response
  const feeBreakdown = {
    subtotal,
    deliveryFee,
    codFee,
    total
  };

  // Contribution margin: deliveryFee + (subtotal * platform margin) - riderCost
  // Simplified: assume platform keeps no cut of subtotal (driver bears cost)
  // Margin = fees collected - rider cost
  const contributionMargin = deliveryFee + codFee - config.riderCostPerDelivery;

  return {
    total,
    feeBreakdown,
    contributionMargin,
    currency: config.currency
  };
}

module.exports = { calculateOrderTotal };