from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models.menu import MerchantMenuItem
from app.models.user import User
from app.schemas.menu import MerchantMenuItemCreate, MerchantMenuItemOut, MerchantMenuItemUpdate

router = APIRouter(prefix="", tags=["menu"])


def _merchant_by_email(db: Session, merchant_email: str) -> User:
    merchant = db.query(User).filter(User.email == merchant_email, User.role == "merchant").first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found")
    return merchant


def _merchant_menu_item(db: Session, item_id: int) -> MerchantMenuItem:
    item = db.query(MerchantMenuItem).filter(MerchantMenuItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item


@router.get("/merchant/menu", response_model=list[MerchantMenuItemOut])
def list_merchant_menu(merchant_email: str = Query(...), db: Session = Depends(get_db)):
    merchant = _merchant_by_email(db, merchant_email)
    return (
        db.query(MerchantMenuItem)
        .filter(MerchantMenuItem.merchant_id == merchant.id)
        .order_by(MerchantMenuItem.created_at.asc())
        .all()
    )


@router.post("/merchant/menu", response_model=MerchantMenuItemOut)
def create_merchant_menu_item(
    payload: MerchantMenuItemCreate,
    merchant_email: str = Query(...),
    db: Session = Depends(get_db),
):
    merchant = _merchant_by_email(db, merchant_email)
    item = MerchantMenuItem(
        merchant_id=merchant.id,
        name=payload.name.strip(),
        price_sos=payload.price_sos,
        is_active=payload.is_active,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.patch("/merchant/menu/{item_id}", response_model=MerchantMenuItemOut)
def update_merchant_menu_item(
    item_id: int,
    payload: MerchantMenuItemUpdate,
    merchant_email: str = Query(...),
    db: Session = Depends(get_db),
):
    merchant = _merchant_by_email(db, merchant_email)
    item = _merchant_menu_item(db, item_id)
    if item.merchant_id != merchant.id:
        raise HTTPException(status_code=403, detail="Merchant cannot update this menu item")

    updates = payload.model_dump(exclude_unset=True)
    for field, value in updates.items():
        setattr(item, field, value.strip() if field == "name" and isinstance(value, str) else value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/merchant/menu/{item_id}")
def delete_merchant_menu_item(item_id: int, merchant_email: str = Query(...), db: Session = Depends(get_db)):
    merchant = _merchant_by_email(db, merchant_email)
    item = _merchant_menu_item(db, item_id)
    if item.merchant_id != merchant.id:
        raise HTTPException(status_code=403, detail="Merchant cannot delete this menu item")

    db.delete(item)
    db.commit()
    return {"success": True}
