import { useMemo, useState } from 'react';
import { RestaurantCard } from '@/components/RestaurantCard';
import {
  CATEGORIES,
  RESTAURANTS,
  SEARCH_SUGGESTIONS,
  TRENDING_SEARCHES,
  getCategoryById,
} from '@/data/mock';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';
import { formatSos } from '@/lib/format';
import { useHashRouter } from '@/lib/router';

export function SearchPage() {
  const { navigate } = useHashRouter();
  const { favoriteRestaurantIds, toggleFavoriteRestaurant, recentSearches, rememberSearch } = useMarketplace();
  const { t, translateText } = useLanguage();
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<string[]>(['prime']);

  const filterOptions = [
    { id: 'fast', label: t('search.filter.fast', 'Under 25 min') },
    { id: 'rating', label: t('search.filter.rating', '4.7+ rating') },
    { id: 'open', label: t('search.filter.open', 'Open now') },
    { id: 'prime', label: t('search.filter.prime', 'Prime eligible') },
    { id: 'free', label: t('search.filter.free', 'Free delivery') },
    { id: 'budget', label: t('search.filter.budget', '$$ or less') },
  ];

  const restaurantResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return RESTAURANTS;

    return RESTAURANTS.filter((restaurant) => {
      const rawCategoryLabels = restaurant.categoryIds
        .map((categoryId) => getCategoryById(categoryId)?.label ?? categoryId)
        .join(' ');
      const haystack = [
        restaurant.name,
        ...restaurant.cuisines,
        rawCategoryLabels,
        restaurant.promo,
        restaurant.heroNote,
        restaurant.story,
        ...restaurant.menu.flatMap((section) => [
          section.title,
          section.caption ?? '',
          ...section.items.flatMap((item) => [item.name, item.description, item.badge ?? '', ...(item.extras ?? []).map((extra) => extra.label)]),
        ]),
      ]
        .flatMap((value) => [value, translateText(value)])
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [query, translateText]);

  const dishResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    return RESTAURANTS.flatMap((restaurant) =>
      restaurant.menu.flatMap((section) =>
        section.items
          .filter((item) => {
            const haystack = [item.name, item.description, item.badge ?? '', section.title]
              .flatMap((value) => [value, translateText(value)])
              .join(' ')
              .toLowerCase();
            return haystack.includes(normalized);
          })
          .map((item) => ({
            ...item,
            restaurantId: restaurant.id,
            restaurantName: restaurant.name,
          })),
      ),
    ).slice(0, 8);
  }, [query, translateText]);

  function toggleFilter(filter: string) {
    setFilters((previous) =>
      previous.includes(filter) ? previous.filter((entry) => entry !== filter) : [...previous, filter],
    );
  }

  const filteredRestaurants = restaurantResults.filter((restaurant) => {
    if (filters.includes('prime') && !restaurant.primeEligible) return false;
    if (filters.includes('fast') && !restaurant.fastDelivery) return false;
    if (filters.includes('rating') && restaurant.rating < 4.7) return false;
    if (filters.includes('open') && !restaurant.openNow) return false;
    if (filters.includes('free') && restaurant.deliveryFeeSos > 0 && !restaurant.primeEligible) return false;
    if (filters.includes('budget') && restaurant.priceTier === '$$$') return false;
    return true;
  });

  return (
    <div className="screen-stack">
      <section className="search-header-card">
        <span className="eyebrow">{t('search.eyebrow', 'Search & discovery')}</span>
        <h1>{t('search.title', 'Find something that feels right in seconds.')}</h1>
        <div className="search-field-shell">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') rememberSearch(query);
            }}
            placeholder={t('search.placeholder', 'Search restaurants, dishes, groceries')}
            className="search-field"
          />
          <button className="secondary-button" onClick={() => rememberSearch(query || 'Bariis combo')}>
            {t('search.save', 'Save')}
          </button>
        </div>
      </section>

      <section className="section-block">
        <div className="filter-row">
          {filterOptions.map((filter) => (
            <button
              key={filter.id}
              className={filters.includes(filter.id) ? 'choice-chip active' : 'choice-chip'}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {!query ? (
        <>
          <section className="section-block">
            <h2 className="section-title">{t('search.recent', 'Recent searches')}</h2>
            <div className="chip-cloud">
              {recentSearches.map((entry) => (
                <button key={entry} className="choice-chip" onClick={() => setQuery(entry)}>
                  {translateText(entry)}
                </button>
              ))}
            </div>
          </section>

          <section className="section-block">
            <h2 className="section-title">{t('search.trending', 'Trending now')}</h2>
            <div className="chip-cloud">
              {TRENDING_SEARCHES.map((entry) => (
                <button key={entry} className="choice-chip" onClick={() => setQuery(entry)}>
                  {translateText(entry)}
                </button>
              ))}
            </div>
          </section>

          <section className="section-block">
            <h2 className="section-title">{t('search.browse', 'Browse cuisines')}</h2>
            <div className="category-rail compact">
              {CATEGORIES.slice(0, 8).map((category) => (
                <button
                  key={category.id}
                  className="category-tile compact"
                  style={{
                    backgroundImage: `linear-gradient(180deg, rgba(4, 19, 35, 0.12), rgba(4, 19, 35, 0.66)), url(${category.image})`,
                  }}
                  onClick={() => navigate(`/category/${category.id}`)}
                >
                  <span>{translateText(category.label)}</span>
                  <small>{translateText(category.subtitle)}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="section-block">
            <h2 className="section-title">{t('search.suggested', 'Suggested')}</h2>
            <div className="chip-cloud">
              {SEARCH_SUGGESTIONS.map((suggestion) => (
                <button key={suggestion.id} className="choice-chip" onClick={() => setQuery(suggestion.label)}>
                  {translateText(suggestion.label)}
                </button>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="section-block">
            <h2 className="section-title">{t('search.restaurants', 'Restaurants')}</h2>
            <div className="restaurant-stack">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  isFavorite={favoriteRestaurantIds.includes(restaurant.id)}
                  onToggleFavorite={() => toggleFavoriteRestaurant(restaurant.id)}
                  onOpen={() => navigate(`/restaurant/${restaurant.id}`)}
                />
              ))}
              {!filteredRestaurants.length ? (
                <div className="empty-panel">
                  <strong>{t('search.noMatchesTitle', 'No restaurants matched those filters.')}</strong>
                  <p>{t('search.noMatchesBody', 'Try removing one or two filters, or switch to a broader search term.')}</p>
                </div>
              ) : null}
            </div>
          </section>

          {dishResults.length ? (
            <section className="section-block">
              <h2 className="section-title">{t('search.dishes', 'Dish suggestions')}</h2>
              <div className="dish-suggestion-list">
                {dishResults.map((item) => (
                  <button
                    key={`${item.restaurantId}-${item.id}`}
                    className="dish-suggestion-card"
                    onClick={() => navigate(`/restaurant/${item.restaurantId}`)}
                  >
                    <div className="dish-suggestion-image" style={{ backgroundImage: `url(${item.image})` }} />
                    <div>
                      <strong>{translateText(item.name)}</strong>
                      <p>{item.restaurantName}</p>
                    </div>
                    <span>{formatSos(item.priceSos)}</span>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
