# Email Templates — Design Spec

## Summary
Unified branded HTML email template library for all Nexatrack customer-facing communications.

## Architecture
- **`lib/email-templates.ts`** — all template functions + shared `htmlWrap()` wrapper with brand header/footer. Every function returns `{ subject, html }`.
- **`lib/email.ts`** — existing transport helper (unchanged)
- **`app/api/send-email/route.ts`** — refactored to import from templates lib
- **Existing API routes** (`update-shipment-status`, `add-merchant`, `add-driver`) fire new templates as needed

## Templates

### Shared Wrapper (`htmlWrap(body)`)
Red (#FF3E41) header bar → white content area → dark footer with address/phone/website. Inline CSS only.

### Tracking & Status
| Function | Trigger | Key Elements |
|----------|---------|-------------|
| `trackingUpdate({ name, trackingNumber, status, statusLabel, origin, dest, eta, trackUrl })` | Status change in `update-shipment-status` | Status badge pill, origin→dest, ETA, CTA "Track Shipment" |
| `deliveryConfirmed({ name, trackingNumber, podPhotoUrl, podSignatureUrl, dest, deliveredAt })` | Status set to `delivered` | Green "Delivered!" hero, photo/signature, delivery time+location |

### Transactional
| Function | Trigger | Key Elements |
|----------|---------|-------------|
| `invoiceReceipt({ name, trackingNumber, amount, paidAt, invoiceUrl })` | Paid shipment creation | Table: Amount, Date, Tracking #, Status: Paid, CTA "View Invoice" |
| `walletTopUp({ name, amount, newBalance, date })` | Wallet top-up | Top-up amount, new balance, confirmation |

### Account Lifecycle
| Function | Trigger | Key Elements |
|----------|---------|-------------|
| `welcomeMerchant({ name, email, loginUrl })` | Merchant added via `/api/admin/add-merchant` | Welcome, login guide, what they can do, CTA |
| `welcomeDriver({ name, email, loginUrl })` | Driver added via `/api/admin/add-driver` | Welcome to fleet, app guide, CTA |
| `passwordReset({ name, resetUrl })` | Forgot password flow | Reset link, expiry note, CTA |

### Existing (moved into library)
`visitorContact(name, subject)`, `visitorQuote(name)`, `adminContact(name, email, subject, message)`, `adminQuote(name, email, mobile, serviceType, message)`, `newsletterNotification(email)`

## Integration Plan
1. Create `lib/email-templates.ts` with `htmlWrap` + all template functions
2. Refactor `send-email/route.ts` to import from library
3. Update `update-shipment-status/route.ts` — use `trackingUpdate` on status change, `deliveryConfirmed` on "delivered"
4. Update `admin/add-merchant/route.ts` — fire `welcomeMerchant`
5. Update `admin/add-driver/route.ts` — fire `welcomeDriver`
6. Add `invoiceReceipt` to client-side after shipment creation (deferred if payment flow unclear)

## Visual Style
- shadcn-inspired: clean spacing, subtle dividers, muted labels (#888), dark values (#333)
- CTA buttons: #FF3E41, 8px rounded, white text, centered, inline block
- Status badges: inline colored pills
- All inline CSS for email client compatibility
