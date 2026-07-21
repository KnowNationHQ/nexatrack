# GPS Tracking + Driver Dispatch

## Overview
Two features for Nexatrack courier OS: real-time GPS tracking on public tracking page, and admin driver dispatch board.

## GPS Tracking

### Flow
1. Driver on job page → browser prompts for geolocation permission
2. If granted, `watchPosition()` sends lat/lng every 10s to `/api/update-location`
3. Location stored in `driver_locations` table
4. Public tracking page fetches last known location and displays on Leaflet map

### New Table
```sql
create table driver_locations (
  id uuid default gen_random_uuid() primary key,
  driver_id uuid references auth.users not null,
  shipment_id uuid references parcels,
  latitude float8 not null,
  longitude float8 not null,
  recorded_at timestamptz default now()
);
```

### Components
- `components/map.tsx` — Leaflet map wrapper (single marker or route)
- `components/driver-location-sender.tsx` — hook that watches position and POSTs to API

### Public Tracking Updates
- `/track` page fetches `driver_locations` for the shipment
- Shows driver marker on map if driver location exists
- Leaves existing tracking timeline unchanged

## Driver Dispatch

### Flow
1. Admin nav: "Dispatch" link opens `/admin/dispatch`
2. View: cards grouped by status columns (Pending, Pickup Assigned, Picked Up, Received at Warehouse, Delivery Man Assigned, In Transit, Out for Delivery)
3. Each card shows: tracking #, destination, weight, pickup time
4. Click card → slide-over panel with shipment details + "Assign Driver" dropdown
5. Driver dropdown lists all active drivers (from profiles table)
6. On assign: `parcels.driver_id` updated, tracking event added, card moves to next column

### Components
- `app/admin/dispatch/page.tsx` — main dispatch page with column layout
- Styling: same gradient sidebar layout as other admin pages

## API Routes
- `POST /api/update-location` — receives `{ driver_id, shipment_id, lat, lng }`, inserts into `driver_locations`
- `GET /api/driver-location?shipment_id=X` — returns latest location for a shipment
- `POST /api/assign-driver` — updates `parcels.driver_id` and adds tracking event

## Supabase Migrations
1. Create `driver_locations` table
2. Index on `driver_locations.shipment_id`

## Packages to Add
- `leaflet`, `@types/leaflet` — map rendering

## Global UX
- All action buttons show loading spinner during API calls (shadcn `Button` `disabled` + spinner)
- Destructive actions (unassign driver, cancel shipment) show confirmation dialog before executing
- Toast notifications on success/error for all mutations

## Files Changed
- New: `components/map.tsx`
- New: `components/driver-location-sender.tsx`
- New: `app/admin/dispatch/page.tsx`
- New: `app/api/update-location/route.ts`
- New: `app/api/driver-location/route.ts`
- New: `app/api/assign-driver/route.ts`
- Modify: `app/track/page.tsx` (add map)
- Modify: `app/admin/navigation.ts` or wherever admin nav is defined (add Dispatch link)
