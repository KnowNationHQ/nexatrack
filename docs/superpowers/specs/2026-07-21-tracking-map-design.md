# Tracking Page — Map + ETA Redesign

## Problem
The public tracking page uses a real Leaflet map (OpenStreetMap tiles) to show the driver's live location. This works but adds a heavy dependency (leaflet), tile loading delay, and requires the map to be server-rendered via dynamic import.

## Solution
Replace Leaflet with a **pure CSS/SVG mock map engine** — zero dependencies, instant render, looks realistic.

## Approach

### Mock Map Visual
- Background: CSS gradient (beige/green) overlaid with a repeating SVG grid pattern (street grid)
- Park/water patches as positioned CSS blobs
- SVG pin markers for origin (green), destination (red), driver (blue with pulse animation)
- SVG `<path>` polyline connecting origin → driver → destination
- UI chrome: zoom buttons, attribution bar, info card overlay

### Data
- Add `origin_lat`, `origin_lng`, `dest_lat`, `dest_lng` columns to `parcels`
- `lib/florida-cities.ts`: hardcoded lat/lng for major FL cities (geocode on shipment creation)
- Driver location already in `driver_locations`

### ETA
- Haversine distance from driver → destination
- `ETA = distance_miles / 30mph` → "X mi away · ~Y min ETA"
- Shown as floating info card on map

### Reuse
- `<MockMap>` component accepts `origin`, `destination`, `driverLoc` props
- Can be reused in merchant/driver dashboards

## Files Changed
| File | Action |
|------|--------|
| `components/map.tsx` | Replace with `mock-map.tsx` |
| `lib/florida-cities.ts` | New — FL city → coords map |
| `app/track/page.tsx` | Add ETA calc, always show map when shipment loaded |

## Migration
- DDL: `ALTER TABLE parcels ADD COLUMN origin_lat NUMERIC(10,7), origin_lng NUMERIC(10,7), dest_lat NUMERIC(10,7), dest_lng NUMERIC(10,7)`
- Existing parcels get coords populated lazily via `florida-cities` lookup
- Shipment creation form should store coords at creation time
- Remove leaflet from package.json dependencies
