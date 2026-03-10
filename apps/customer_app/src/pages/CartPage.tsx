import { useState } from 'react';
import { getRestaurantById } from '@/data/mock';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatSos } from '@/lib/format';
import { useHashRouter } from '@/lib/router';

function calculateTotals(subtotalSos: number, deliveryFeeSos: number) {
  const serviceFeeSos = Math.round(subtotalSos * 0.06);
  const taxesSos = Math.round(subtotalSos * 0.05);
  return {
    serviceFeeSos,
    taxesSos,
    totalSos: subtotalSos + deliveryFeeSos + serviceFeeSos + taxesSos,
  };
}

export function CartPage() {
  const { navigate } = useHashRouter();
  const { isPrimeMember } = useMarketplace();
  const { items, restaurantId, subtotalSos, clearCart, removeLine, updateQuantity } = useCart();
  const { t, translateText } = useLanguage();
  const [promoCode, setPromoCode] = useState('BLUESTAR');
  const [deliveryNotes, setDeliveryNotes] = useState('Call on arrival');
  const [utensils, setUtensils] = useState(false);
  const restaurant = getRestaurantById(restaurantId ?? undefined);

  if (!items.length || !restaurant) {
    return (
      <div className="empty-panel">
        <strong>{t('cart.emptyTitle', 'Your cart is empty.')}</strong>
        <p>{t('cart.emptyBody', 'Browse a restaurant, customize an item, and it will appear here.')}</p>
        <button className="primary-button" onClick={() => navigate('/home')}>
          {t('cart.start', 'Start browsing')}
        </button>
      </div>
    );
  }

  const deliveryFeeSos = isPrimeMember && restaurant.primeEligible ? 0 : restaurant.deliveryFeeSos;
  const totals = calculateTotals(subtotalSos, deliveryFeeSos);

  return (
    <div className="screen-stack">
      <section className="section-block">
        <div className="section-header">
          <div>
            <span className="eyebrow">{t('cart.title', 'Cart')}</span>
            <h1>{restaurant.name}</h1>
            <p>{restaurant.deliveryTime} · {restaurant.district}</p>
          </div>
          <button className="text-button" onClick={clearCart}>
            {t('cart.clear', 'Clear cart')}
          </button>
        </div>

        <div className="cart-stack">
          {items.map((line) => (
            <article key={line.id} className="cart-item-card">
              <div className="cart-item-copy">
                <h3>{translateText(line.menuItem.name)}</h3>
                <p>
                  {Object.values(line.selectedChoices).map(translateText).join(' · ') || t('cart.standard', 'Standard')}
                  {line.extras.length ? ` · ${line.extras.map((extra) => translateText(extra.label)).join(', ')}` : ''}
                </p>
                {line.notes ? <small>{line.notes}</small> : null}
                <strong>{formatSos(line.menuItem.priceSos)}</strong>
              </div>
              <div className="cart-controls">
                <div className="stepper">
                  <button onClick={() => updateQuantity(line.id, line.quantity - 1)}>−</button>
                  <span>{line.quantity}</span>
                  <button onClick={() => updateQuantity(line.id, line.quantity + 1)}>+</button>
                </div>
                <button className="text-button danger" onClick={() => removeLine(line.id)}>
                  {t('cart.remove', 'Remove')}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <h2 className="section-title">{t('cart.details', 'Delivery details')}</h2>
        <div className="field-group">
          <label>{t('cart.promoCode', 'Promo code')}</label>
          <input className="search-field" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} />
        </div>
        <div className="field-group">
          <label>{t('cart.instructions', 'Delivery instructions')}</label>
          <textarea className="notes-area" value={deliveryNotes} onChange={(event) => setDeliveryNotes(event.target.value)} />
        </div>
        <button className={utensils ? 'choice-chip active' : 'choice-chip'} onClick={() => setUtensils((previous) => !previous)}>
          {utensils ? t('cart.utensilsAdded', 'Utensils added') : t('cart.addUtensils', 'Add utensils')}
        </button>
      </section>

      <section className="summary-card">
        <h2>{t('cart.summary', 'Order summary')}</h2>
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
        <div className="summary-row total">
          <span>{t('cart.total', 'Total')}</span>
          <strong>{formatSos(totals.totalSos)}</strong>
        </div>
        <button className="primary-button xl" onClick={() => navigate('/checkout')}>
          {t('cart.continue', 'Continue to checkout')}
        </button>
      </section>
    </div>
  );
}
