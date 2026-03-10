import { useEffect, useState } from 'react';
import {
  acceptDispatch,
  collectCod,
  deliverOrder,
  getOrderEvents,
  listAvailableDispatches,
  pickupOrder,
  type Order,
  type OrderEvent,
} from '@/api/courier';

const courierEmail = 'courier@demo.so';
const money = new Intl.NumberFormat('en-US');

function formatMoney(value: number) {
  return `SOS ${money.format(value)}`;
}

function nextActionLabel(order: Order | null) {
  if (!order) return null;
  if (order.status === 'COURIER_ASSIGNED') return 'Mark picked up';
  if (order.status === 'PICKED_UP') return 'Mark delivered';
  if (order.status === 'DELIVERED') return 'Collect COD';
  return null;
}

export default function App() {
  const [dispatches, setDispatches] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('Create a customer order, then accept it from the merchant portal if the courier queue is empty.');

  async function refreshDispatches() {
    try {
      const data = await listAvailableDispatches(courierEmail);
      setDispatches(data);
      if (!data.length && !activeOrder) {
        setMessage('No open dispatches yet. Place an order from the customer app, then accept it in the merchant portal.');
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function loadEvents(orderId: number) {
    try {
      const data = await getOrderEvents(orderId);
      setEvents(data);
    } catch {
      setEvents([]);
    }
  }

  useEffect(() => {
    void refreshDispatches();
  }, []);

  async function acceptOrder(orderId: number) {
    setBusy(true);
    setMessage('');
    try {
      const order = await acceptDispatch(orderId, courierEmail);
      setActiveOrder(order);
      await loadEvents(order.id);
      await refreshDispatches();
      setMessage(`Order #${order.id} is now assigned to the courier.`);
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function progressActiveOrder() {
    if (!activeOrder) return;

    setBusy(true);
    setMessage('');
    try {
      let order = activeOrder;
      if (activeOrder.status === 'COURIER_ASSIGNED') {
        order = await pickupOrder(activeOrder.id, courierEmail);
      } else if (activeOrder.status === 'PICKED_UP') {
        order = await deliverOrder(activeOrder.id, courierEmail);
      } else if (activeOrder.status === 'DELIVERED') {
        order = await collectCod(activeOrder.id, courierEmail);
      }

      setActiveOrder(order);
      await loadEvents(order.id);
      if (order.status === 'COMPLETED') {
        setMessage(`Order #${order.id} has been completed and cash collection is confirmed.`);
      }
    } catch (error) {
      setMessage((error as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div>
          <span className="eyebrow">Courier demo</span>
          <h1>Driver point of view</h1>
          <p>
            This view is wired to the live FastAPI backend with the seeded demo courier identity. Accept an order after it
            is placed from the customer app, then move it through the delivery journey.
          </p>
        </div>
        <div className="identity-card">
          <span className="status-dot" />
          <div>
            <strong>{courierEmail}</strong>
            <div className="muted">Mogadishu courier shift</div>
          </div>
        </div>
      </header>

      <main className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Available dispatches</h2>
              <p>Orders waiting for a courier assignment.</p>
            </div>
            <button className="secondary-btn" onClick={() => void refreshDispatches()} disabled={busy}>
              Refresh
            </button>
          </div>

          {loading ? <p className="muted">Loading dispatch queue...</p> : null}
          {!loading && !dispatches.length ? <p className="muted">No dispatches are waiting right now.</p> : null}

          <div className="card-stack">
            {dispatches.map((order) => (
              <article key={order.id} className="dispatch-card">
                <div className="dispatch-topline">
                  <strong>Order #{order.id}</strong>
                  <span className="pill">{order.status}</span>
                </div>
                <p>{order.dropoff_address_text}</p>
                <div className="dispatch-meta">
                  <span>Total {formatMoney(order.total_sos)}</span>
                  <span>COD {formatMoney(order.cod_fee_sos)}</span>
                </div>
                <button className="primary-btn" onClick={() => void acceptOrder(order.id)} disabled={busy || !!activeOrder}>
                  Accept dispatch
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="panel active-panel">
          <div className="panel-header">
            <div>
              <h2>Active delivery</h2>
              <p>Current in-hand order for this courier.</p>
            </div>
          </div>

          {!activeOrder ? (
            <div className="empty-state">
              <strong>No active delivery yet</strong>
              <p>Accept a dispatch from the queue after the merchant moves a customer order into dispatch.</p>
            </div>
          ) : (
            <>
              <div className="active-card">
                <div className="dispatch-topline">
                  <strong>Order #{activeOrder.id}</strong>
                  <span className="pill">{activeOrder.status}</span>
                </div>
                <p>{activeOrder.dropoff_address_text}</p>
                <div className="dispatch-meta">
                  <span>Total {formatMoney(activeOrder.total_sos)}</span>
                  <span>Payment {activeOrder.payment_status}</span>
                </div>
                {nextActionLabel(activeOrder) ? (
                  <button className="primary-btn" onClick={() => void progressActiveOrder()} disabled={busy}>
                    {nextActionLabel(activeOrder)}
                  </button>
                ) : (
                  <button className="secondary-btn" onClick={() => void loadEvents(activeOrder.id)} disabled={busy}>
                    Refresh timeline
                  </button>
                )}
              </div>

              <div className="timeline">
                <h3>Status history</h3>
                {!events.length ? <p className="muted">Timeline will appear after the backend records status events.</p> : null}
                {events.map((event) => (
                  <div key={event.id} className="timeline-item">
                    <strong>{event.to_status}</strong>
                    <span>
                      {event.actor_type} moved the order from {event.from_status}
                    </span>
                    <span className="muted">{new Date(event.created_at).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="footer-note">{message}</footer>
    </div>
  );
}
