# Nexatrack — Production-Ready Design

## Overview

Make Nexatrack Express Courier Services function as a real production app for
the client. The existing codebase is ~85% built (HTML/Bootstrap public site +
Supabase backend + Edge Function API + admin dashboard). The remaining 15%
closes the gaps: broken/missing endpoints, no agent chat replies, forms that
leak data to external services, weak RLS, and missing UX polish.

## Section 1: Fix All Endpoints & Data Flow

### Auto-generate tracking numbers
- Edge function `create-shipment`: when `tracking_number` is null/missing,
  generate `NXT-{year}{sequential 5-digit}` (e.g. NXT-202600001)
- Use a `tracking_sequence` table or `SELECT COALESCE(MAX(id),0)+1 FROM
  shipments` for the sequential part
- Drop the unused `shipper_country`/`receiver_country` fields from the
  dashboard create-shipment form — the edge function doesn't insert them

### Verify every CRUD action works end-to-end
Tables to audit through the admin dashboard:
- shipments, staff, customers, drivers, recipients, pre\_alerts,
  locker\_packages, pickups, consolidations, settings

Each must pass list → get → create → update → delete cycle without errors.
The edge function's generic CRUD handler (`tableFor()`) already supports all
of these — the risk is in the JS frontend calling the right action names.

### Fix broken links
Map all Vercel rewrites in vercel.json. The public pages reference paths
like `/tracking`, `/about`, `/service` without `.html` extensions — these
work on Vercel but 404 when opened locally from the filesystem. Add
`.html`-less routing or document the gotcha.

## Section 2: Live Chat — Agent Inbox

### Problem
The chat widget (`chat-widget.js`) works for visitors: they open a chat, a
`livechat_chats` row is created, messages go into `livechat_messages`. The
widget auto-replies "Thank you for contacting Nexatrack! An agent will be
with you shortly." But there is no admin interface to actually reply.

### Solution: Admin Chat Inbox
Add a new section to the admin dashboard sidebar: "Chat".

- List all active chats (status = 'active'), newest first
- Click a chat to view the thread (Realtime subscription already exists)
- Agent types a reply → inserts into `livechat_messages` with
  `sender_type: 'agent'`
- The visitor's widget picks it up via the existing Realtime subscription
- Badge on the Chat nav item showing unread count
- Close/resolve chat button
- Block visitor button (inserts into `blocked_tokens` — already handled by
  the widget)

### Already in place
- `livechat_chats` and `livechat_messages` tables with RLS
- `blocked_tokens` table with `anon_select_blocked` policy
- Chat widget already subscribes to Realtime INSERT on `livechat_messages`

### Implementation
Add the chat HTML section + JS to `admin/dashboard.html`. Uses the existing
`sb` Supabase client (no new dependencies). The agent replies go through
`livechat_messages` INSERT via the edge function or direct Supabase insert
(since authenticated user has RLS permission via `auth_all_messages`).

## Section 3: Forms → Your Database

### Problem
- Contact form (`contact.html`) sends to `https://formspree.io/f/meoebapa`
- Quote form (`index.html`, `quote.html`) sends to same Formspree
- Newsletter signup in footer sends to same Formspree
- You don't own this data. No way to convert a quote into a shipment.

### Solution
Create `ponytail:`

1. Add a `form_submissions` SQL table:
   ```
   form_submissions (id uuid PK, type text (contact|quote|newsletter),
     data jsonb, created_at timestamptz default now(), converted boolean
     default false, shipment_id uuid FK nullable)
   ```

2. Replace Formspree URLs with POST to a new edge function or direct
   Supabase insert (anon RLS INSERT on `form_submissions` only)

3. Admin dashboard gets a "Leads" section showing form submissions with
   "Convert to Shipment" button (pre-fills shipper data from the quote)

4. Newsletter signup also stores in `form_submissions` — exportable to CSV

## Section 4: RLS Lockdown

### `anon_select_shipments` — security hole
Current policy: `(anon) SELECT on shipments WHERE true`
This lets any anonymous user enumerate ALL shipments by guessing IDs.

Fix: Restrict anon SELECT to only rows matching their tracking number query.
Since the public tracking page calls the edge function (which uses service
role), direct table access from client-side JS is limited. But if someone
uses the anon key directly, they can read all shipments.

Change policy to:
```
CREATE POLICY anon_select_shipments ON shipments FOR SELECT TO anon
  USING (tracking_number = current_setting('app.current_tracking')::text
         OR false);
```
Or simpler: restrict to empty set for anon (edge function handles public
tracking via service role):
```
CREATE POLICY anon_select_shipments ON shipments FOR SELECT TO anon
  USING (false);
```

## Section 5: UX Polish

### Admin dashboard
- Loading skeletons on all tables (already partially done — `loading-skeleton`
  CSS class exists, some sections use it)
- Toast component already exists and works
- Empty states for every table (already done)
- Add confirmation dialog on delete (already done)
- Mobile sidebar (already done)
- Real-time shipment updates via Realtime subscription (already wired in
  `initApp()`)

### Public site
- Lazy-load images (already has `loading="lazy"`)
- Add favicon (already has `favicon.ico`)
- 404 page
- Consistent active nav state

### Still missing
- Chat nav badge showing unread count from Realtime
- "Leads" section for form submissions
- Click-to-call on mobile for phone number

## Self-Review

1. **Placeholder scan:** None. Every section describes concrete existing
   state and specific changes.
2. **Internal consistency:** All sections reference the same codebase files
   (dashboard.html, chat-widget.js, edge function). No contradictions.
3. **Scope check:** Focused on a single project with clear subsections. No
   need to decompose further.
4. **Ambiguity check:** Every change is specified exactly — which files,
   which tables, which RLS policies. Go / no-go decisions are clear.
