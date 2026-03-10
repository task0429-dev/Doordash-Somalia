from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

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

    customer = relationship("User", foreign_keys=[customer_id])
    merchant = relationship("User", foreign_keys=[merchant_id])
    courier = relationship("User", foreign_keys=[courier_id])

    @property
    def customer_email(self) -> str | None:
        return self.customer.email if self.customer else None

    @property
    def customer_name(self) -> str | None:
        return self.customer.full_name if self.customer else None

    @property
    def merchant_email(self) -> str | None:
        return self.merchant.email if self.merchant else None

    @property
    def merchant_name(self) -> str | None:
        return self.merchant.full_name if self.merchant else None

    @property
    def courier_email(self) -> str | None:
        return self.courier.email if self.courier else None

    @property
    def courier_name(self) -> str | None:
        return self.courier.full_name if self.courier else None


class OrderStatusEvent(Base):
    __tablename__ = "order_status_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False, index=True)
    from_status: Mapped[str] = mapped_column(String(40), nullable=False)
    to_status: Mapped[str] = mapped_column(String(40), nullable=False)
    actor_type: Mapped[str] = mapped_column(String(30), nullable=False)
    actor_id: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
