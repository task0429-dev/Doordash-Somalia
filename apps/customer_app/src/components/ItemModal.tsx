import { useEffect, useMemo, useState } from 'react';
import { formatSos } from '@/lib/format';
import { useCart } from '@/hooks/useCart';
import { useLanguage } from '@/hooks/useLanguage';
import type { MenuExtra, MenuItem, Restaurant } from '@/data/mock';

type Props = {
  restaurant: Restaurant;
  item: MenuItem | null;
  onClose: () => void;
};

export function ItemModal({ restaurant, item, onClose }: Props) {
  const { addItem } = useCart();
  const { t, translateText } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (item?.options ?? [])
        .filter((group) => group.required && group.choices[0])
        .map((group) => [group.id, group.choices[0].id]),
    ),
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const extras = useMemo<MenuExtra[]>(
    () => (item?.extras ?? []).filter((extra) => selectedExtras.includes(extra.id)),
    [item?.extras, selectedExtras],
  );

  useEffect(() => {
    setQuantity(1);
    setNotes('');
    setSelectedExtras([]);
    setSelectedChoices(
      Object.fromEntries(
        (item?.options ?? [])
          .filter((group) => group.required && group.choices[0])
          .map((group) => [group.id, group.choices[0].id]),
      ),
    );
  }, [item]);

  if (!item) return null;

  const choicePrice = (item.options ?? []).reduce((sum, group) => {
    const selected = group.choices.find((choice) => choice.id === selectedChoices[group.id]);
    return sum + (selected?.priceSos ?? 0);
  }, 0);
  const extrasPrice = extras.reduce((sum, extra) => sum + extra.priceSos, 0);
  const total = (item.priceSos + choicePrice + extrasPrice) * quantity;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <section className="item-modal" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t('modal.close', 'Close item details')}>
          ×
        </button>
        <div className="item-modal-image" style={{ backgroundImage: `url(${item.image})` }} />
        <div className="item-modal-content">
          <div className="item-modal-heading">
            <div>
              <span className="soft-badge subtle">{item.badge ? translateText(item.badge) : restaurant.name}</span>
              <h2>{translateText(item.name)}</h2>
              <p>{translateText(item.description)}</p>
            </div>
            <strong>{formatSos(item.priceSos)}</strong>
          </div>

          {(item.options ?? []).map((group) => (
            <div key={group.id} className="selection-block">
              <div className="selection-heading">
                <h3>{translateText(group.label)}</h3>
                <span>{group.required ? t('modal.required', 'Required') : t('modal.optional', 'Optional')}</span>
              </div>
              <div className="selection-list">
                {group.choices.map((choice) => (
                  <button
                    key={choice.id}
                    className={selectedChoices[group.id] === choice.id ? 'choice-chip active' : 'choice-chip'}
                    onClick={() => setSelectedChoices((previous) => ({ ...previous, [group.id]: choice.id }))}
                  >
                    <span>{translateText(choice.label)}</span>
                    {choice.priceSos > 0 ? <small>+{formatSos(choice.priceSos)}</small> : null}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {(item.extras ?? []).length ? (
            <div className="selection-block">
              <div className="selection-heading">
                <h3>{t('modal.addOns', 'Add-ons')}</h3>
                <span>{t('modal.customize', 'Customize your plate')}</span>
              </div>
              <div className="selection-list">
                {(item.extras ?? []).map((extra) => {
                  const active = selectedExtras.includes(extra.id);
                  return (
                    <button
                      key={extra.id}
                      className={active ? 'choice-chip active' : 'choice-chip'}
                      onClick={() =>
                        setSelectedExtras((previous) =>
                          active ? previous.filter((extraId) => extraId !== extra.id) : [...previous, extra.id],
                        )
                      }
                    >
                      <span>{translateText(extra.label)}</span>
                      <small>+{formatSos(extra.priceSos)}</small>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className="selection-block">
            <div className="selection-heading">
              <h3>{t('modal.instructions', 'Special instructions')}</h3>
              <span>{t('modal.optional', 'Optional')}</span>
            </div>
            <textarea
              className="notes-area"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder={t('modal.placeholder', 'Less sauce, extra hot, call on arrival...')}
            />
          </div>

          <div className="item-modal-footer">
            <div className="stepper">
              <button onClick={() => setQuantity((previous) => Math.max(1, previous - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((previous) => previous + 1)}>+</button>
            </div>
            <button
              className="primary-button large"
              onClick={() => {
                addItem({
                  restaurantId: restaurant.id,
                  menuItem: item,
                  quantity,
                  notes,
                  selectedChoices,
                  extras,
                });
                onClose();
              }}
            >
              {t('modal.addToCart', 'Add to cart')} · {formatSos(total)}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
