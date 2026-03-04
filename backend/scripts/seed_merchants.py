"""
Seed Somalia-specific merchants for DoorDash Somalia MVP
Creates popular Mogadishu restaurants with location data
"""
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.db import SessionLocal
from app.models.user import User


def run_seed():
    db = SessionLocal()
    
    # Somalia-specific merchants (Mogadishu restaurants)
    merchants = [
        {
            "email": "pizza_house@demo.so",
            "phone": "+252615555555",
            "full_name": "Pizza House - KM4",
            "address": "KM4 Road, Mogadishu",
            "category": "Italian",
        },
        {
            "email": "al_bait@demo.so",
            "phone": "+252615666666",
            "full_name": "Al Bait Somali Restaurant",
            "address": "Makar Street, Mogadishu",
            "category": "Somali",
        },
        {
            "email": "starbucks_mogadishu@demo.so",
            "phone": "+252615777777",
            "full_name": "Starbucks Mogadishu",
            "address": "Airport Road, Mogadishu",
            "category": "Coffee",
        },
        {
            "email": "kfc_mogadishu@demo.so",
            "phone": "+252615888888",
            "full_name": "KFC Mogadishu",
            "address": "Sugar Factory Road, Mogadishu",
            "category": "Fast Food",
        },
        {
            "email": "banadir_foods@demo.so",
            "phone": "+252615999999",
            "full_name": "Banadir Foods & Catering",
            "address": "Bakara Market, Mogadishu",
            "category": "Somali",
        },
    ]

    for m in merchants:
        existing = db.query(User).filter(User.email == m["email"]).first()
        if not existing:
            db.add(User(
                role="merchant",
                email=m["email"],
                phone=m["phone"],
                full_name=m["full_name"]
            ))
            print(f"Added merchant: {m['full_name']}")

    db.commit()
    db.close()
    print("\nMerchants seed completed.")


if __name__ == "__main__":
    run_seed()
