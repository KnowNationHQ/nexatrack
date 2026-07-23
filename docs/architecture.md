# Architecture

## App Router Structure

```
app/
├── layout.tsx              Root layout (metadata, CookieConsent, Smartsupp)
├── opengraph-image.tsx     OG image (edge, 1200×630)
├── page.tsx                Landing page (LandingPage component)
├── about/page.tsx
├── contact/page.tsx
├── free-quote/page.tsx
├── privacy/page.tsx
├── service/page.tsx
├── track/page.tsx
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── admin/                  Portal: admin (17 list pages)
├── merchant/               Portal: merchant
├── driver/                 Portal: driver
└── api/
    └── send-email/route.ts Email API (nodemailer)
```

## Data Flow

1. **Public forms** (contact, quote, newsletter) → `POST /api/send-email` → nodemailer → SMTP → `Info@nexatrackcourierservices.com`
2. **Auth** → Supabase Auth (email/password) → session cookie → role-based route guards
3. **Tracking** → Supabase DB query by tracking ID → status + GPS coordinates → Leaflet map
4. **Portals** → Supabase queries → shadcn DataTable / MobileTable UI

## Key Components

| Component | Purpose |
|-----------|---------|
| `page-shell.tsx` | Bootstrap nav/footer, CDN injection, newsletter form |
| `landing-page.tsx` | Carousel, services, features, quote form |
| `CookieConsent.tsx` | GDPR banner with accept/reject |
| `mobile-table.tsx` | Responsive card layout on mobile, datatable on desktop |

## Security Headers

All set in `next.config.mjs` via `async headers()`:

- HSTS (max-age=63072000, preload)
- CSP (self + CDNs + Smartsupp + Supabase)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (camera, mic, geolocation restricted)
