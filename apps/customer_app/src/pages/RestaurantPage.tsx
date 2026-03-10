import { useEffect, useMemo, useState } from 'react';
import { listMerchantMenu } from '@/api/menu';
import { ItemModal } from '@/components/ItemModal';
import { StarMark } from '@/components/StarMark';
import { getRestaurantById, type MenuItem, type MenuSection } from '@/data/mock';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatSos } from '@/lib/format';
import { useHashRouter } from '@/lib/router';

export function RestaurantPage() {
  const { params, navigate } = useHashRouter();
  const { favoriteRestaurantIds, toggleFavoriteRestaurant } = useMarketplace();
  const { itemCount, restaurantId, getItemCount } = useCart();
  const { t, translateText } = useLanguage();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [liveMenuSections, setLiveMenuSections] = useState<MenuSection[] | null>(null);
  const restaurant = getRestaurantById(params.id);

  useEffect(() => {
    if (!restaurant) return;

    let active = true;
    void listMerchantMenu(restaurant.merchantEmail)
      .then((items) => {
        if (!active) return;
        const activeItems = items.filter((item) => item.is_active);
        if (!activeItems.length) {
          setLiveMenuSections(null);
          return;
        }

        setLiveMenuSections([
          {
            id: 'merchant-live',
            title: 'Available today',
            caption: 'Synced from the merchant portal',
            items: activeItems.map((item) => ({
              id: `live-${item.id}`,
              name: item.name,
              description: `Freshly prepared for ${restaurant.name}.`,
              priceSos: item.price_sos,
              image: restaurant.gallery[0] ?? restaurant.coverImage,
              badge: 'Live menu',
            })),
          },
        ]);
      })
      .catch(() => {
        if (active) setLiveMenuSections(null);
      });

    return () => {
      active = false;
    };
  }, [restaurant]);

  const cartCount = useMemo(() => {
    if (!restaurant) return 0;
    const menuSections = liveMenuSections ?? restaurant.menu;
    return menuSections.flatMap((section) => section.items).reduce((sum, item) => sum + getItemCount(item.id), 0);
  }, [getItemCount, liveMenuSections, restaurant]);

  const menuSections = liveMenuSections ?? restaurant?.menu ?? [];

  if (!restaurant) {
    return (
      <div className="empty-panel">
        <strong>{t('restaurant.notFoundTitle', "We couldn't find that restaurant.")}</strong>
        <p>{t('restaurant.notFoundBody', 'Try exploring another category or search from the home screen.')}</p>
        <button className="primary-button" onClick={() => navigate('/home')}>
          {t('restaurant.explore', 'Explore food')}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="restaurant-page">
        <section
          className="restaurant-hero"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(4, 19, 35, 0.16), rgba(4, 19, 35, 0.72)), url(${restaurant.coverImage})`,
          }}
        >
          <button className="floating-back" onClick={() => navigate('/home')}>
            ←
          </button>
          <button
            className={favoriteRestaurantIds.includes(restaurant.id) ? 'floating-favorite active' : 'floating-favorite'}
            onClick={() => toggleFavoriteRestaurant(restaurant.id)}
          >
            {favoriteRestaurantIds.includes(restaurant.id) ? '♥' : '♡'}
          </button>
          <div className="restaurant-hero-copy">
            <span className="soft-badge light">{restaurant.district}</span>
            <h1>{restaurant.name}</h1>
            <p>{translateText(restaurant.heroNote)}</p>
          </div>
        </section>

        <section className="restaurant-summary">
          <div className="summary-topline">
            <div className="rating-pill large">
              <span>★</span>
              <strong>{restaurant.rating.toFixed(1)}</strong>
            </div>
            <span>{restaurant.reviewCount} {t('restaurant.reviews', 'reviews')}</span>
            <span>{restaurant.deliveryTime}</span>
            <span>{restaurant.distanceKm.toFixed(1)} km</span>
          </div>
          <div className="summary-badges">
            <span className="soft-badge subtle">{restaurant.cuisines.map(translateText).join(' · ')}</span>
            <span className="soft-badge subtle">{t('restaurant.min', 'Min.')} {formatSos(restaurant.minimumOrderSos)}</span>
            {restaurant.primeEligible ? (
              <span className="soft-badge prime">
                <StarMark size={14} className="soft-badge-star" />
                {t('restaurant.primeEligible', 'Prime eligible')}
              </span>
            ) : null}
          </div>
          <p>{translateText(restaurant.story)}</p>
          <div className="info-strip">
            <div>
              <strong>{restaurant.deliveryTime}</strong>
              <span>{t('restaurant.estimatedDelivery', 'Estimated delivery')}</span>
            </div>
            <div>
              <strong>{restaurant.primeEligible ? t('common.free', 'Free') : formatSos(restaurant.deliveryFeeSos)}</strong>
              <span>{t('restaurant.deliveryFee', 'Delivery fee')}</span>
            </div>
            <div>
              <strong>{restaurant.priceTier}</strong>
              <span>{t('restaurant.priceLevel', 'Price level')}</span>
            </div>
          </div>
        </section>

        <section className="menu-nav">
          {menuSections.map((section) => (
            <button key={section.id} className="choice-chip">
              {translateText(section.title)}
            </button>
          ))}
        </section>

        <section className="menu-section-list">
          {menuSections.map((section) => (
            <div key={section.id} className="menu-section">
              <div className="section-header">
                <div>
                  <h2>{translateText(section.title)}</h2>
                  {section.caption ? <p>{translateText(section.caption)}</p> : null}
                </div>
              </div>
              <div className="menu-item-stack">
                {section.items.map((item) => (
                  <button key={item.id} className="menu-item-card" onClick={() => setSelectedItem(item)}>
                    <div className="menu-item-copy">
                      {item.badge ? <span className="soft-badge subtle">{translateText(item.badge)}</span> : null}
                      <h3>{translateText(item.name)}</h3>
                      <p>{translateText(item.description)}</p>
                      <div className="menu-item-footer">
                        <strong>{formatSos(item.priceSos)}</strong>
                        <span>{getItemCount(item.id)} {t('restaurant.inCart', 'in cart')}</span>
                      </div>
                    </div>
                    <div className="menu-item-image" style={{ backgroundImage: `url(${item.image})` }} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {cartCount > 0 && restaurantId === restaurant.id ? (
          <button className="floating-cart-cta" onClick={() => navigate('/cart')}>
            <span>{t('restaurant.itemsReady', '{count} items ready', { count: cartCount })}</span>
            <strong>{t('restaurant.openCart', 'Open cart')}</strong>
          </button>
        ) : null}
        {itemCount > 0 && restaurantId !== restaurant.id ? (
          <button className="floating-cart-cta muted" onClick={() => navigate('/cart')}>
            <span>{t('restaurant.otherStoreCart', 'Cart from another store')}</span>
            <strong>{t('restaurant.reviewCart', 'Review cart')}</strong>
          </button>
        ) : null}
      </div>
      <ItemModal restaurant={restaurant} item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}
