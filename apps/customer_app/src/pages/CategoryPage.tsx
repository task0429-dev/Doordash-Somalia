import { RestaurantCard } from '@/components/RestaurantCard';
import { getCategoryById, getRestaurantsByCategory } from '@/data/mock';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useHashRouter } from '@/lib/router';

export function CategoryPage() {
  const { params, navigate } = useHashRouter();
  const { favoriteRestaurantIds, toggleFavoriteRestaurant } = useMarketplace();
  const { t, translateText } = useLanguage();
  const category = getCategoryById(params.id);
  const restaurants = params.id ? getRestaurantsByCategory(params.id) : [];

  if (!category) {
    return (
      <div className="empty-panel">
        <strong>{t('category.notFoundTitle', 'Category not found.')}</strong>
        <p>{t('category.notFoundBody', 'Choose another section from search or head back home.')}</p>
        <button className="primary-button" onClick={() => navigate('/home')}>
          {t('category.backHome', 'Back home')}
        </button>
      </div>
    );
  }

  return (
    <div className="screen-stack">
      <section
        className="category-hero"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(4, 19, 35, 0.06), rgba(4, 19, 35, 0.7)), url(${category.image})`,
        }}
      >
        <span className="eyebrow light">{t('category.label', 'Category')}</span>
        <h1>{translateText(category.label)}</h1>
        <p>{translateText(category.subtitle)}</p>
      </section>

      <section className="section-block">
        <div className="section-header">
          <div>
            <h2>{t('category.places', '{count} places available', { count: restaurants.length })}</h2>
          </div>
          <button className="text-button" onClick={() => navigate('/search')}>
            {t('category.searchAll', 'Search all')}
          </button>
        </div>

        <div className="restaurant-stack">
          {restaurants.map((restaurant) => (
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
