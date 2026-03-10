import { useEffect } from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useLanguage } from '@/hooks/useLanguage';
import { formatSos } from '@/lib/format';
import { useHashRouter } from '@/lib/router';

export function OrdersPage() {
  const { navigate } = useHashRouter();
  const { activeTrackingOrder, orderHistory, refreshOrders } = useMarketplace();
  const { t, translateText } = useLanguage();

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  return (
    <div className="screen-stack">
      <section className="section-block">
        <span className="eyebrow">{t('orders.eyebrow', 'Orders')}</span>
        <h1 className="page-title">{t('orders.title', 'Your delivery timeline')}</h1>
        <p className="section-lead">{t('orders.description', 'Live orders stay on top. Past orders remain ready for a reorder pass.')}</p>
      </section>

      {activeTrackingOrder ? (
        <section className="live-order-banner">
          <div>
            <span className="eyebrow light">{t('orders.live', 'Live now')}</span>
            <h2>{activeTrackingOrder.restaurantName}</h2>
            <p>{activeTrackingOrder.etaLabel} · {activeTrackingOrder.addressLabel}</p>
          </div>
          <button className="primary-button" onClick={() => navigate(`/tracking/${activeTrackingOrder.id}`)}>
            {t('orders.track', 'Track order')}
          </button>
        </section>
      ) : null}

      <section className="section-block">
        <h2 className="section-title">{t('orders.history', 'Order history')}</h2>
        <div className="order-history-stack">
          {orderHistory.map((order) => (
            <article key={order.id} className="history-card">
              <div className="history-card-image" style={{ backgroundImage: `url(${order.restaurantImage})` }} />
              <div className="history-card-copy">
                <div className="history-card-topline">
                  <div>
                    <strong>{order.restaurantName}</strong>
                    <p>{order.itemsPreview.map(translateText).join(' · ')}</p>
                  </div>
                  <span className={order.status === 'delivered' ? 'soft-badge subtle' : 'soft-badge prime'}>
                    {translateText(order.status)}
                  </span>
                </div>
                <div className="history-card-meta">
                  <span>{new Date(order.placedAt).toLocaleDateString()}</span>
                  <span>{formatSos(order.totalSos)}</span>
                </div>
                <div className="history-card-actions">
                  <button className="secondary-button" onClick={() => navigate(`/restaurant/${order.restaurantId}`)}>
                    {t('orders.reorder', 'Reorder')}
                  </button>
                  <button className="text-button" onClick={() => navigate(`/tracking/${order.id}`)}>
                    {t('orders.details', 'View details')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
