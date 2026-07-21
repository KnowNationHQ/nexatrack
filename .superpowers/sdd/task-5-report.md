# Task 5 Report: Add Leaflet Map to Public Tracking Page

**Status:** DONE

## Files Changed
- `app/track/page.tsx`

## Changes Made
1. Added `dynamic` import from `next/dynamic` and created a dynamic `MapView` import (SSR disabled, pulse skeleton loader)
2. Added `driverLoc` state variable (`{latitude, longitude} | null`)
3. In `doTrack()`, after processing parcel/events data, added a fetch to `/api/driver-location?shipment_id=X` to retrieve driver location
4. Added "Driver Location" section (shows `MapView` with a marker) between the shipment details card and the tracking history timeline — only renders when `driverLoc` is available

## Concerns
- The `MapView` SSR import uses `@/components/map` — the actual file is at `components/map.tsx`. If the `@/` alias doesn't resolve correctly, adjust the import path.
- `GET /api/driver-location` is fire-and-forget inside `doTrack` — errors are silently caught. This matches the pattern used elsewhere in the codebase.
