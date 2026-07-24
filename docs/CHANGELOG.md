# Changelog

## 2026-07-24

### In Transit Filter Fix
- `app/api/db/route.ts`: Added `in:` query operator support for multi-status filtering
- `app/admin/shipments/transit/page.tsx`: Changed from single-status `eq` to `{ in: { status: TRANSIT_STATUSES } }` with 6 real pipeline statuses; added dynamic `STATUS_LABELS`/`STATUS_COLORS` badges

### Receipt / PDF Improvements
- `app/admin/shipments/[id]/page.tsx`:
  - Changed PDF imports from dynamic to static top-level
  - Added error toast in `shareAsPdf` catch block
  - Removed `navigator.share` path
  - Fixed anchor DOM append before `a.click()`, delayed URL.revokeObjectURL
  - Replaced all `color-mix()` CSS with `rgba()` equivalents for html2canvas compatibility
  - Professional styling: hardcoded colors (#111827, #dc2626, #6b7280), monospace tracking, red gradient accent bar, font stack
  - Moved PDF/Copy buttons outside `receiptRef` so they are excluded from PDF capture
  - Used `location.origin` instead of hardcoded production URL for QR tracking link

### Mobile Language Switcher
- `components/language-switcher.tsx`: Responsive layout — mobile hamburger menu now renders language options as horizontal pill row (`flex-wrap`) instead of absolute-positioned dropdown
- `components/page-shell.tsx`: Updated desktop wrapper to keep inline-flex layout

### Bug Audit — Batch Fix (7 bugs)
- `app/admin/layout.tsx`: Added 7 missing badge CSS variable pairs + `--accent`/`--accent-bg` for both dark and light themes
- `app/admin/page.tsx`: Fixed currency display — `toLocaleString()` → `toFixed(2)` (line 107)
- `app/admin/dispatch/page.tsx`: Added null guard on `setShipments(await db(...))` (line 84)
- `app/admin/shipments/new/page.tsx`: Fixed fragile tracking number generation — added `.padEnd(4, "0")` (line 41)
- `app/admin/shipments/[id]/page.tsx`: Replaced hardcoded production URL with `location.origin`
- `app/admin/shipments/pending/page.tsx`: Wrapped "New" button in `<Link>` + added import
- `next.config.mjs`: Added `wss://*.supabase.co` to CSP `connect-src`

### Notification System Fix
- `components/notification-bell.tsx`: Changed `.eq("user_id", user.id)` → `.eq("recipient_id", user.id)` (table column is `recipient_id`)
- `components/notifications-list.tsx`: Same column fix + `n.message || n.body` fallback for `message` column
- `app/api/notifications/read/route.ts`: Fixed double `req.json()` read (called twice, second would hang); fixed `user_id` → `recipient_id`

### Translator Desktop Redesign
- `components/language-switcher.tsx`: Redesigned desktop dropdown — button shows flag + language name + rotating chevron; dropdown has border-radius, shadow, checkmark on active item, CSS hover states (removed inline JS handlers); mobile pill-row styling preserved

### Global Error Boundary
- `components/error-boundary.tsx`: New class-based error boundary that catches client exceptions, logs error + component stack to console, shows friendly UI with reload button
- `app/layout.tsx`: Wrapped all pages with `ErrorBoundary`

### Email Redesign
- `app/api/send-email/route.ts`: Complete rewrite of email templates:
  - **Contact form**: Visitor receives branded confirmation with "What happens next?" timeline; admin receives formatted data table with clickable email
  - **Quote form**: Visitor receives quote-request confirmation with processing timeline; admin receives structured quote details table
  - **Newsletter**: Simple styled notification to admin
  - Both visitor + admin emails sent in parallel via `Promise.all()`
  - Inline CSS for email client compatibility
  - Brand red header, dark footer with address/phone/website

### Build & Deployment
- `vercel.json`: Restored with `"framework": "nextjs"` setting for reliable framework detection
