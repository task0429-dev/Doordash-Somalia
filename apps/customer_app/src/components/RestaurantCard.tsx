import { formatSos } from '@/lib/format';
import { useLanguage } from '@/hooks/useLanguage';
import { StarMark } from './StarMark';
import type { Restaurant } from '@/data/mock';

type Props = {
  restaurant: Restaurant;
  compact?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onOpen: () => void;
};

export function RestaurantCard({ restaurant, compact = false, isFavorite = false, onToggleFavorite, onOpen }: Props) {
  const { t, translateText } = useLanguage();

  return (
    <article className={compact ? 'restaurant-card compact' : 'restaurant-card'} onClick={onOpen}>
      <div className="restaurant-media" style={{ backgroundImage: `url(${restaurant.coverImage})` }}>
        <div className="restaurant-badges">
          <span className="soft-badge light">{restaurant.deliveryTime}</span>
          {restaurant.primeEligible ? (
            <span className="soft-badge prime">
              <StarMark size={14} className="soft-badge-star" />
              Prime
            </span>
          ) : null}
        </div>
        <button
          className={isFavorite ? 'icon-button active' : 'icon-button'}
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite?.();
          }}
          aria-label={isFavorite ? `Remove ${restaurant.name} from favorites` : `Save ${restaurant.name}`}
        >
          {isFavorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="restaurant-body">
        <div className="restaurant-heading">
          <div>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.cuisines.map(translateText).join(' · ')}</p>
          </div>
          <div className="rating-pill">
            <span>★</span>
            <strong>{restaurant.rating.toFixed(1)}</strong>
          </div>
        </div>
        <div className="restaurant-meta">
          <span>{restaurant.distanceKm.toFixed(1)} km</span>
          <span>{restaurant.priceTier}</span>
          <span>{restaurant.fastDelivery ? t('home.fast', 'Fast delivery') : formatSos(restaurant.deliveryFeeSos)}</span>
        </div>
        <div className="restaurant-footer">
          <span>{translateText(restaurant.promo)}</span>
          {!compact && <span>{restaurant.reviewCount} {t('restaurant.reviews', 'reviews')}</span>}
        </div>
      </div>
    </article>
  );
}
