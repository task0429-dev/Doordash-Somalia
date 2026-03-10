from datetime import datetime

from pydantic import BaseModel, EmailStr


class OrderPricing(BaseModel):
    subtotal_sos: int
    delivery_fee_sos: int
    surge_fee_sos: int
    cod_fee_sos: int
    total_sos: int


class OrderCreate(BaseModel):
    customer_email: EmailStr
    merchant_email: EmailStr
    dropoff_address_text: str
    subtotal_sos: int = 0
    distance_km: float = 1.0
    zone: str = "mogadishu"
    payment_method: str = "COD"


class OrderOut(BaseModel):
    id: int
    customer_id: int
    customer_email: EmailStr | None = None
    customer_name: str | None = None
    merchant_id: int
    merchant_email: EmailStr | None = None
    merchant_name: str | None = None
    courier_id: int | None
    courier_email: EmailStr | None = None
    courier_name: str | None = None
    status: str
    payment_method: str
    payment_status: str
    dropoff_address_text: str

    subtotal_sos: int
    delivery_fee_sos: int
    surge_fee_sos: int
    cod_fee_sos: int
    total_sos: int

    assigned_at: datetime | None = None
    picked_up_at: datetime | None = None
    delivered_at: datetime | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True
