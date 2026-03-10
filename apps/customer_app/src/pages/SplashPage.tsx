import { useEffect, useState } from 'react';
import { StarMark } from '@/components/StarMark';
import { useLanguage } from '@/hooks/useLanguage';

type Props = {
  onContinue: () => void;
};

export function SplashPage({ onContinue }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const { t } = useLanguage();
  const slides = [
    {
      title: t('splash.slide1.title', 'Discover polished Somali dining'),
      description: t(
        'splash.slide1.description',
        'A premium home for modern Somali classics, neighborhood favorites, and blue-chip essentials.',
      ),
    },
    {
      title: t('splash.slide2.title', 'Fast delivery that feels trustworthy'),
      description: t(
        'splash.slide2.description',
        'Clear ETAs, clean tracking, and a checkout flow designed to feel calm and reliable.',
      ),
    },
    {
      title: t('splash.slide3.title', 'Groceries and essentials built in'),
      description: t(
        'splash.slide3.description',
        'Move from dinner to fruit, milk, medicine, and house basics without leaving the app.',
      ),
    },
    {
      title: t('splash.slide4.title', 'Prime makes frequent ordering lighter'),
      description: t(
        'splash.slide4.description',
        'Free delivery, member-only offers, and better support under one simple plan.',
      ),
    },
  ] as const;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((previous) => (previous + 1) % slides.length);
    }, 3400);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="splash-page">
      <div className="splash-orb splash-orb-left" />
      <div className="splash-orb splash-orb-right" />
      <section className="splash-card">
        <div className="brand-intro">
          <span className="brand-mark hero">
            <StarMark size={28} />
          </span>
          <div>
            <strong>Dash</strong>
            <span>{t('splash.brandLine', 'Mogadishu delivery, refined')}</span>
          </div>
        </div>

        <div className="splash-copy">
          <span className="splash-kicker">{t('splash.kicker', 'Premium Somalia delivery app')}</span>
          <h1>{t('splash.title', 'Food, groceries, and essentials with clean modern flow.')}</h1>
          <p>{slides[activeIndex].description}</p>
        </div>

        <div className="onboarding-panel">
          <div className="onboarding-visual" />
          <div className="onboarding-copy">
            <h2>{slides[activeIndex].title}</h2>
            <div className="onboarding-dots">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  className={index === activeIndex ? 'promo-dot active' : 'promo-dot'}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <button className="primary-button xl" onClick={onContinue}>
          {t('splash.start', 'Start exploring')}
        </button>
      </section>
    </main>
  );
}
