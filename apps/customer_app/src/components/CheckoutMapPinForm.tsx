import { useMemo, useState } from 'react';
import { createOrder, estimateCheckout } from '@/api/checkout';
import { formatMoney, SOMALIA_DEFAULT } from '@/lib/locale';

type Props = {
  hasSubscription: boolean;
};

export function CheckoutMapPinForm({ hasSubscription }: Props) {
  const [dropoffLabel, setDropoffLabel] = useState('Home');
  const [addressText, setAddressText] = useState('KM4, Mogadishu');
  const [lat, setLat] = useState('2.0469');
  const [lng, setLng] = useState('45.3182');
  const [phone, setPhone] = useState('+25261XXXXXXX');
  const [notes, setNotes] = useState('Call on arrival');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const pricing = useMemo(() => estimateCheckout({ subtotalSos: 50000, hasSubscription }), [hasSubscription]);

  async function submitCheckout() {
    setSubmitting(true);
    setMessage('');
    try {
      await createOrder({
        customer_email: 'customer@demo.so',
        merchant_email: 'merchant@demo.so',
        dropoff_address_text: `${dropoffLabel}: ${addressText} (${lat}, ${lng}) ${notes}`,
        subtotal_sos: pricing.subtotalSos,
        distance_km: 2,
        zone: 'mogadishu',
      });
      setMessage('Order submitted with map-pin dropoff fields.');
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Checkout (Map Pin)</h2>
      <p>Locale {SOMALIA_DEFAULT.locale} · Currency {SOMALIA_DEFAULT.currency}</p>
      <div style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input value={dropoffLabel} onChange={(event) => setDropoffLabel(event.target.value)} placeholder="Dropoff label" />
        <input value={addressText} onChange={(event) => setAddressText(event.target.value)} placeholder="Address" />
        <input value={lat} onChange={(event) => setLat(event.target.value)} placeholder="Latitude" />
        <input value={lng} onChange={(event) => setLng(event.target.value)} placeholder="Longitude" />
        <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Receiver phone" />
        <input value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Dropoff notes" />
      </div>

      <div style={{ marginTop: 12 }}>
        <div>Subtotal: {formatMoney(pricing.subtotalSos, SOMALIA_DEFAULT)}</div>
        <div>
          Delivery fee:{' '}
          {pricing.freeDelivery ? 'FREE (subscription)' : formatMoney(pricing.deliveryFeeSos, SOMALIA_DEFAULT)}
        </div>
        <strong>Total: {formatMoney(pricing.totalSos, SOMALIA_DEFAULT)}</strong>
      </div>

      <button style={{ marginTop: 12 }} onClick={submitCheckout} disabled={submitting || !phone.trim()}>
        {submitting ? 'Submitting...' : 'Place COD Order'}
      </button>
      {!!message && <p>{message}</p>}
    </section>
  );
}
