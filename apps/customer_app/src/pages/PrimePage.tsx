import { RestaurantCard } from '@/components/RestaurantCard';
import { StarMark } from '@/components/StarMark';
import { MEMBERSHIP_PRICE_SOS, PRIME_BENEFITS, getPrimeRestaurants } from '@/data/mock';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatSos } from '@/lib/format';
import { useHashRouter } from '@/lib/router';

export function PrimePage() {
  const { navigate } = useHashRouter();
  const { favoriteRestaurantIds, toggleFavoriteRestaurant, isPrimeMember } = useMarketplace();
  const { t, translateText } = useLanguage();
  const primeRestaurants = getPrimeRestaurants();

  return (
    <div className="screen-stack">
      <section className="prime-hero-page">
        <div className="prime-hero-copy">
          <span className="prime-badge large">
            <StarMark size={16} />
            Prime
          </span>
          <h1>{t('prime.title', 'Delivery perks designed for frequent ordering.')}</h1>
          <p>{t('prime.description', 'Keep it clean: zero delivery on eligible stores, exclusive offers, and better support when you need it.')}</p>
        </div>
        <div className="prime-price-card">
          <strong>{formatSos(MEMBERSHIP_PRICE_SOS)}</strong>
          <span>{t('prime.perMonth', 'per month')}</span>
          <small>{isPrimeMember ? t('prime.active', 'Active membership') : t('prime.join', 'Join instantly')}</small>
        </div>
      </section>

      <section className="benefit-grid">
        {PRIME_BENEFITS.map((benefit) => (
          <article key={benefit.id} className="benefit-card">
            <span className="brand-mark small">
              <StarMark size={16} />
            </span>
            <h2>{translateText(benefit.title)}</h2>
            <p>{translateText(benefit.description)}</p>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2>{t('prime.partners', 'Prime partner spots')}</h2>
            <p className="section-lead">{t('prime.partnersBody', 'Restaurants where the blue star shows up in checkout.')}</p>
          </div>
        </div>
        <div className="restaurant-stack">
          {primeRestaurants.map((restaurant) => (
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
    </div>
  );
}
