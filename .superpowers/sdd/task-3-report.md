# Task 3 Report: Install Leaflet & Create MapView

## npm Install Output

```
> nexatrack@0.1.0 install
> npm install leaflet

added 1 package, and audited 503 packages in 36s

> npm install -D @types/leaflet

added 2 packages, and audited 505 packages in 9s
```

Packages installed:
- `leaflet` (runtime)
- `@types/leaflet` (dev)

## Files Created

- `components/map.tsx` — MapView component with:
  - Leaflet map initialization (single-run via ref guard)
  - OpenStreetMap tile layer
  - Marker support with popups
  - Dynamic center/zoom updates
  - Default center: Polk County, FL (27.9942, -81.7603)

## Issues

- npm audit reports 6 vulnerabilities (2 moderate, 4 high) — pre-existing, unrelated to leaflet.
- MapView is a Client Component (`"use client"`) — required for browser-only leaflet APIs.
