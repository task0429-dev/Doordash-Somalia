import { useEffect } from 'react';
import { TRACKING_STAGES } from '@/data/mock';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatSos } from '@/lib/format';
import { useHashRouter } from '@/lib/router';

export function TrackingPage() {
  const { params, navigate } = useHashRouter();
  const { orderHistory, refreshOrders } = useMarketplace();
  const { t, translateText } = useLanguage();
  const order = orderHistory.find((entry) => entry.id === params.id) ?? orderHistory[0];
  const activeStageIndex = TRACKING_STAGES.findIndex((stage) => stage.key === order?.status);

  useEffect(() => {
    void refreshOrders();
    const intervalId = window.setInterval(() => {
      void refreshOrders();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [refreshOrders]);

  if (!order) {
    return (
      <div className="empty-panel">
        <strong>{t('tracking.emptyTitle', 'No tracked order found.')}</strong>
        <p>{t('tracking.emptyBody', 'Return to your order history to choose another delivery.')}</p>
        <button className="primary-button" onClick={() => navigate('/orders')}>
          {t('tracking.viewOrders', 'View orders')}
        </button>
      </div>
    );
  }

  return (
    <div className="screen-stack">
      <section className="tracking-hero">
        <div className="tracking-map-surface">
          <div className="route-path" />
          <div className="map-pin pickup">{t('tracking.store', 'Store')}</div>
          <div className="map-pin courier">{t('tracking.courier', 'Courier')}</div>
          <div className="map-pin dropoff">{t('tracking.you', 'You')}</div>
        </div>
        <div className="tracking-copy">
          <span className="eyebrow">Order #{order.id}</span>
          <h1>{order.restaurantName}</h1>
          <p>{order.etaLabel} · {order.addressLabel}</p>
        </div>
      </section>

      {order.driver ? (
        <section className="driver-card">
          <div className="driver-avatar">{order.driver.name.slice(0, 1)}</div>
          <div className="driver-copy">
            <strong>{order.driver.name}</strong>
            <p>{order.driver.vehicle} · {order.driver.plate}</p>
          </div>
          <div className="driver-rating">★ {order.driver.rating.toFixed(1)}</div>
        </section>
      ) : null}

      <section className="timeline-card">
        <h2>{t('tracking.liveStatus', 'Live status')}</h2>
        <div className="timeline-list">
          {TRACKING_STAGES.map((stage, index) => (
            <div key={stage.key} className={index <= activeStageIndex ? 'timeline-step active' : 'timeline-step'}>
              <div className="timeline-indicator">{index < activeStageIndex ? '✓' : index + 1}</div>
              <div>
                <strong>{translateText(stage.label)}</strong>
                <p>{translateText(stage.note)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="summary-card">
        <h2>{t('tracking.orderDetails', 'Order details')}</h2>
        <div className="summary-row">
          <span>{t('tracking.totalPaid', 'Total paid')}</span>
          <strong>{formatSos(order.totalSos)}</strong>
        </div>
        <div className="summary-row">
          <span>{t('tracking.placed', 'Placed')}</span>
          <strong>{new Date(order.placedAt).toLocaleString()}</strong>
        </div>
        <div className="summary-row">
          <span>{t('tracking.items', 'Items')}</span>
          <strong>{order.itemsPreview.map(translateText).join(', ')}</strong>
        </div>
        <button className="secondary-button" onClick={() => navigate('/orders')}>
          {t('tracking.back', 'Back to orders')}
        </button>
      </section>
    </div>
  );
}
