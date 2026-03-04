import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.core.db import Base, SessionLocal, engine
from app.models import PricingRule, User


def run_seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    users = [
        ("customer", "customer@demo.so", "+252611111111", "Demo Customer"),
        ("merchant", "merchant@demo.so", "+252622222222", "Demo Merchant"),
        ("courier", "courier@demo.so", "+252633333333", "Demo Courier"),
        ("admin", "admin@demo.so", "+252644444444", "Demo Admin"),
    ]

    for role, email, phone, full_name in users:
        exists = db.query(User).filter(User.email == email).first()
        if not exists:
            db.add(User(role=role, email=email, phone=phone, full_name=full_name))

    default_rule = db.query(PricingRule).filter(PricingRule.zone == "default").first()
    if not default_rule:
        db.add(
            PricingRule(
                zone="default",
                base_fee_sos=12000,
                per_km_sos=4000,
                surge_multiplier=1.0,
                cod_fee_sos=2000,
                active=True,
            )
        )

    mog_rule = db.query(PricingRule).filter(PricingRule.zone == "mogadishu").first()
    if not mog_rule:
        db.add(
            PricingRule(
                zone="mogadishu",
                base_fee_sos=10000,
                per_km_sos=3500,
                surge_multiplier=1.0,
                cod_fee_sos=2000,
                active=True,
            )
        )

    db.commit()
    db.close()
    print("Seed completed.")


if __name__ == "__main__":
    run_seed()
