# Security

## Content Security Policy (CSP)

Defined in `next.config.mjs`. Policy by directive:

| Directive | Sources |
|-----------|---------|
| `default-src` | `'self'` |
| `script-src` | `'self' 'unsafe-inline'` + CDNs (jQuery, jsDelivr, cdnjs), Smartsupp, Supabase |
| `style-src` | `'self' 'unsafe-inline'` + CDNs, Smartsupp |
| `img-src` | `'self' data: blob:` + Supabase, cdnjs |
| `font-src` | `'self' data:` + CDNs, Google Fonts |
| `connect-src` | `'self'` + Supabase, Smartsupp (wss + https) |
| `frame-src` | `'self'` + Smartsupp |
| `worker-src` | `'self' blob:` |
| `base-uri` | `'self'` |
| `form-action` | `'self'` |

## Other Headers

- HSTS: `max-age=63072000; includeSubDomains; preload`
- X-Frame-Options: `DENY`
- X-Content-Type-Options: `nosniff`
- Referrer-Policy: `strict-origin-when-cross-origin`
- Permissions-Policy: camera/mic disabled, geolocation restricted to self

## GDPR Cookie Consent

- Component: `components/CookieConsent.tsx`
- Storage: localStorage key `nexatrack_cookie_consent`
- Values: `"accepted"` or `"rejected"`
- Banner appears on first visit, offers Accept + Reject
- No cookies set until user accepts

## Auth Security

- Supabase Auth (email/password)
- Row-Level Security (RLS) on Supabase tables
- Role-based access (admin/merchant/driver) via database roles
- Session management via Supabase cookies

## Email Security

- SMTP with TLS (port 465)
- Form submissions sent to `Info@nexatrackcourierservices.com`
- No user data exposed in email headers
