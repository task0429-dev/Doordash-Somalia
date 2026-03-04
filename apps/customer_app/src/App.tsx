import { useState } from 'react';
import { CheckoutMapPinForm } from '@/components/CheckoutMapPinForm';

export default function App() {
  const [hasSubscription, setHasSubscription] = useState(true);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: 16 }}>
      <h1>DoorDash Somalia - Customer</h1>
      <label>
        <input
          type="checkbox"
          checked={hasSubscription}
          onChange={(event) => setHasSubscription(event.target.checked)}
        />{' '}
        DoorDash Prime active (free delivery)
      </label>
      <CheckoutMapPinForm hasSubscription={hasSubscription} />
    </main>
  );
}
