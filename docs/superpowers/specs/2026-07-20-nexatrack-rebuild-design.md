# Nexatrack Courier OS Rebuild — Design Spec

## Stack
- **Next.js 14 App Router** (React Server Components)
- **shadcn/ui** + Tailwind CSS v4 (all responsive mobile/tablet/desktop)
- **Supabase** (Postgres DB, Auth, Storage, Realtime)
- **Stripe** (payment processing — pay-as-you-go)
- **Twilio** (SMS — pay-per-message)
- **Resend** (email — 100/day free)
- **Google Maps API** (tracking maps — $200/mo free credit)
- **Vercel** (hosting — free tier)
- **next-intl** (English + Spanish i18n)
- **jsbarcode** (barcode label generation)

## Project Structure
```
nexatrack/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── (public)/
│   │   ├── tracking/
│   │   ├── about/
│   │   ├── services/
│   │   ├── contact/
│   │   ├── quote/
│   │   ├── faq/
│   │   └── blog/
│   ├── (admin)/              # Admin dashboard (role: admin)
│   ├── (merchant)/           # Merchant portal (role: merchant)
│   ├── driver/               # Driver mobile web app (role: driver)
│   ├── api/                  # API routes (webhooks, edge functions)
│   └── auth/                 # Login, register, callback
├── components/
│   ├── ui/                   # shadcn/ui primitives
│   ├── admin/                # Admin panel components
│   ├── merchant/             # Merchant components
│   ├── driver/               # Driver components
│   └── public/               # Public site components
├── lib/
│   ├── supabase-server.ts    # Server Supabase client
│   ├── supabase-browser.ts   # Browser Supabase client
│   ├── stripe.ts             # Stripe helpers
│   ├── utils.ts              # Shared utils
│   └── i18n.ts              # next-intl config
├── messages/
│   ├── en.json               # English strings
│   └── es.json               # Spanish strings
├── supabase/
│   ├── migrations/
│   └── seed.sql
└── public/
    └── img/
```

## Database Schema (Supabase)

### Users & Auth
- `profiles` — id (FK auth.users), email, name, phone, role (admin|merchant|driver), avatar, branch_id, created_at

### Core Operations
- `parcels` — id, tracking_number (unique), status (pending|picked_up|in_transit|out_for_delivery|delivered|exception), sender_name, sender_phone, sender_address, receiver_name, receiver_phone, receiver_address, origin_city, destination_city, weight, dimensions, service_type, delivery_charge, cod_amount, payment_status, notes, barcode_url, driver_id (FK profiles), merchant_id (FK profiles), branch_id, created_at, updated_at
- `tracking_events` — id, parcel_id (FK), status, title, description, location, lat, lng, photo_url, event_time, created_at
- `pickup_requests` — id, merchant_id (FK), address, city, preferred_date, preferred_time, status (pending|assigned|completed|cancelled), driver_id, notes, created_at

### Financial
- `wallets` — id, merchant_id (FK unique), balance, created_at
- `transactions` — id, wallet_id (FK), type (credit|debit|payout), amount, reference, stripe_payment_intent_id, description, created_at
- `invoices` — id, merchant_id (FK), total, status (pending|paid|overdue|processing), period_start, period_end, line_items (JSON), created_at

### People & Branches
- `branches` — id, name, address, city, state, phone, email, manager_id (FK), status (active|inactive), created_at

### Settings & Support
- `settings` — id, key (unique), value (JSONB)
- `support_tickets` — id, merchant_id (FK), subject, message, status (open|replied|closed), created_at
- `ticket_replies` — id, ticket_id (FK), sender_id (FK), message, created_at

### Content
- `faqs` — id, question, answer, sort_order, created_at
- `subscribers` — id, email, created_at

### Existing (unchanged)
- `form_submissions`, `livechat_chats`, `livechat_messages`, `blocked_tokens`

## RLS Policies
- admins: full access on all tables
- merchants: CRUD own parcels, read own wallet/transactions/invoices, CRUD own tickets
- drivers: read assigned parcels, update status + insert tracking_events + upload POD
- public: insert form_submissions, insert livechat_messages, read tracking_events (by tracking_number)

## Admin Panel Screens (shadcn/ui sidebar layout)

### Sidebar Nav
Dashboard | Parcels | Pickups | Merchants | Drivers | Payments | Branches | Reports | Settings | Support | Chat | Leads

### Dashboard
- Stat cards: Active Parcels, Pending Pickups, Revenue Today, Active Drivers
- Chart.js: parcel status pie chart, weekly revenue line chart

### Parcels
- Data table with search/filter/sort (status, date range, branch, merchant)
- Create parcel form (sender info, receiver info, weight, service type, charges)
- Parcel detail view with: status timeline, tracking events, POD photo, map
- Status update workflow: Pending → Picked Up → In Transit → Out for Delivery → Delivered
- Print label with barcode (jsbarcode)
- Bulk status update checkbox selection

### Pickups
- List of pickup requests (merchant, address, date, time)
- Assign to driver dropdown
- Mark as completed

### Merchants
- Table of merchant customers (name, email, phone, parcels count, wallet balance)
- Merchant detail: parcels list, wallet transactions, invoices, COD charges
- Enable/disable wallet toggle
- View merchant invoices by period

### Drivers
- Table (name, branch, vehicle, status)
- View active deliveries for each driver
- Toggle active/inactive

### Payments
- Stripe transaction log (payment_intent_id, amount, status, date)
- Invoice list (pending → processing → paid)
- Manual payout form (select merchant, amount, notes)

### Branches
- CRUD for Florida branch locations (name, address, city, phone, email, manager)

### Reports
- Parcel status report (filter by date range + branch) → export CSV
- Merchant revenue report → export CSV
- Driver performance report (deliveries completed, on-time rate)
- Summary report (total parcels, revenue, charges)

### Settings
- Delivery charges (per service type, weight tiers, distance zones)
- SMS settings (Twilio account SID, auth token, from number)
- Email settings (Resend API key, from address)
- Payment gateway (Stripe publishable key, secret key, webhook secret)
- Google Maps API key
- General (brand name, logo, phone, address, WhatsApp number)

### Support
- Ticket list (subject, merchant, status, date)
- Click to view replies, type and send reply
- Close ticket

## Merchant Portal Screens

### Dashboard
- Parcel status counts, recent transactions, wallet balance card

### My Parcels
- Table of own shipments
- Create parcel form (sender, receiver, weight, service type)
- View tracking timeline per parcel
- Print label

### Wallet
- Balance display
- Transaction history (credit/debit/payout)
- Request payout (amount, confirm)

### Invoices
- Invoice list by period (pending/paid)
- Download PDF (generated server-side)
- Pay invoice via Stripe checkout

### Support
- Create ticket (subject, message)
- View replies

### Profile
- Update business name, phone, email, address
- Change password

## Driver Mobile Web View (PWA)

- Login with phone/password
- View assigned deliveries for the day
- Update status (Picked Up → In Transit → Out for Delivery → Delivered)
- Capture POD photo (browser camera API) and e-signature
- View route on Google Maps
- Mark delivery as completed

## Public Site (Landing Page)

### Nav
- Home | About | Services | Resources (dropdown: Tracking, Features, Quote) | Contact | Live Chat
- Sticky tracking input in header bar (small, one-line input + Track button)

### Hero
- "Florida's Fastest Courier — Same-Day Delivery Across the Sunshine State"
- CTA: Get a Quote / Track Your Parcel

### Services (5 cards)
- Same-Day Delivery, Express Shipping, International Shipping, Road Delivery, Bulk Logistics

### About / Features
- "Trusted courier service across Florida" (removed "Since 1990")
- Florida-Wide Coverage, Timely Delivery, 24/7 Support

### Quote Form
- Fields: name, phone, service type (Same-Day/Express/International), note
- Submit → Supabase edge function (same as current)

### Footer
- Address: Citrus Park, FL 11950 Sheldon Road, Tampa 33626
- Phone: +1 (506) 501-4402
- Email: info@nexatrack.com
- WhatsApp click-to-chat button (floating, all pages)
- Newsletter signup (email → form_submissions)
- Clean social links (replace # placeholders with real profiles or remove)

### Tracking Page
- Input + button to search by tracking number
- GET edge function → displays timeline, map, status badge
- Already works — keep as-is

### Chat Widget (unchanged from current)
- Live chat with Realtime messaging, auto-reply, admin panel chat section

## i18n (English + Spanish)
- `next-intl` detects browser language
- Nav toggle to switch
- Spanish translations for: public site pages, merchant portal, driver view
- Admin panel stays English

## Security
- Supabase RLS on all tables (row-level security)
- Supabase Auth for all authentication
- CSRF: Next.js built-in (server actions + API routes)
- XSS: React handles output encoding; shadcn/ui sanitizes inputs
- SQL injection: Supabase query builder (parameterized queries)
- Password hashing: handled by Supabase Auth (bcrypt)

## Deployment
- Vercel (free tier) — auto-deploys from git
- Custom domain purchased after launch
