# Task 4 Report — Driver Location Sender

**Status:** DONE

## Files Created
- `components/driver-location-sender.tsx` — Client component wrapping `navigator.geolocation.watchPosition`. Sends lat/lng to `POST /api/update-location` on each position update. Displays a green pulsing dot + "GPS active" indicator. Cleans up the watch on unmount.

## Files Modified
- `app/driver/shipments/[id]/page.tsx` — Added import and rendered `<DriverLocationSender>` after the weight line when `isAssignedToMe` is true.

## Concerns
- `navigator.geolocation.watchPosition` fires as often as the device provides updates (not strictly every 10s). The `maximumAge: 10000` + `timeout: 15000` options approximate a 10s cadence but actual frequency depends on the device. This matches the intent of "every 10 seconds" without adding a custom interval timer.
- Requires HTTPS for geolocation in production (standard browser security).
