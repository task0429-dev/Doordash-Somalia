from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    merchant_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    courier_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True, index=True)

    status: Mapped[str] = mapped_column(String(40), default="PLACED", nullable=False, index=True)
    payment_method: Mapped[str] = mapped_column(String(20), default="COD", nullable=False)
    payment_status: Mapped[str] = mapped_column(String(30), default="UNPAID", nullable=False)
    dropoff_address_text: Mapped[str] = mapped_column(String(255), nullable=False)

    subtotal_sos: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    delivery_fee_sos: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    surge_fee_sos: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    cod_fee_sos: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_sos: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    assigned_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    picked_up_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    delivered_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class OrderStatusEvent(Base):
    __tablename__ = "order_status_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False, index=True)
    from_status: Mapped[str] = mapped_column(String(40), nullable=False)
    to_status: Mapped[str] = mapped_column(String(40), nullable=False)
    actor_type: Mapped[str] = mapped_column(String(30), nullable=False)
    actor_id: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
