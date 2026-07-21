# Task 2 Report: API Routes for GPS Tracking & Driver Assignment

## Files Created

| File | Route | Method |
|------|-------|--------|
| `app/api/update-location/route.ts` | `/api/update-location` | POST |
| `app/api/driver-location/route.ts` | `/api/driver-location` | GET |
| `app/api/assign-driver/route.ts` | `/api/assign-driver` | POST |

## Deviations from Spec

1. **`assign-driver/route.ts`** — Spec included `status: "delivery_man_assign"` in the `tracking_events` insert, but the actual `tracking_events` table has no `status` column. Omitted to avoid PostgREST column-not-found error. `shipment_id` used instead of `parcel_id` to match actual schema.

## Issues

- **RLS disabled on `driver_locations`** — this table has Row Level Security disabled, meaning anyone with the anon key can read/write all rows. Consider enabling RLS and adding policies if this data should be protected.
