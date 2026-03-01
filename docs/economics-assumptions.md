# Economics Assumptions - DoorDash for Somalia (MVP)

> **Status**: Draft — aligned with fixed-fee, COD-first, subscription-ready model
> **Branch**: `main`
> **Last Updated**: 2026-03-01

---

## 🎯 Core Pricing Model

| Parameter | Value (SOS) | USD (est.) | Rationale |
|---------|------------|----------|----------|
| Fixed Delivery Fee | 5,000 | $3.00 | Covers avg. fuel, wear, time. Affordable for urban users |
| COD Fee | 1,000 | $0.60 | Risk buffer for non-payment |
| Rider Cost per Delivery | 4,500 | $2.70 | Based on scooter ops in Mogadishu |
| Subscription Fee | 4,990 | $3.00 | < 1x delivery fee to drive adoption |
| Avg. Order Value | 25,000 | $15.00 | Food spend estimate for target market |

### Fee Rules
- **Fixed Fee Mode**: Enabled (MVP requirement)
- **Distance-based Pricing**: Configurable (`enableDistancePricing`), off by default
- **Surge Pricing**: Configurable (`enableSurgePricing`), off by default
- **Subscribers**: Delivery fee = 0, COD fee still applies unless waived

---

## 📊 KPI Baseline

| KPI | Value | Notes |
|-----|------|-------|
| Contribution Margin / Order | 2,000 SOS ($1.20) | = (Delivery + COD fees) - Rider cost |
| Delivery Fee Coverage Ratio | 111% | = Delivery fee / Rider cost (5,000 / 4,500) |
| Target Cancellation Rate | 15% | High in COD markets |
| Non-Payment Rate | 8% | Field-based risk estimate |
| Free-Delivery Subscribers | TBC | Goal: 5-10% of active users in 6mo |

> **Note**: Platform does not take cut of subtotal in MVP — margin comes from fees only.

---

## 🛑 Risks & Blockers

1. **COD Risk Exposure**
   - High non-payment rate could erode margin
   - Mitigation: COD fee, user reputation scoring (future)

2. **Rider Retention**
   - Rider pay marginally below market? → may affect supply
   - Mitigation: Volume incentives (future)

3. **Affordability Cap**
   - Max order value set at 100,000 SOS to prevent misuse
   - May limit high-value orders

---

## ✅ Next Steps

1. Integrate `calculateOrderTotal` into order service
2. Add `fee_breakdown` to API response schema
3. Write unit tests for edge cases (0 subtotal, subscription, COD)
4. Monitor early margin performance in pilot zones