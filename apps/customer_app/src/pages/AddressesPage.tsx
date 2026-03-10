import { SAVED_ADDRESSES } from '@/data/mock';
import { useLanguage } from '@/hooks/useLanguage';
import { useMarketplace } from '@/hooks/useMarketplace';

export function AddressesPage() {
  const { activeAddressId, setActiveAddressId } = useMarketplace();
  const { t, translateText } = useLanguage();

  return (
    <div className="screen-stack">
      <section className="section-block">
        <span className="eyebrow">{t('addresses.eyebrow', 'Saved addresses')}</span>
        <h1 className="page-title">{t('addresses.title', 'Choose where your next order lands.')}</h1>
      </section>

      <section className="address-stack">
        {SAVED_ADDRESSES.map((address) => (
          <button
            key={address.id}
            className={address.id === activeAddressId ? 'address-card active' : 'address-card'}
            onClick={() => setActiveAddressId(address.id)}
          >
            <div>
              <strong>{translateText(address.label)}</strong>
              <p>
                {address.district} · {translateText(address.addressLine)}
              </p>
            </div>
            <span>{translateText(address.etaHint)}</span>
          </button>
        ))}
        <article className="address-card add-new">
          <strong>{t('addresses.addNew', 'Add a new address')}</strong>
          <p>{t('addresses.addNewBody', 'Pin a new building, office, or family stop for quick checkout.')}</p>
        </article>
      </section>
    </div>
  );
}
