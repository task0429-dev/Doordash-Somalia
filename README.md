# Dash

Dash is a Somalia-focused, multi-surface food delivery platform inspired by the shopping flow and usability patterns of modern delivery apps. This repository contains the customer experience, merchant portal, driver app, admin dashboard, and a FastAPI backend connected to Supabase/Postgres.

The project is designed around a premium mobile-first consumer experience with Somali-blue branding, multilingual customer UI, Somalia-aware mobile wallet checkout, and a role-based order lifecycle that moves from customer to merchant to courier to completion.

## What Is In This Repo

This repository includes:

- A customer-facing mobile-first food delivery frontend
- A merchant portal for orders and menu management
- A courier/driver app for dispatch acceptance and delivery progression
- An admin dashboard for overview, merchants, users, orders, and pricing
- A FastAPI backend with SQLAlchemy models and Supabase/Postgres connectivity
- Docker configuration for local and production-oriented backend deployment
- Capacitor Android and iOS wrappers for the customer app

## Product Scope

Dash currently covers these core flows:

- Splash and onboarding
- Customer home marketplace
- Search and category browsing
- Restaurant detail pages
- Item detail modal and cart flow
- Checkout
- Order tracking
- Profile, addresses, favorites, and Prime membership
- Merchant order acceptance
- Merchant menu CRUD
- Courier dispatch queue and delivery progression
- Admin metrics, orders, merchants, users, and pricing rule management

## Brand Direction

Dash is styled as a Somalia-first delivery app with:

- A Somali-flag-inspired light blue and white identity
- A dark premium UI theme
- A star motif used as a subtle brand mark
- Mobile-first layouts with rounded cards, modern spacing, and soft-glow accents
- A familiar delivery-app browsing flow without copying DoorDash branding or assets

## Current Architecture

### Frontend apps

- `apps/customer_app`
  - Customer-facing marketplace and checkout
  - React + TypeScript + Vite
  - Capacitor-enabled for Android and iOS packaging
- `apps/merchant_portal`
  - Merchant dashboard, orders, menu, and settings
  - React + TypeScript + Vite
- `apps/driver_app`
  - Courier queue, active delivery, and status timeline
  - React + TypeScript + Vite
- `apps/admin_dashboard`
  - Admin metrics, merchants, users, orders, pricing, settings
  - React + TypeScript + Vite

### Backend

- `backend`
  - FastAPI application
  - SQLAlchemy ORM
  - Psycopg/Postgres driver
  - Redis config support
  - Supabase public/server config exposure
  - Security headers middleware
  - Order, menu, and admin API routes

## Repo Structure

```text
.
├─ apps/
│  ├─ admin_dashboard/
│  ├─ customer_app/
│  ├─ driver_app/
│  └─ merchant_portal/
├─ backend/
│  ├─ app/
│  │  ├─ api/
│  │  ├─ core/
│  │  ├─ models/
│  │  ├─ schemas/
│  │  └─ services/
│  ├─ scripts/
│  ├─ Dockerfile
│  ├─ requirements.txt
│  └─ .env.example
├─ docker-compose.yml
├─ docker-compose.prod.yml
└─ README.md
```

## Local App URLs

Frontend Vite ports:

- Customer app: `http://localhost:5173`
- Merchant portal: `http://localhost:5174`
- Admin dashboard: `http://localhost:5175`
- Driver app: `http://localhost:5176`

Backend:

- Docker compose default backend port: `http://localhost:8000`
- Current frontend default API base in code: `http://127.0.0.1:8010`

Important:

- The frontend apps currently default to `http://127.0.0.1:8010` in their API clients.
- If your backend is running on `8000`, set `VITE_API_BASE_URL=http://127.0.0.1:8000` in each frontend app environment, or update the client config.

## Technology Stack

### Frontend

- React 18
- TypeScript
- Vite
- Capacitor for mobile packaging in the customer app
- CSS with custom design system variables and mobile-first layout rules

### Backend

- FastAPI
- SQLAlchemy
- Psycopg 3
- Pydantic v2
- Redis client
- Python dotenv
- Structlog
- Prometheus client
- Sentry SDK

## Customer App

Location: `apps/customer_app`

### Main screens

- Splash / onboarding
- Home
- Search
- Category results
- Restaurant detail
- Item detail modal
- Cart
- Checkout
- Order tracking
- Profile / account
- Saved addresses
- Prime membership

### Core customer experience features

- Dark premium Somalia-first visual design
- Brand title `Dash`
- Language switcher in the upper right
- Supported languages:
  - Somali
  - English
  - Swahili
  - Arabic
  - Oromo
  - French
- Locale-aware font scaling and overflow handling
- Restaurant discovery with cards, promos, categories, and featured sections
- Search suggestions and filters
- Menu browsing with item customization
- Cart and checkout summary
- Phone-wallet-first payment UX for Somalia
- Order tracking with timeline feel
- Saved addresses and profile sections
- Prime membership page

### Mobile packaging

The customer app includes Capacitor scaffolding:

- Android project: `apps/customer_app/android`
- iOS project: `apps/customer_app/ios`
- Capacitor config: `apps/customer_app/capacitor.config.ts`

Scripts:

- `npm run build:mobile`
- `npm run cap:sync`
- `npm run cap:android`
- `npm run cap:ios`

## Merchant Portal

Location: `apps/merchant_portal`

### Screens

- Dashboard
- Orders
- Menu
- Settings

### Functionality

- Merchant order listing
- Merchant acceptance flow
- Live data fetching from backend
- Merchant menu CRUD against backend menu endpoints

## Driver App

Location: `apps/driver_app`

### Screens / capabilities

- Available dispatch queue
- Active delivery card
- Status timeline/history
- Accept dispatch
- Mark picked up
- Mark delivered
- Mark COD collected

The driver app uses the seeded courier identity:

- `courier@demo.so`

## Admin Dashboard

Location: `apps/admin_dashboard`

### Screens

- Dashboard
- Merchants
- Orders
- Users
- Pricing
- Settings

### Functionality

- Overview metrics
- Recent orders
- Merchant list
- User list
- Pricing rule listing and updates
- Live data connection to the backend admin endpoints

## Backend

Location: `backend`

### Main entrypoint

- `backend/app/main.py`

### Backend responsibilities

- Database connection and health check
- Supabase public config exposure
- Order lifecycle endpoints
- Merchant menu endpoints
- Admin analytics/config endpoints
- Security headers middleware
- CORS policy setup
- SQLAlchemy table initialization at startup

### Registered API groups

- Orders
- Menu
- Admin

## API Endpoints

### Public/system

- `GET /health`
- `GET /api/config/public`

### Customer order endpoints

- `POST /api/customer/orders`
- `GET /api/customer/orders?customer_email=...`

### Merchant endpoints

- `GET /api/merchant/orders?merchant_email=...`
- `POST /api/merchant/orders/{order_id}/accept?merchant_email=...`
- `GET /api/merchant/menu?merchant_email=...`
- `POST /api/merchant/menu?merchant_email=...`
- `PATCH /api/merchant/menu/{item_id}?merchant_email=...`
- `DELETE /api/merchant/menu/{item_id}?merchant_email=...`

### Courier endpoints

- `GET /api/courier/dispatch/available?courier_email=...`
- `POST /api/courier/orders/{order_id}/accept?courier_email=...`
- `POST /api/courier/orders/{order_id}/pickup?courier_email=...`
- `POST /api/courier/orders/{order_id}/deliver?courier_email=...`
- `POST /api/courier/orders/{order_id}/cod-collected?courier_email=...`

### Order timeline

- `GET /api/orders/{order_id}/events`

### Admin endpoints

- `GET /api/admin/overview`
- `GET /api/admin/orders`
- `GET /api/admin/merchants`
- `GET /api/admin/users`
- `GET /api/admin/pricing-rules`
- `PATCH /api/admin/pricing-rules/{rule_id}`

## Data Model Summary

The backend currently includes models for:

- `User`
  - stores role-based identities such as customer, merchant, courier
- `Order`
  - tracks financials, delivery state, and ownership
- `OrderStatusEvent`
  - timeline of state changes
- `PricingRule`
  - base fee, per-km fee, COD fee, surge, active zone config
- `MerchantMenuItem`
  - merchant-owned menu items
- `AuditLog`
  - backend audit trail for key actions

## Order Lifecycle

The main order flow is:

1. Customer creates an order
2. Merchant accepts the order
3. Order enters dispatching
4. Courier accepts the dispatch
5. Courier marks pickup
6. Courier marks delivery
7. If COD:
   - courier marks cash collected
8. If non-COD:
   - backend auto-completes after delivery

Important payment behavior in the backend:

- COD orders start with `payment_status = UNPAID`
- Non-COD orders start with `payment_status = PAID`
- Non-COD orders auto-complete when delivered

## Payments in Somalia

The customer experience is designed around Somalia-style phone wallet flows rather than card-first checkout.

Wallets represented in the UI:

- Hormuud EVC Plus
- Somtel eDahab
- Golis SAHAL
- Telesom ZAAD
- Cash on delivery

Current status:

- The frontend supports a Somalia-phone-wallet-style checkout experience.
- The backend supports payment method selection and COD vs non-COD logic.
- Real wallet gateway integration is not yet implemented in this repository.
- Stripe is not the live customer-facing wallet method here.
- A realistic production path would be:
  - collect money through Somali mobile money rails or a local PSP
  - settle/consolidate through a supported backend financial architecture

## Localization

The customer app supports runtime locale switching through `useLanguage.tsx`.

Supported languages:

- Somali
- English
- Swahili
- Arabic
- Oromo
- French

Localization includes:

- UI labels
- navigation
- checkout copy
- category copy
- home/marketing copy
- tracking labels
- selected phrase translation coverage

The UI also includes locale-specific typography scaling and overflow hardening for longer languages and RTL support for Arabic.

## Design System and UX Notes

The customer app is intentionally:

- dark themed
- premium
- mobile first
- image forward
- card based
- rounded and spacious without becoming empty
- structured around a modern delivery browsing flow

Current customer-home emphasis:

- strong top hero
- search action
- live counts / discovery cards
- promo carousel
- categories
- featured restaurants
- fast delivery
- top rated
- offers
- groceries
- recent orders

## Demo Identities

These demo emails are used across the seeded experience:

- Customer: `customer@demo.so`
- Merchant: `merchant@demo.so`
- Courier: `courier@demo.so`
- Admin: `admin@demo.so`

Additional seeded merchants are created by the seed script with Somalia-specific merchant records and menu items.

## Seed Data

Seed script:

- `backend/scripts/seed_merchants.py`

What it seeds:

- Somalia-specific merchants
- Demo merchant menu items
- Mogadishu-oriented locations and categories

Example merchants seeded:

- Xawaash Table
- Pizza House - KM4
- Al Bait Somali Restaurant
- Starbucks Mogadishu
- KFC Mogadishu
- Banadir Foods & Catering

## Environment Variables

Example file:

- `backend/.env.example`

Variables:

```env
DATABASE_URL=postgresql://postgres.YOUR_PROJECT_REF:YOUR_PASSWORD@aws-0-YOUR_REGION.pooler.supabase.com:5432/postgres
REDIS_URL=redis://redis:6379/0
APP_NAME=Dash API
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Do not commit:

- real Supabase keys
- real service role key
- real database URL
- local backend `.env`

## Supabase

This backend is wired to work with Supabase Postgres and public/server configuration.

Current usage in the codebase:

- Postgres connection through `DATABASE_URL`
- Supabase public config endpoint
- Supabase server config awareness in health/config

What is not fully implemented yet:

- real Supabase Auth end to end
- row-level security strategy for the frontend clients
- full production auth/session model

## Security

The backend sets these headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

Other security-related behavior:

- CORS is explicitly configured
- Customer order creation is rate-limited
- Audit logging is written for key state transitions
- Order status changes are preserved as timeline events

## Local Development

### Prerequisites

- Node.js 18+ recommended
- npm
- Python 3.11 recommended
- Docker Desktop optional but useful
- Supabase project if using live hosted Postgres

### Install frontend dependencies

Run inside each app you want to work on:

```powershell
cd apps/customer_app
npm install
```

Repeat for:

- `apps/customer_app`
- `apps/merchant_portal`
- `apps/admin_dashboard`
- `apps/driver_app`

### Run frontend apps

Customer:

```powershell
cd apps/customer_app
npm run dev
```

Merchant:

```powershell
cd apps/merchant_portal
npm run dev
```

Admin:

```powershell
cd apps/admin_dashboard
npm run dev
```

Driver:

```powershell
cd apps/driver_app
npm run dev
```

### Backend setup with Python

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` from the example and then run:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

If you want to match the current frontend defaults exactly, run on `8010` or set `VITE_API_BASE_URL`.

Example:

```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8010 --reload
```

### Seed merchants

```powershell
cd backend
.venv\Scripts\Activate.ps1
python scripts/seed_merchants.py
```

## Docker

### Development compose

`docker-compose.yml` includes:

- `api`
- `postgres`
- `redis`

Run:

```powershell
docker compose up --build
```

### Production-oriented compose override

`docker-compose.prod.yml` adds:

- production-style API command
- worker count
- restart policies
- production env file reference

Run:

```powershell
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Frontend Scripts

### Customer app

- `npm run dev`
- `npm run build`
- `npm run build:mobile`
- `npm run cap:sync`
- `npm run cap:android`
- `npm run cap:ios`
- `npm run lint`
- `npm run typecheck`
- `npm run preview`

### Merchant, admin, driver apps

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run preview`

## Current Production Readiness

What is in strong shape:

- UI system and visual direction
- customer browsing flow
- merchant live order flow
- courier delivery progression
- admin live metrics and pricing editing
- backend order lifecycle
- Supabase/Postgres connectivity
- mobile wrapper generation for the customer app

What still needs work before a true store-ready production launch:

- real customer auth
- production role/permission model
- live Somalia mobile wallet gateway integration
- production secrets management
- CI/CD
- app signing
- store assets and metadata
- privacy policy / legal pages
- production monitoring and error budgets

## Known Limitations

- Authentication is still demo-oriented rather than full production auth.
- The payment UX is realistic, but real wallet processors are not integrated.
- The backend creates tables on startup instead of using a formal migration workflow.
- The frontend apps are not organized as a monorepo workspace; each app manages its own npm install.
- The frontend API defaults point to `8010`, while Docker defaults expose `8000`.
- Some seeded merchant names are placeholders from global brands and should be replaced before production launch.

## Suggested Next Steps

1. Standardize the API port across local, Docker, and frontend clients
2. Add real auth with Supabase Auth or another identity layer
3. Implement a formal migration system such as Alembic
4. Replace placeholder/global merchant branding with production-safe local content
5. Integrate a real Somalia mobile money payment rail
6. Add CI, tests, deployment automation, and environment separation
7. Finalize native app branding, signing, and store submission assets

## Notes For Contributors

- Keep secrets out of Git
- Do not commit real `.env` files
- Use the existing dark premium design system in the customer app unless intentionally redesigning it
- Preserve the Somalia-first product direction
- Keep the customer experience consumer-facing and avoid turning it into an enterprise dashboard

## License

No license file is currently included in this repository. Add one before public/open distribution.
