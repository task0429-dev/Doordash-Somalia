import { PAYMENT_METHODS, SAVED_ADDRESSES, getRestaurantById } from '@/data/mock';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useHashRouter } from '@/lib/router';

export function ProfilePage() {
  const { navigate } = useHashRouter();
  const { favoriteRestaurantIds, activeAddressId, activePaymentMethodId, orderHistory } = useMarketplace();
  const { t, translateText } = useLanguage();
  const favoriteRestaurants = favoriteRestaurantIds.map((id) => getRestaurantById(id)).filter(Boolean);

  return (
    <div className="screen-stack">
      <section className="profile-hero">
        <div className="profile-avatar">AH</div>
        <div>
          <span className="eyebrow">{t('profile.eyebrow', 'Account')}</span>
          <h1>Ayaan Hassan</h1>
          <p>{t('profile.membershipLine', 'Prime member')} · {t('layout.languageLabel', 'Language')} · {t('profile.on', 'On')}</p>
        </div>
      </section>

      <section className="profile-section-grid">
        <article className="profile-card">
          <h2>{t('profile.savedAddresses', 'Saved addresses')}</h2>
          {SAVED_ADDRESSES.map((address) => (
            <div key={address.id} className={address.id === activeAddressId ? 'profile-row active' : 'profile-row'}>
              <div>
                <strong>{translateText(address.label)}</strong>
                <p>{translateText(address.addressLine)}</p>
              </div>
              <span>{translateText(address.etaHint)}</span>
            </div>
          ))}
          <button className="text-button" onClick={() => navigate('/addresses')}>
            {t('profile.manageAddresses', 'Manage addresses')}
          </button>
        </article>

        <article className="profile-card">
          <h2>{t('profile.paymentMethods', 'Payment methods')}</h2>
          {PAYMENT_METHODS.map((method) => (
            <div key={method.id} className={method.id === activePaymentMethodId ? 'profile-row active' : 'profile-row'}>
              <div>
                <strong>{translateText(method.label)}</strong>
                <p>{translateText(method.subtitle)}</p>
              </div>
              <span>{method.type === 'mobile' ? t('common.mobileWallet', 'Mobile wallet') : t('common.cash', 'Cash')}</span>
            </div>
          ))}
        </article>

        <article className="profile-card">
          <h2>{t('profile.favorites', 'Favorites')}</h2>
          {favoriteRestaurants.map((restaurant) => (
            <div key={restaurant?.id} className="profile-row">
              <div>
                <strong>{restaurant?.name}</strong>
                <p>{restaurant?.cuisines.map(translateText).join(' · ')}</p>
              </div>
              <button className="text-button" onClick={() => navigate(`/restaurant/${restaurant?.id}`)}>
                {t('profile.open', 'Open')}
              </button>
            </div>
          ))}
        </article>

        <article className="profile-card">
          <h2>{t('profile.preferences', 'Support & preferences')}</h2>
          <div className="profile-row">
            <div>
              <strong>{t('profile.notifications', 'Notifications')}</strong>
              <p>{t('profile.notificationsBody', 'Promotions, order updates, membership reminders')}</p>
            </div>
            <span>{t('profile.on', 'On')}</span>
          </div>
          <div className="profile-row">
            <div>
              <strong>{t('profile.language', 'Language')}</strong>
              <p>{t('layout.languageLabel', 'Language')} switcher ready</p>
            </div>
            <span>{t('layout.languageLabel', 'Language')}</span>
          </div>
          <div className="profile-row">
            <div>
              <strong>{t('profile.orderHistory', 'Order history')}</strong>
              <p>{t('profile.orderHistoryBody', '{count} past orders available', { count: orderHistory.length })}</p>
            </div>
            <button className="text-button" onClick={() => navigate('/orders')}>
              {t('profile.view', 'View')}
            </button>
          </div>
          <button className="primary-button" onClick={() => navigate('/prime')}>
            {t('profile.openPrime', 'Open Prime')}
          </button>
        </article>
      </section>
    </div>
  );
}
