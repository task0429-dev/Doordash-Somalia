from sqlalchemy import Boolean, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.db import Base


class PricingRule(Base):
    __tablename__ = "pricing_rules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    zone: Mapped[str] = mapped_column(String(60), unique=True, nullable=False, index=True)
    base_fee_sos: Mapped[int] = mapped_column(Integer, nullable=False, default=12000)
    per_km_sos: Mapped[int] = mapped_column(Integer, nullable=False, default=4000)
    surge_multiplier: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    cod_fee_sos: Mapped[int] = mapped_column(Integer, nullable=False, default=2000)
    active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
