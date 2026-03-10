from datetime import datetime
import json

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.core.rate_limit import enforce_rate_limit
from app.models.audit import AuditLog
from app.models.order import Order, OrderStatusEvent
from app.models.pricing import PricingRule
from app.models.user import User
from app.schemas.order import OrderCreate, OrderOut
from app.services.fee_calculator import calculate_fees

router = APIRouter(prefix="", tags=["orders"])


def _user_by_email(db: Session, email: str, role: str) -> User:
    user = db.query(User).filter(User.email == email, User.role == role).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"{role.title()} not found")
    return user


def _add_event(db: Session, order_id: int, from_status: str, to_status: str, actor_type: str, actor_id: int):
    db.add(
        OrderStatusEvent(
            order_id=order_id,
            from_status=from_status,
            to_status=to_status,
            actor_type=actor_type,
            actor_id=actor_id,
        )
    )


def _audit(db: Session, event_type: str, actor_type: str, actor_id: int | None, endpoint: str, status_code: int, details: dict | None = None):
    db.add(
        AuditLog(
            event_type=event_type,
            actor_type=actor_type,
            actor_id=actor_id,
            endpoint=endpoint,
            status_code=status_code,
            details=json.dumps(details or {}),
        )
    )


@router.post("/customer/orders", response_model=OrderOut)
def create_customer_order(payload: OrderCreate, request: Request, db: Session = Depends(get_db)):
    enforce_rate_limit(request, key="customer_orders", limit=20, window_seconds=60)

    customer = _user_by_email(db, payload.customer_email, "customer")
    merchant = _user_by_email(db, payload.merchant_email, "merchant")
    payment_method = payload.payment_method.strip().upper() or "COD"
    is_cod = payment_method == "COD"

    rule = db.query(PricingRule).filter(PricingRule.zone == payload.zone, PricingRule.active.is_(True)).first()
    if not rule:
        rule = db.query(PricingRule).filter(PricingRule.zone == "default", PricingRule.active.is_(True)).first()
    if not rule:
        raise HTTPException(status_code=400, detail="No active pricing rule")

    fees = calculate_fees(payload.subtotal_sos, payload.distance_km, rule, include_cod_fee=is_cod)

    order = Order(
        customer_id=customer.id,
        merchant_id=merchant.id,
        status="PLACED",
        payment_method=payment_method,
        payment_status="UNPAID" if is_cod else "PAID",
        dropoff_address_text=payload.dropoff_address_text,
        subtotal_sos=fees["subtotal_sos"],
        delivery_fee_sos=fees["delivery_fee_sos"],
        surge_fee_sos=fees["surge_fee_sos"],
        cod_fee_sos=fees["cod_fee_sos"],
        total_sos=fees["total_sos"],
    )
    db.add(order)
    db.flush()

    _add_event(db, order.id, "DRAFT", "PLACED", "customer", customer.id)
    _audit(db, "order_create", "customer", customer.id, "/customer/orders", 201, {"order_id": order.id})

    db.commit()
    db.refresh(order)
    return order


@router.get("/customer/orders", response_model=list[OrderOut])
def list_customer_orders(customer_email: str = Query(...), db: Session = Depends(get_db)):
    customer = _user_by_email(db, customer_email, "customer")
    return (
        db.query(Order)
        .filter(Order.customer_id == customer.id)
        .order_by(Order.created_at.desc())
        .limit(50)
        .all()
    )


@router.get("/merchant/orders", response_model=list[OrderOut])
def list_merchant_orders(merchant_email: str = Query(...), db: Session = Depends(get_db)):
    merchant = _user_by_email(db, merchant_email, "merchant")
    return (
        db.query(Order)
        .filter(Order.merchant_id == merchant.id)
        .order_by(Order.created_at.desc())
        .limit(50)
        .all()
    )


@router.post("/merchant/orders/{order_id}/accept", response_model=OrderOut)
def merchant_accept_order(order_id: int, merchant_email: str = Query(...), db: Session = Depends(get_db)):
    merchant = _user_by_email(db, merchant_email, "merchant")
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.merchant_id != merchant.id:
        raise HTTPException(status_code=403, detail="Merchant cannot accept this order")
    if order.status != "PLACED":
        raise HTTPException(status_code=400, detail=f"Order is in state {order.status}")

    _add_event(db, order.id, order.status, "MERCHANT_ACCEPTED", "merchant", merchant.id)
    order.status = "MERCHANT_ACCEPTED"

    _add_event(db, order.id, "MERCHANT_ACCEPTED", "DISPATCHING", "system", merchant.id)
    order.status = "DISPATCHING"

    _audit(db, "merchant_accept", "merchant", merchant.id, f"/merchant/orders/{order_id}/accept", 200, {"order_id": order_id})

    db.commit()
    db.refresh(order)
    return order


@router.get("/courier/dispatch/available", response_model=list[OrderOut])
def courier_available_dispatches(courier_email: str = Query(...), db: Session = Depends(get_db)):
    _ = _user_by_email(db, courier_email, "courier")
    return (
        db.query(Order)
        .filter(Order.status == "DISPATCHING", Order.courier_id.is_(None))
        .order_by(Order.created_at.asc())
        .limit(20)
        .all()
    )


@router.post("/courier/orders/{order_id}/accept", response_model=OrderOut)
def courier_accept_order(order_id: int, courier_email: str = Query(...), db: Session = Depends(get_db)):
    courier = _user_by_email(db, courier_email, "courier")
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status != "DISPATCHING" or order.courier_id is not None:
        raise HTTPException(status_code=409, detail="Order already assigned or not dispatching")

    order.courier_id = courier.id
    order.assigned_at = datetime.utcnow()
    _add_event(db, order.id, "DISPATCHING", "COURIER_ASSIGNED", "courier", courier.id)
    order.status = "COURIER_ASSIGNED"

    _audit(db, "courier_accept", "courier", courier.id, f"/courier/orders/{order_id}/accept", 200, {"order_id": order_id})

    db.commit()
    db.refresh(order)
    return order


@router.post("/courier/orders/{order_id}/pickup", response_model=OrderOut)
def courier_pickup_order(order_id: int, courier_email: str = Query(...), db: Session = Depends(get_db)):
    courier = _user_by_email(db, courier_email, "courier")
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.courier_id != courier.id:
        raise HTTPException(status_code=403, detail="Not your order")
    if order.status != "COURIER_ASSIGNED":
        raise HTTPException(status_code=400, detail=f"Invalid state {order.status}")

    order.picked_up_at = datetime.utcnow()
    _add_event(db, order.id, "COURIER_ASSIGNED", "PICKED_UP", "courier", courier.id)
    order.status = "PICKED_UP"

    _audit(db, "courier_pickup", "courier", courier.id, f"/courier/orders/{order_id}/pickup", 200, {"order_id": order_id})

    db.commit()
    db.refresh(order)
    return order


@router.post("/courier/orders/{order_id}/deliver", response_model=OrderOut)
def courier_deliver_order(order_id: int, courier_email: str = Query(...), db: Session = Depends(get_db)):
    courier = _user_by_email(db, courier_email, "courier")
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.courier_id != courier.id:
        raise HTTPException(status_code=403, detail="Not your order")
    if order.status != "PICKED_UP":
        raise HTTPException(status_code=400, detail=f"Invalid state {order.status}")

    order.delivered_at = datetime.utcnow()
    _add_event(db, order.id, "PICKED_UP", "DELIVERED", "courier", courier.id)
    order.status = "DELIVERED"

    if order.payment_method != "COD":
        _add_event(db, order.id, "DELIVERED", "COMPLETED", "system", courier.id)
        order.status = "COMPLETED"

    _audit(db, "courier_deliver", "courier", courier.id, f"/courier/orders/{order_id}/deliver", 200, {"order_id": order_id})

    db.commit()
    db.refresh(order)
    return order


@router.post("/courier/orders/{order_id}/cod-collected", response_model=OrderOut)
def courier_mark_cod_collected(order_id: int, courier_email: str = Query(...), db: Session = Depends(get_db)):
    courier = _user_by_email(db, courier_email, "courier")
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.courier_id != courier.id:
        raise HTTPException(status_code=403, detail="Not your order")
    if order.status != "DELIVERED":
        raise HTTPException(status_code=400, detail=f"Invalid state {order.status}")

    order.payment_status = "PAID"
    _add_event(db, order.id, "DELIVERED", "COMPLETED", "courier", courier.id)
    order.status = "COMPLETED"

    _audit(db, "cod_collected", "courier", courier.id, f"/courier/orders/{order_id}/cod-collected", 200, {"order_id": order_id})

    db.commit()
    db.refresh(order)
    return order


@router.get("/orders/{order_id}/events")
def get_order_events(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    events = (
        db.query(OrderStatusEvent)
        .filter(OrderStatusEvent.order_id == order_id)
        .order_by(OrderStatusEvent.created_at.asc())
        .all()
    )
    return [
        {
            "id": e.id,
            "from_status": e.from_status,
            "to_status": e.to_status,
            "actor_type": e.actor_type,
            "actor_id": e.actor_id,
            "created_at": e.created_at.isoformat(),
        }
        for e in events
    ]
