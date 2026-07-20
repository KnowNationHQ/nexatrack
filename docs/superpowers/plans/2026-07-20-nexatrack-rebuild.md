# Nexatrack Courier OS — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Nexatrack as a Next.js + shadcn/ui + Supabase courier OS with admin panel, merchant portal, driver PWA, and clean USA-focused public site.

**Architecture:** Next.js 14 App Router monorepo at root. Existing static HTML files move to `public/` and serve alongside Next.js App Router routes. Admin/merchant/driver routes are role-gated via Supabase Auth + middleware. Supabase Postgres for all data, stripe for payments, Twilio for SMS, Resend for email.

**Tech Stack:** Next.js 14 App Router, shadcn/ui, Tailwind CSS v4, Supabase (DB/Auth/Storage/Realtime), Stripe, Twilio, Resend, next-intl, jsbarcode, Chart.js, Google Maps, Vercel

## Global Constraints

- All existing static HTML/CSS/JS files must remain functional throughout the transition
- Supabase project `ujcokrzjvjdrcrdhcnjy` is the production database — never run migrations against the wrong project
- shadcn/ui components initialized via `npx shadcn@latest init`
- All new pages must be responsive mobile-first (mobile, tablet, desktop)
- i18n for English + Spanish (next-intl)
- RLS policies on every new table
- No new paid subscriptions beyond existing Supabase + Vercel free tiers
- Stripe transactions pay-as-you-go only
- Twilio and Resend pay-per-use only

---

## Phase 0: Project Setup

### Task 0.1: Initialize Next.js + shadcn/ui

**Files:**
- Initialize: project root (package.json, next.config.ts, tsconfig.json, tailwind.config.ts, postcss.config.mjs)
- Create: `app/layout.tsx`, `app/page.tsx`
- Create: `components/ui/` (shadcn primitives)
- Create: `lib/utils.ts`

**Interfaces:**
- Consumes: nothing
- Produces: Next.js dev server at `localhost:3000`, shadcn/ui component library available

- [ ] **Step 1: Initialize Next.js project**

```bash
cd C:\Users\hp\Desktop\Nexatrack
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm
```
Choose: No to `src/` directory, Yes to App Router, No to custom import alias (keep `@/*`)

- [ ] **Step 2: Install shadcn/ui and initialize**

```bash
npx shadcn@latest init
```
Choose: Default style, Neutral color, CSS variables for theme, `@/` alias

- [ ] **Step 3: Add shadcn/ui components needed across the app**

```bash
npx shadcn@latest add button input card table badge dialog dropdown-menu form label select sheet sidebar tabs toast
```

- [ ] **Step 4: Install additional dependencies**

```bash
npm install @supabase/supabase-js @supabase/ssr stripe next-intl chart.js react-chartjs-2 jsbarcode
npm install -D @types/jsbarcode
```

- [ ] **Step 5: Set up project folder structure**

```bash
mkdir -p components/admin components/merchant components/driver components/public
mkdir -p lib
mkdir -p messages
mkdir -p app/\(public\) app/\(admin\) app/\(merchant\) app/driver app/api app/auth
mkdir -p supabase/migrations
```

- [ ] **Step 6: Create `lib/utils.ts`**

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function generateTrackingNumber(): string {
  const prefix = 'NXT'
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}-${date}-${rand}`
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
```

- [ ] **Step 7: Set up `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ujcokrzjvjdrcrdhcnjy.supabase.co' },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 8: Move static HTML files to `public/`**

```bash
# Move all .html files except those in app/ to public/
# Vercel serves static files from public/ automatically
```

Actually — keep the existing files in place. Next.js will serve the root `index.html` if it exists in `public/`. But existing `about.html` would be at `/about.html` not `/about`. To avoid breaking existing links, add a `vercel.json` that rewrites:

```json
{
  "rewrites": [
    { "source": "/about", "destination": "/about.html" },
    { "source": "/service", "destination": "/service.html" },
    { "source": "/contact", "destination": "/contact.html" },
    { "source": "/quote", "destination": "/quote.html" },
    { "source": "/feature", "destination": "/feature.html" },
    { "source": "/tracking", "destination": "/tracking.html" },
    { "source": "/chatbot", "destination": "/chatbot.html" }
  ]
}
```

- [ ] **Step 9: Verify dev server works**

```bash
npm run dev
```
Expected: Next.js starts at localhost:3000, existing pages accessible at their URLs

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js with shadcn/ui, Supabase, project structure"
```

---

### Task 0.2: Set up Supabase client libraries

**Files:**
- Create: `lib/supabase-server.ts`
- Create: `lib/supabase-browser.ts`
- Create: `lib/supabase-admin.ts`

**Interfaces:**
- Produces: `createClient()` for server components, `createBrowserClient()` for client components, `createAdminClient()` for API routes with service_role

- [ ] **Step 1: Create `lib/supabase-server.ts`**

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  )
}
```

- [ ] **Step 2: Create `lib/supabase-browser.ts`**

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Create `lib/supabase-admin.ts`**

```typescript
import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

- [ ] **Step 4: Create `.env.local` with Supabase keys**

```
NEXT_PUBLIC_SUPABASE_URL=https://ujcokrzjvjdrcrdhcnjy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqY29rcnpqdmpkcmNyZGhjbmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNzA1MzksImV4cCI6MjA5OTk0NjUzOX0.SFgd7FP8lnkbIJ0CxoXXfD5-yo8XIyHGlOS_aK1J9-I
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://nexatrack.vercel.app
```

- [ ] **Step 5: Commit**

```bash
git add lib/supabase-*.ts .env.local
git commit -m "feat: add Supabase client library setup"
```

---

### Task 0.3: Database migrations

**Files:**
- Create: `supabase/migrations/20260720000001_create_profiles.sql`
- Create: `supabase/migrations/20260720000002_create_parcels.sql`
- Create: `supabase/migrations/20260720000003_create_financial.sql`
- Create: `supabase/migrations/20260720000004_create_branches.sql`
- Create: `supabase/migrations/20260720000005_create_support.sql`
- Create: `supabase/migrations/20260720000006_create_content.sql`
- Create: `supabase/migrations/20260720000007_create_rls.sql`
- Create: `supabase/migrations/20260720000008_seed_settings.sql`

- [ ] **Step 1: Create profiles table migration**

```sql
-- 20260720000001_create_profiles.sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'merchant' CHECK (role IN ('admin', 'merchant', 'driver')),
  avatar TEXT,
  branch_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 2: Create parcels + tracking_events + pickup_requests migration**

```sql
-- 20260720000002_create_parcels.sql
CREATE TABLE IF NOT EXISTS parcels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','picked_up','in_transit','out_for_delivery','delivered','exception')),
  sender_name TEXT NOT NULL,
  sender_phone TEXT,
  sender_address TEXT,
  receiver_name TEXT NOT NULL,
  receiver_phone TEXT,
  receiver_address TEXT,
  origin_city TEXT,
  destination_city TEXT,
  weight NUMERIC(10,2),
  dimensions TEXT,
  service_type TEXT CHECK (service_type IN ('same_day','next_day','express','international','bulk')),
  delivery_charge NUMERIC(10,2) DEFAULT 0,
  cod_amount NUMERIC(10,2) DEFAULT 0,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','cod')),
  notes TEXT,
  barcode_url TEXT,
  driver_id UUID REFERENCES profiles(id),
  merchant_id UUID REFERENCES profiles(id),
  branch_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parcel_id UUID NOT NULL REFERENCES parcels(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  photo_url TEXT,
  event_time TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES profiles(id),
  address TEXT NOT NULL,
  city TEXT,
  preferred_date DATE,
  preferred_time TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','assigned','completed','cancelled')),
  driver_id UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE parcels ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pickup_requests ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 3: Create financial tables migration**

```sql
-- 20260720000003_create_financial.sql
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit','debit','payout')),
  amount NUMERIC(10,2) NOT NULL,
  reference TEXT,
  stripe_payment_intent_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES profiles(id),
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue','processing')),
  period_start DATE,
  period_end DATE,
  line_items JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 4: Create branches table migration**

```sql
-- 20260720000004_create_branches.sql
CREATE TABLE IF NOT EXISTS branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'FL',
  phone TEXT,
  email TEXT,
  manager_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 5: Create support + settings + content tables migration**

```sql
-- 20260720000005_create_support.sql
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID NOT NULL REFERENCES profiles(id),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','replied','closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_replies ENABLE ROW LEVEL SECURITY;

-- 20260720000006_create_content.sql
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
```

- [ ] **Step 6: Create RLS policies migration**

```sql
-- 20260720000007_create_rls.sql
-- Admins can do everything
CREATE POLICY admin_all ON profiles FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Merchants can read/update own profile
CREATE POLICY merchant_self ON profiles FOR ALL TO authenticated
  USING (id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant')
  WITH CHECK (id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

-- Parcels: admins all, merchants own, drivers assigned
CREATE POLICY admin_parcels ON parcels FOR ALL TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY merchant_parcels ON parcels FOR ALL TO authenticated
  USING (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant')
  WITH CHECK (merchant_id = auth.uid() AND auth.jwt() ->> 'role' = 'merchant');

CREATE POLICY driver_parcels ON parcels FOR SELECT TO authenticated
  USING (driver_id = auth.uid() AND auth.jwt() ->> 'role' = 'driver');

CREATE POLICY driver_update_parcels ON parcels FOR UPDATE TO authenticated
  USING (driver_id = auth.uid() AND auth.jwt() ->> 'role' = 'driver')
  WITH CHECK (driver_id = auth.uid() AND auth.jwt() ->> 'role' = 'driver');

-- tracking_events: public can read by tracking number, authenticated can insert
CREATE POLICY public_tracking ON tracking_events FOR SELECT
  USING (true);

CREATE POLICY auth_insert_events ON tracking_events FOR INSERT TO authenticated
  WITH CHECK (true);

-- Similar RLS for all other tables (abbreviated here, full in migration file)
```

- [ ] **Step 7: Create seed settings migration**

```sql
-- 20260720000008_seed_settings.sql
INSERT INTO settings (key, value) VALUES
  ('delivery_charges', '[{"service":"same_day","base":15,"per_lb":2},{"service":"next_day","base":12,"per_lb":1.5},{"service":"express","base":25,"per_lb":3},{"service":"international","base":50,"per_lb":5},{"service":"bulk","base":100,"per_lb":8}]'),
  ('general', '{"brand":"Nexatrack","phone":"+1 (506) 501-4402","email":"info@nexatrack.com","address":"Citrus Park, FL 11950 Sheldon Road, Tampa 33626","whatsapp":"+15065014402"}'),
  ('sms_config', '{"provider":"twilio","enabled":false}'),
  ('email_config', '{"provider":"resend","enabled":false}')
ON CONFLICT (key) DO NOTHING;
```

- [ ] **Step 8: Apply all migrations to remote database**

```bash
cd C:\Users\hp\Desktop\Nexatrack
supabase db push
```
Expected: all 8 migrations apply successfully

- [ ] **Step 9: Commit**

```bash
git add supabase/migrations/
git commit -m "feat: create database schema with RLS policies"
```

---

## Phase 1: Auth Setup

### Task 1.1: Auth pages + middleware

**Files:**
- Create: `app/auth/login/page.tsx`
- Create: `app/auth/register/page.tsx`
- Create: `app/auth/callback/route.ts`
- Create: `middleware.ts`
- Create: `app/auth/register/actions.ts`

- [ ] **Step 1: Create middleware for route protection**

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: (cookies) => cookies.forEach(c => request.cookies.set(c.name, c.value)) } }
  )
  const { data: { user } } = await supabase.auth.getUser()

  const adminPaths = ['/admin']
  const merchantPaths = ['/merchant']
  const driverPaths = ['/driver']

  if (adminPaths.some(p => request.nextUrl.pathname.startsWith(p)) && !user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return supabaseResponse
}

export const config = { matcher: ['/admin/:path*', '/merchant/:path*', '/driver/:path*', '/auth/:path*'] }
```

- [ ] **Step 2: Create login page**

```typescript
// app/auth/login/page.tsx
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); return }
    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0715]">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle className="text-center text-2xl">Nexatrack <span className="text-[#FF3E41]">Admin</span></CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#FF3E41] hover:bg-[#d92e31]">Sign In</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add middleware.ts app/auth/ lib/supabase-*.ts
git commit -m "feat: add auth pages and route middleware"
```

---

## Phase 2: Admin Panel

### Task 2.1: Admin layout with sidebar

**Files:**
- Create: `app/(admin)/layout.tsx`
- Create: `components/admin/sidebar.tsx`
- Create: `app/(admin)/page.tsx`

- [ ] **Step 1: Create admin layout**

```typescript
// app/(admin)/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0a0715]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2: Create sidebar component with responsive behavior**
  - Desktop: fixed sidebar with nav items
  - Mobile: hamburger toggle with overlay, bottom nav bar
  - Nav: Dashboard, Parcels, Pickups, Merchants, Drivers, Payments, Branches, Reports, Settings, Support, Chat, Leads

- [ ] **Step 3: Create admin dashboard page**
  - Stat cards (active parcels, pending pickups, revenue, drivers)
  - Charts (parcel status pie, weekly revenue line)

- [ ] **Step 4: Commit**

```bash
git add app/\(admin\)/ components/admin/
git commit -m "feat: add admin layout with responsive sidebar"
```

### Task 2.2: Parcel management CRUD

**Files:**
- Create: `app/(admin)/parcels/page.tsx`
- Create: `app/(admin)/parcels/new/page.tsx`
- Create: `app/(admin)/parcels/[id]/page.tsx`
- Create: `components/admin/parcel-table.tsx`
- Create: `components/admin/parcel-form.tsx`
- Create: `components/admin/parcel-timeline.tsx`

- Data table with search/filter by status, date, branch
- Create parcel form (sender, receiver, weight, service type, charges)
- Parcel detail view with timeline, tracking events, POD photo, map
- Status update workflow
- Print label with barcode

### Task 2.3: Pickup requests management

**Files:**
- Create: `app/(admin)/pickups/page.tsx`
- Create: `components/admin/pickup-list.tsx`
- List view, assign to driver, mark completed

### Task 2.4: Merchants management

**Files:**
- Create: `app/(admin)/merchants/page.tsx`
- Create: `app/(admin)/merchants/[id]/page.tsx`
- Merchant table, detail view with parcels/wallet/invoices
- Wallet enable/disable toggle

### Task 2.5: Drivers management

**Files:**
- Create: `app/(admin)/drivers/page.tsx`
- Create: `app/(admin)/drivers/[id]/page.tsx`
- Driver table, assigned deliveries, status toggle

### Task 2.6: Payments + invoices

**Files:**
- Create: `app/(admin)/payments/page.tsx`
- Create: `app/(admin)/invoices/page.tsx`
- Stripe transaction log, invoice list, manual payout

### Task 2.7: Branches CRUD

**Files:**
- Create: `app/(admin)/branches/page.tsx`
- Florida branch locations management

### Task 2.8: Reports

**Files:**
- Create: `app/(admin)/reports/page.tsx`
- Parcel status, merchant revenue, driver performance, summary
- CSV export

### Task 2.9: Settings

**Files:**
- Create: `app/(admin)/settings/page.tsx`
- Delivery charges, SMS, email, Stripe, Google Maps, general

### Task 2.10: Support tickets

**Files:**
- Create: `app/(admin)/support/page.tsx`
- Ticket list, view replies, reply, close

---

## Phase 3: Merchant Portal

### Task 3.1: Merchant layout

**Files:**
- Create: `app/(merchant)/layout.tsx`
- Create: `components/merchant/sidebar.tsx`
- Create: `app/(merchant)/page.tsx`

### Task 3.2: My Parcels

**Files:**
- Create: `app/(merchant)/parcels/page.tsx`
- Create: `app/(merchant)/parcels/new/page.tsx`
- Create: `app/(merchant)/parcels/[id]/page.tsx`
- Create parcel, view timeline, print label

### Task 3.3: Wallet + Invoices

**Files:**
- Create: `app/(merchant)/wallet/page.tsx`
- Create: `app/(merchant)/invoices/page.tsx`

### Task 3.4: Support + Profile

**Files:**
- Create: `app/(merchant)/support/page.tsx`
- Create: `app/(merchant)/profile/page.tsx`

---

## Phase 4: Driver PWA

### Task 4.1: Driver layout

**Files:**
- Create: `app/driver/layout.tsx`
- Create: `app/driver/page.tsx`

### Task 4.2: Deliveries + POD

**Files:**
- Create: `app/driver/deliveries/page.tsx`
- Create: `app/driver/deliveries/[id]/page.tsx`
- Camera capture for POD, status update, map view

---

## Phase 5: Public Site Content Updates

### Task 5.1: Landing page hero text update

**Files:**
- Modify: `index.html` (public/)

Replace hero headline with "Florida's Fastest Courier — Same-Day Delivery Across the Sunshine State". Remove "Since 1990" from features section.

### Task 5.2: Nav improvements

- "More" dropdown → "Resources"
- Sticky tracking input in header bar
- WhatsApp floating button on all pages

### Task 5.3: Service cards update

- Add "Same-Day Delivery" card
- Remove "Customs Clearance" and "Warehouse & Storage" cards
- Keep 5 cards: Same-Day, Express, International, Road, Bulk

### Task 5.4: Footer cleanup

- Replace `#` social links with real profiles or remove

---

## Phase 6: i18n + Stripe Integration

### Task 6.1: next-intl setup

**Files:**
- Modify: `next.config.ts`
- Create: `lib/i18n.ts`
- Create: `messages/en.json`
- Create: `messages/es.json`

### Task 6.2: Stripe checkout

**Files:**
- Create: `lib/stripe.ts`
- Create: `app/api/stripe/create-checkout/route.ts`
- Create: `app/api/stripe/webhook/route.ts`

### Task 6.3: Deploy to Vercel

```bash
vercel --prod
```

---

## Execution Plan

This is ~30 tasks across 6 phases. Recommended execution:

1. **Phase 0 + Phase 1** — Inline execution (foundation, need to get right)
2. **Phase 2** — Subagent-driven (admin tasks are independent)
3. **Phase 3 + 4** — Subagent-driven (merchant + driver are independent)
4. **Phase 5 + 6** — Inline execution (quick HTML edits + config)

Each task ends with a commit. Each phase ends with a working deployment to Vercel.
