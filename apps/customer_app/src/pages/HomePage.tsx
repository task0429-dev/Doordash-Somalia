import { PromoCarousel } from '@/components/PromoCarousel';
import { RestaurantCard } from '@/components/RestaurantCard';
import {
  CATEGORIES,
  GROCERY_SPOTLIGHTS,
  PROMO_BANNERS,
  getFastDeliveryRestaurants,
  getFeaturedRestaurants,
  getOfferRestaurants,
  getTopRatedRestaurants,
} from '@/data/mock';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useLanguage } from '@/hooks/useLanguage';
import { formatSos } from '@/lib/format';
import { useHashRouter } from '@/lib/router';

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="section-header">
      <div>
        <h2>{title}</h2>
      </div>
      {action ? (
        <button className="text-button" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  );
}

export function HomePage() {
  const { navigate } = useHashRouter();
  const { favoriteRestaurantIds, toggleFavoriteRestaurant, isPrimeMember, orderHistory } = useMarketplace();
  const { t, translateText } = useLanguage();
  const featuredRestaurants = getFeaturedRestaurants();
  const fastDelivery = getFastDeliveryRestaurants();
  const topRated = getTopRatedRestaurants();
  const offers = getOfferRestaurants();
  const recentOrders = orderHistory.slice(0, 2);
  const spotlightRestaurant = featuredRestaurants[0];
  const quickReadoutRestaurants = featuredRestaurants.slice(1, 4);

  return (
    <div className="screen-stack home-screen">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">{t('home.eyebrow', 'Delivering in Mogadishu')}</span>
          <h1>{t('home.title', 'Crave-worthy food and daily essentials with a premium blue-hour feel.')}</h1>
          <p>{t('home.description', 'Browse polished Somali favorites, fast comfort food, and groceries in a single mobile-first flow.')}</p>
        </div>
        <div className="hero-insight-strip">
          <div className="hero-insight-card">
            <strong>{featuredRestaurants.length}</strong>
            <span>{t('home.openNowCount', 'Open now')}</span>
          </div>
          <div className="hero-insight-card">
            <strong>{fastDelivery.length}</strong>
            <span>{t('home.fastTrackCount', 'Fast lanes')}</span>
          </div>
          <div className="hero-insight-card">
            <strong>{offers.length}</strong>
            <span>{t('home.liveDealsCount', 'Live deals')}</span>
          </div>
        </div>
        <button className="search-prompt" onClick={() => navigate('/search')}>
          <span>{t('home.searchPrompt', 'Search restaurants, dishes, and essentials')}</span>
          <strong>{t('home.searchAction', 'Search')}</strong>
        </button>
        {spotlightRestaurant ? (
          <div className="hero-focus-grid">
            <button className="hero-feature-card" onClick={() => navigate(`/restaurant/${spotlightRestaurant.id}`)}>
              <div className="hero-feature-topline">
                <span className="eyebrow light">{t('home.centerPick', 'Center-stage pick')}</span>
                <span className="soft-badge subtle">{spotlightRestaurant.deliveryTime}</span>
              </div>
              <div className="hero-feature-copy">
                <strong>{spotlightRestaurant.name}</strong>
                <p>{translateText(spotlightRestaurant.heroNote)}</p>
              </div>
              <div className="hero-feature-meta">
                <span className="hero-feature-chip">{translateText(spotlightRestaurant.district)}</span>
                <span className="hero-feature-chip">★ {spotlightRestaurant.rating.toFixed(1)}</span>
                <span className="hero-feature-chip">
                  {spotlightRestaurant.primeEligible ? 'Prime' : formatSos(spotlightRestaurant.deliveryFeeSos)}
                </span>
              </div>
            </button>
            <article className="hero-readout-card">
              <div className="hero-readout-topline">
                <span className="eyebrow">{t('home.rightNow', 'Near you right now')}</span>
                <button className="text-button" onClick={() => navigate('/search')}>
                  {t('home.seeAll', 'See all')}
                </button>
              </div>
              <div className="hero-readout-list">
                {quickReadoutRestaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    className="hero-readout-item"
                    onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                  >
                    <div className="hero-readout-copy">
                      <strong>{restaurant.name}</strong>
                      <p>{restaurant.cuisines.slice(0, 2).map(translateText).join(' · ')}</p>
                    </div>
                    <span className="hero-readout-tag">{restaurant.deliveryTime}</span>
                  </button>
                ))}
              </div>
            </article>
          </div>
        ) : null}
      </section>

      <PromoCarousel items={PROMO_BANNERS} onNavigate={navigate} />

      <section className="section-block">
        <SectionHeader title={t('home.categories', 'Browse categories')} action={t('home.seeAll', 'See all')} onAction={() => navigate('/search')} />
        <div className="category-rail">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              className="category-tile"
              onClick={() => navigate(`/category/${category.id}`)}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(4, 19, 35, 0.08), rgba(4, 19, 35, 0.58)), url(${category.image})`,
              }}
            >
              <span>{translateText(category.label)}</span>
              <small>{translateText(category.subtitle)}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title={t('home.featured', 'Featured for tonight')} action={t('common.search', 'Search')} onAction={() => navigate('/search')} />
        <div className="restaurant-stack">
          {featuredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              isFavorite={favoriteRestaurantIds.includes(restaurant.id)}
              onToggleFavorite={() => toggleFavoriteRestaurant(restaurant.id)}
              onOpen={() => navigate(`/restaurant/${restaurant.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title={t('home.fast', 'Fast delivery')} />
        <div className="horizontal-scroll">
          {fastDelivery.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              compact
              restaurant={restaurant}
              isFavorite={favoriteRestaurantIds.includes(restaurant.id)}
              onToggleFavorite={() => toggleFavoriteRestaurant(restaurant.id)}
              onOpen={() => navigate(`/restaurant/${restaurant.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title={t('home.topRated', 'Top rated')} />
        <div className="horizontal-scroll">
          {topRated.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              compact
              restaurant={restaurant}
              isFavorite={favoriteRestaurantIds.includes(restaurant.id)}
              onToggleFavorite={() => toggleFavoriteRestaurant(restaurant.id)}
              onOpen={() => navigate(`/restaurant/${restaurant.id}`)}
            />
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title={t('home.primeSpotlight', 'Prime spotlight')} action={t('home.viewPrime', 'View Prime')} onAction={() => navigate('/prime')} />
        <article className="prime-panel">
          <div>
            <span className="eyebrow light">{translateText('Membership')}</span>
            <h3>{isPrimeMember ? t('home.primeActive', 'Your Prime plan is active') : t('home.primeUpgrade', 'Upgrade to Prime')}</h3>
            <p>{t('home.primeDescription', 'Free delivery on eligible orders, exclusive offers, and priority support.')}</p>
          </div>
          <div className="prime-stats">
            <div>
              <strong>58</strong>
              <span>{t('home.eligibleStores', 'eligible stores')}</span>
            </div>
            <div>
              <strong>{formatSos(0)}</strong>
              <span>{t('home.freeDelivery', 'delivery on marked orders')}</span>
            </div>
          </div>
        </article>
      </section>

      <section className="section-block">
        <SectionHeader title={t('home.offers', 'Offers & deals')} />
        <div className="deal-grid">
          {offers.map((restaurant) => (
            <button key={restaurant.id} className="deal-card" onClick={() => navigate(`/restaurant/${restaurant.id}`)}>
              <div className="deal-card-copy">
                <strong>{restaurant.name}</strong>
                <p>{translateText(restaurant.promo)}</p>
              </div>
              <span>{restaurant.deliveryTime}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title={t('home.groceries', 'Groceries & essentials')} />
        <div className="grocery-grid">
          {GROCERY_SPOTLIGHTS.map((spotlight) => (
            <button
              key={spotlight.id}
              className="grocery-card"
              onClick={() => navigate('/category/groceries')}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(4, 19, 35, 0.06), rgba(4, 19, 35, 0.7)), url(${spotlight.image})`,
              }}
            >
              <div>
                <strong>{translateText(spotlight.title)}</strong>
                <p>{translateText(spotlight.subtitle)}</p>
              </div>
              <span>{spotlight.eta}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <SectionHeader title={t('home.recent', 'Reorder and recent')} />
        <div className="recent-order-list">
          {recentOrders.map((order) => (
            <button key={order.id} className="recent-order-card" onClick={() => navigate(`/tracking/${order.id}`)}>
              <div className="recent-order-copy">
                <strong>{order.restaurantName}</strong>
                <p>{order.itemsPreview.map(translateText).join(' · ')}</p>
              </div>
              <span>{translateText(order.etaLabel)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
