import { useEffect, useState } from 'react';
import type { PromoBanner } from '@/data/mock';
import { useLanguage } from '@/hooks/useLanguage';

type Props = {
  items: PromoBanner[];
  onNavigate: (route: string) => void;
};

export function PromoCarousel({ items, onNavigate }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { translateText } = useLanguage();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % items.length);
    }, 4600);

    return () => window.clearInterval(timer);
  }, [items.length]);

  return (
    <section className="promo-carousel">
      <div className="promo-stage" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {items.map((item) => (
          <article key={item.id} className="promo-card">
            <div className="promo-copy">
              <span className="promo-eyebrow">{translateText(item.eyebrow)}</span>
              <h2>{translateText(item.title)}</h2>
              <p>{translateText(item.description)}</p>
              <button className="primary-button" onClick={() => onNavigate(item.route)}>
                {translateText(item.cta)}
              </button>
            </div>
            <div className="promo-image" style={{ backgroundImage: `url(${item.image})` }} />
          </article>
        ))}
      </div>
      <div className="promo-dots" role="tablist" aria-label="Promotions">
        {items.map((item, index) => (
          <button
            key={item.id}
            className={index === activeIndex ? 'promo-dot active' : 'promo-dot'}
            onClick={() => setActiveIndex(index)}
            aria-label={translateText(item.title)}
          />
        ))}
      </div>
    </section>
  );
}
