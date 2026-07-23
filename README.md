# Nexatrack Courier Services

**Florida's Fastest Courier** — Full-stack courier management platform serving Florida and the Southeast USA.

**Live:** https://nexatrackcourierservices.com

---

## Tech Stack

| Layer | Stack |
|-------|-------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v3 + Bootstrap 5 (template pages) + shadcn/ui (admin portals) |
| **Database** | Supabase (Postgres) |
| **Auth** | Supabase Auth |
| **Email** | Nodemailer (SMTP) |
| **Chat** | Smartsupp |
| **Icons** | Font Awesome 5, Lucide React |
| **Internationalization** | next-intl |
| **Deployment** | Vercel (auto-deploy from `main`) |

---

## Features

### Public Pages
- **Landing** — animated carousel, services overview, quote form, newsletter
- **Tracking** — real-time package tracking (tracking IDs: `NXT-1001`, `NXT-1002`, `NXT-1003`)
- **Free Quote** — request a shipping quote form
- **Contact** — contact form + Google Maps embed
- **Service/About/Features** — information pages

### Admin Portal (`/admin/*`)
Dashboard, shipments, dispatch, drivers, customers, merchants, pricing, service areas, fleet management, proof of delivery, invoices, wallet, tickets, settings

### Merchant Portal (`/merchant/*`)
Dashboard, shipments, wallet, tickets, chat, settings, payout requests

### Driver Portal (`/driver/*`)
Dashboard, my jobs, completed jobs, proof of delivery, payout requests

### Platform Features
- **Auth** — email/password registration + login, role-based (admin/merchant/driver)
- **Real-time tracking** — GPS location updates, status tracking (pending → picked up → in transit → delivered → confirmed)
- **Email notifications** — form submissions (contact, quote, newsletter) sent via SMTP
- **GDPR cookie consent** — accept/reject with localStorage persistence
- **Live chat** — Smartsupp widget
- **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Responsive** — mobile-first with touch targets (44px min), responsive grids, card-based mobile tables

---

## Project Structure

```
app/
  api/send-email/route.ts    — email endpoint (nodemailer)
  layout.tsx                 — root layout (metadata, CookieConsent, Smartsupp)
  opengraph-image.tsx        — OG image (edge runtime, 1200×630)
  page.tsx                   — landing page
  (public routes)            — about, contact, free-quote, privacy, service, track
  admin/                     — admin portal (17 list pages)
  merchant/                  — merchant portal
  driver/                    — driver portal
  auth/                      — login + register
components/
  page-shell.tsx             — shared Bootstrap nav/footer
  landing-page.tsx           — landing page content
  CookieConsent.tsx          — GDPR banner (accept/reject)
  mobile-table.tsx           — responsive card table
  ui/                        — shadcn/ui components
  (admin/merchant/driver)    — portal-specific components
public/
  favicon.svg                — SVG favicon (brand red "N")
  manifest.json              — PWA manifest
  img/                       — static images
next.config.mjs              — security headers, CSP, image domains
tailwind.config.ts           — Tailwind config with brand colors
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SMTP_HOST=your-smtp-host
SMTP_PORT=465
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-pass
SMTP_FROM=Nexatrack <noreply@nexatrackcourierservices.com>
```

All form submissions (contact, quote, newsletter) are sent to `Info@nexatrackcourierservices.com`.

---

## Setup

```bash
git clone https://github.com/KnowNationHQ/nexatrack.git
cd nexatrack
npm install
cp .env.example .env.local  # fill in your env vars
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Build

```bash
npm run build
npm start
```

---

## Deployment

Auto-deployed to **Vercel** on every push to `main`.

---

## Contact

- **Address:** Citrus Park, FL 11950 Sheldon Road. Tampa 33626
- **Phone:** [+1 (506) 501-4402](tel:+15065014402)
- **WhatsApp:** [+1 (506) 501-4402](https://wa.me/15065014402)
- **Email:** Info@nexatrackcourierservices.com
