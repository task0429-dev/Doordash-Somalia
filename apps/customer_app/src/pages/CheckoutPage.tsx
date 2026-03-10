import { useMemo, useState } from 'react';
import { PAYMENT_METHODS, SAVED_ADDRESSES, getRestaurantById } from '@/data/mock';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatSos } from '@/lib/format';
import { useHashRouter } from '@/lib/router';

function calculateTotals(subtotalSos: number, deliveryFeeSos: number, tipSos: number) {
  const serviceFeeSos = Math.round(subtotalSos * 0.06);
  const taxesSos = Math.round(subtotalSos * 0.05);
  return {
    serviceFeeSos,
    taxesSos,
    totalSos: subtotalSos + deliveryFeeSos + serviceFeeSos + taxesSos + tipSos,
  };
}

export function CheckoutPage() {
  const { navigate } = useHashRouter();
  const { items, restaurantId, subtotalSos, clearCart } = useCart();
  const { t, translateText } = useLanguage();
  const {
    activeAddressId,
    setActiveAddressId,
    activePaymentMethodId,
    setActivePaymentMethodId,
    isPrimeMember,
    placeOrder,
  } = useMarketplace();
  const [tipSos, setTipSos] = useState(2500);
  const [contactName, setContactName] = useState('Ayaan Hassan');
  const [contactPhone, setContactPhone] = useState('+252 61 345 8899');
  const [walletPhone, setWalletPhone] = useState('+252 61 345 8899');
  const [instructions, setInstructions] = useState('Call at the gate and hand to reception.');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const restaurant = getRestaurantById(restaurantId ?? undefined);
  const address = SAVED_ADDRESSES.find((entry) => entry.id === activeAddressId) ?? SAVED_ADDRESSES[0];
  const paymentMethod = PAYMENT_METHODS.find((entry) => entry.id === activePaymentMethodId) ?? PAYMENT_METHODS[0];

  if (!items.length || !restaurant) {
    navigate('/cart');
    return null;
  }

  const deliveryFeeSos = isPrimeMember && restaurant.primeEligible ? 0 : restaurant.deliveryFeeSos;
  const totals = useMemo(() => calculateTotals(subtotalSos, deliveryFeeSos, tipSos), [deliveryFeeSos, subtotalSos, tipSos]);
  const apiPaymentMethod = paymentMethod.type === 'cash' ? 'COD' : paymentMethod.id.toUpperCase().replace(/-/g, '_');

  return (
    <div className="screen-stack">
      <section className="checkout-map-card">
        <div className="map-preview">
          <div className="map-pin pickup">{t('tracking.store', 'Store')}</div>
          <div className="map-pin dropoff">{t('tracking.you', 'You')}</div>
        </div>
        <div className="checkout-copy">
          <span className="eyebrow">{t('checkout.eyebrow', 'Checkout')}</span>
          <h1>{t('checkout.title', 'Confirm your delivery details.')}</h1>
          <p>{t('checkout.description', 'Everything is staged for a trusted, clean final step.')}</p>
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-title">{t('checkout.deliveryAddress', 'Delivery address')}</h2>
        <div className="selection-list vertical">
          {SAVED_ADDRESSES.map((entry) => (
            <button
              key={entry.id}
              className={entry.id === address.id ? 'choice-chip active wide' : 'choice-chip wide'}
              onClick={() => setActiveAddressId(entry.id)}
            >
              <span>{translateText(entry.label)}</span>
              <small>{translateText(entry.addressLine)}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-title">{t('checkout.paymentMethod', 'Payment method')}</h2>
        <div className="selection-list vertical">
          {PAYMENT_METHODS.map((entry) => (
            <button
              key={entry.id}
              className={entry.id === paymentMethod.id ? 'choice-chip active wide' : 'choice-chip wide'}
              onClick={() => setActivePaymentMethodId(entry.id)}
            >
              <span>{translateText(entry.label)}</span>
              <small>{translateText(entry.subtitle)}</small>
            </button>
          ))}
        </div>
        <div className="payment-helper-card">
          <strong>{paymentMethod.type === 'mobile' ? t('common.mobileWallet', 'Mobile wallet') : t('common.cash', 'Cash')}</strong>
          <p>
            {paymentMethod.type === 'mobile'
              ? t(
                  'checkout.walletHint',
                  "We'll send a payment prompt to your phone. Confirm it there and your order will move.",
                )
              : t(
                  'checkout.cashHint',
                  'Your courier brings the order first, and you pay once it reaches you.',
                )}
          </p>
        </div>
      </section>

      {error ? (
        <section className="payment-helper-card" role="alert">
          <strong>{t('checkout.errorTitle', 'Checkout issue')}</strong>
          <p>{error}</p>
        </section>
      ) : null}

      <section className="section-block">
        <h2 className="section-title">{t('checkout.contactInfo', 'Contact info')}</h2>
        <div className="field-group">
          <label>{t('checkout.name', 'Name')}</label>
          <input className="search-field" value={contactName} onChange={(event) => setContactName(event.target.value)} />
        </div>
        <div className="field-group">
          <label>{t('checkout.phone', 'Phone')}</label>
          <input className="search-field" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} />
        </div>
        {paymentMethod.type === 'mobile' ? (
          <div className="field-group">
            <label>{t('checkout.walletPhone', 'Wallet phone number')}</label>
            <input className="search-field" value={walletPhone} onChange={(event) => setWalletPhone(event.target.value)} />
          </div>
        ) : null}
        <div className="field-group">
          <label>{t('checkout.driverInstructions', 'Driver instructions')}</label>
          <textarea className="notes-area" value={instructions} onChange={(event) => setInstructions(event.target.value)} />
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-title">{t('checkout.tip', 'Tip your courier')}</h2>
        <div className="chip-cloud">
          {[0, 1500, 2500, 4000].map((value) => (
            <button
              key={value}
              className={tipSos === value ? 'choice-chip active' : 'choice-chip'}
              onClick={() => setTipSos(value)}
            >
              {value === 0 ? t('checkout.noTip', 'No tip') : formatSos(value)}
            </button>
          ))}
        </div>
      </section>

      <section className="summary-card">
        <h2>{t('checkout.finalSummary', 'Final summary')}</h2>
        <div className="summary-row">
          <span>{restaurant.name}</span>
          <strong>{restaurant.deliveryTime}</strong>
        </div>
        <div className="summary-row">
          <span>{t('checkout.address', 'Address')}</span>
          <strong>{translateText(address.label)}</strong>
        </div>
        <div className="summary-row">
          <span>{t('checkout.payment', 'Payment')}</span>
          <strong>{translateText(paymentMethod.label)}</strong>
        </div>
        <div className="summary-row">
          <span>{t('cart.subtotal', 'Subtotal')}</span>
          <strong>{formatSos(subtotalSos)}</strong>
        </div>
        <div className="summary-row">
          <span>{t('cart.deliveryFee', 'Delivery fee')}</span>
          <strong>{deliveryFeeSos === 0 ? t('common.free', 'Free') : formatSos(deliveryFeeSos)}</strong>
        </div>
        <div className="summary-row">
          <span>{t('cart.serviceFee', 'Service fee')}</span>
          <strong>{formatSos(totals.serviceFeeSos)}</strong>
        </div>
        <div className="summary-row">
          <span>{t('cart.taxes', 'Taxes')}</span>
          <strong>{formatSos(totals.taxesSos)}</strong>
        </div>
        <div className="summary-row">
          <span>{t('checkout.tip', 'Courier tip')}</span>
          <strong>{formatSos(tipSos)}</strong>
        </div>
        <div className="summary-row total">
          <span>{t('cart.total', 'Total')}</span>
          <strong>{formatSos(totals.totalSos)}</strong>
        </div>
        <button
          className="primary-button xl"
          disabled={submitting}
          onClick={async () => {
            setSubmitting(true);
            setError('');
            try {
              const order = await placeOrder({
              restaurantId: restaurant.id,
              items,
              subtotalSos,
              totalSos: totals.totalSos,
              addressLabel: `${address.label} · ${address.addressLine}`,
              paymentMethod: apiPaymentMethod,
            });
              clearCart();
              navigate(`/tracking/${order.id}`);
            } catch (checkoutError) {
              setError(
                checkoutError instanceof Error
                  ? checkoutError.message
                  : t('checkout.errorBody', 'We could not place the order right now. Please try again.'),
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {submitting
            ? t('checkout.processing', 'Processing...')
            : paymentMethod.type === 'mobile'
              ? t('common.confirmPhone', 'Confirm on phone')
              : t('checkout.placeOrder', 'Place order')}
        </button>
      </section>
    </div>
  );
}
