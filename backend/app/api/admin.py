from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.order import Order
from app.models.pricing import PricingRule
from app.models.user import User

router = APIRouter(prefix="", tags=["admin"])


class PricingRuleUpdate(BaseModel):
    base_fee_sos: int | None = None
    per_km_sos: int | None = None
    surge_multiplier: float | None = None
    cod_fee_sos: int | None = None
    active: bool | None = None


def _serialize_order(order: Order) -> dict:
    return {
        "id": order.id,
        "customer_id": order.customer_id,
        "customer_email": order.customer_email,
        "customer_name": order.customer_name,
        "merchant_id": order.merchant_id,
        "merchant_email": order.merchant_email,
        "merchant_name": order.merchant_name,
        "courier_id": order.courier_id,
        "courier_email": order.courier_email,
        "courier_name": order.courier_name,
        "status": order.status,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "dropoff_address_text": order.dropoff_address_text,
        "subtotal_sos": order.subtotal_sos,
        "delivery_fee_sos": order.delivery_fee_sos,
        "surge_fee_sos": order.surge_fee_sos,
        "cod_fee_sos": order.cod_fee_sos,
        "total_sos": order.total_sos,
        "assigned_at": order.assigned_at.isoformat() if order.assigned_at else None,
        "picked_up_at": order.picked_up_at.isoformat() if order.picked_up_at else None,
        "delivered_at": order.delivered_at.isoformat() if order.delivered_at else None,
        "created_at": order.created_at.isoformat() if order.created_at else None,
    }


def _serialize_user(user: User, order_count: int) -> dict:
    return {
        "id": user.id,
        "role": user.role,
        "email": user.email,
        "phone": user.phone,
        "full_name": user.full_name,
        "order_count": order_count,
        "created_at": user.created_at.isoformat() if user.created_at else None,
    }


@router.get("/admin/overview")
def admin_overview(db: Session = Depends(get_db)):
    start_of_day = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    total_orders = db.query(func.count(Order.id)).scalar() or 0
    total_merchants = db.query(func.count(User.id)).filter(User.role == "merchant").scalar() or 0
    active_users = db.query(func.count(User.id)).scalar() or 0
    subscriptions_count = db.query(func.count(User.id)).filter(User.role == "customer").scalar() or 0
    revenue_today = (
        db.query(func.coalesce(func.sum(Order.total_sos), 0))
        .filter(Order.created_at >= start_of_day)
        .scalar()
        or 0
    )
    recent_orders = db.query(Order).order_by(Order.created_at.desc()).limit(8).all()

    return {
        "metrics": {
            "total_orders": total_orders,
            "total_merchants": total_merchants,
            "active_users": active_users,
            "subscriptions_count": subscriptions_count,
            "revenue_today": int(revenue_today),
        },
        "recent_orders": [_serialize_order(order) for order in recent_orders],
    }


@router.get("/admin/orders")
def admin_orders(db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(Order.created_at.desc()).limit(100).all()
    return [_serialize_order(order) for order in orders]


@router.get("/admin/merchants")
def admin_merchants(db: Session = Depends(get_db)):
    merchants = db.query(User).filter(User.role == "merchant").order_by(User.created_at.asc()).all()
    counts = dict(
        db.query(Order.merchant_id, func.count(Order.id))
        .group_by(Order.merchant_id)
        .all()
    )
    return [_serialize_user(user, counts.get(user.id, 0)) for user in merchants]


@router.get("/admin/users")
def admin_users(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.asc()).limit(200).all()
    customer_counts = dict(
        db.query(Order.customer_id, func.count(Order.id))
        .group_by(Order.customer_id)
        .all()
    )
    courier_counts = dict(
        db.query(Order.courier_id, func.count(Order.id))
        .filter(Order.courier_id.is_not(None))
        .group_by(Order.courier_id)
        .all()
    )

    return [
        _serialize_user(user, customer_counts.get(user.id, 0) + courier_counts.get(user.id, 0))
        for user in users
    ]


@router.get("/admin/pricing-rules")
def admin_pricing_rules(db: Session = Depends(get_db)):
    rules = db.query(PricingRule).order_by(PricingRule.zone.asc()).all()
    return [
        {
            "id": rule.id,
            "zone": rule.zone,
            "base_fee_sos": rule.base_fee_sos,
            "per_km_sos": rule.per_km_sos,
            "surge_multiplier": rule.surge_multiplier,
            "cod_fee_sos": rule.cod_fee_sos,
            "active": rule.active,
        }
        for rule in rules
    ]


@router.patch("/admin/pricing-rules/{rule_id}")
def admin_update_pricing_rule(rule_id: int, payload: PricingRuleUpdate, db: Session = Depends(get_db)):
    rule = db.query(PricingRule).filter(PricingRule.id == rule_id).first()
    if not rule:
        raise HTTPException(status_code=404, detail="Pricing rule not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(rule, field, value)

    db.commit()
    db.refresh(rule)
    return {
        "id": rule.id,
        "zone": rule.zone,
        "base_fee_sos": rule.base_fee_sos,
        "per_km_sos": rule.per_km_sos,
        "surge_multiplier": rule.surge_multiplier,
        "cod_fee_sos": rule.cod_fee_sos,
        "active": rule.active,
    }
