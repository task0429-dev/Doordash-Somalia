from app.models.pricing import PricingRule


def calculate_fees(subtotal_sos: int, distance_km: float, rule: PricingRule, *, include_cod_fee: bool = True) -> dict:
    distance_component = int(max(distance_km, 0) * rule.per_km_sos)
    raw_delivery = rule.base_fee_sos + distance_component
    delivery_fee = int(raw_delivery * max(rule.surge_multiplier, 1.0))
    cod_fee = rule.cod_fee_sos if include_cod_fee else 0
    total = int(subtotal_sos) + delivery_fee + cod_fee

    return {
        "subtotal_sos": int(subtotal_sos),
        "delivery_fee_sos": delivery_fee,
        "surge_fee_sos": int(delivery_fee - raw_delivery),
        "cod_fee_sos": cod_fee,
        "total_sos": total,
    }
