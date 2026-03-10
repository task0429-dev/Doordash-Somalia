"""
Seed Somalia-specific merchants for DoorDash Somalia MVP
Creates popular Mogadishu restaurants with location data
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.db import Base, SessionLocal, engine
from app.models.menu import MerchantMenuItem
from app.models.user import User


def run_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Somalia-specific merchants (Mogadishu restaurants)
    merchants = [
        {
            "email": "merchant@demo.so",
            "phone": "+252622222222",
            "full_name": "Xawaash Table",
            "address": "Taleex, Mogadishu",
            "category": "Somali",
            "menu": [
                ("Bariis combo", 22000),
                ("Suqaar flatbread wrap", 15500),
                ("Shaah & canjeero set", 9800),
            ],
        },
        {
            "email": "pizza_house@demo.so",
            "phone": "+252615555555",
            "full_name": "Pizza House - KM4",
            "address": "KM4 Road, Mogadishu",
            "category": "Italian",
            "menu": [
                ("Somali star pizza", 23400),
                ("White margherita", 18900),
            ],
        },
        {
            "email": "al_bait@demo.so",
            "phone": "+252615666666",
            "full_name": "Al Bait Somali Restaurant",
            "address": "Makar Street, Mogadishu",
            "category": "Somali",
            "menu": [
                ("Mandi chicken bowl", 20500),
                ("Charcoal beef platter", 24800),
            ],
        },
        {
            "email": "starbucks_mogadishu@demo.so",
            "phone": "+252615777777",
            "full_name": "Starbucks Mogadishu",
            "address": "Airport Road, Mogadishu",
            "category": "Coffee",
            "menu": [
                ("Iced qaxwo", 5200),
                ("Karak duo", 7000),
            ],
        },
        {
            "email": "kfc_mogadishu@demo.so",
            "phone": "+252615888888",
            "full_name": "KFC Mogadishu",
            "address": "Sugar Factory Road, Mogadishu",
            "category": "Fast Food",
            "menu": [
                ("Blue coast smash burger", 18500),
                ("Loaded fries", 7900),
            ],
        },
        {
            "email": "banadir_foods@demo.so",
            "phone": "+252615999999",
            "full_name": "Banadir Foods & Catering",
            "address": "Bakara Market, Mogadishu",
            "category": "Somali",
            "menu": [
                ("Fresh fruit crate", 15500),
                ("Mini baklava box", 13800),
            ],
        },
    ]

    for m in merchants:
        existing = db.query(User).filter(User.email == m["email"]).first()
        if not existing:
            existing = User(
                role="merchant",
                email=m["email"],
                phone=m["phone"],
                full_name=m["full_name"]
            )
            db.add(existing)
            print(f"Added merchant: {m['full_name']}")
            db.flush()

        for name, price_sos in m.get("menu", []):
            menu_item = (
                db.query(MerchantMenuItem)
                .filter(MerchantMenuItem.merchant_id == existing.id, MerchantMenuItem.name == name)
                .first()
            )
            if not menu_item:
                db.add(
                    MerchantMenuItem(
                        merchant_id=existing.id,
                        name=name,
                        price_sos=price_sos,
                        is_active=True,
                    )
                )

    db.commit()
    db.close()
    print("\nMerchants seed completed.")


if __name__ == "__main__":
    run_seed()
