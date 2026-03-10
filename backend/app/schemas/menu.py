from datetime import datetime

from pydantic import BaseModel


class MerchantMenuItemCreate(BaseModel):
    name: str
    price_sos: int
    is_active: bool = True


class MerchantMenuItemUpdate(BaseModel):
    name: str | None = None
    price_sos: int | None = None
    is_active: bool | None = None


class MerchantMenuItemOut(BaseModel):
    id: int
    merchant_id: int
    merchant_email: str | None = None
    name: str
    price_sos: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
