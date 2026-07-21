# Task 1: Create driver_locations table

## What was done
- Created migration file `20260720200000_create_driver_locations.sql`
- Applied migration via Supabase MCP

## Migration status
- **Applied successfully:** yes
- Table `driver_locations` created with columns: id (UUID PK), driver_id (FK→auth.users), shipment_id (FK→parcels), latitude (FLOAT8), longitude (FLOAT8), recorded_at (TIMESTAMPTZ)
- Indexes created: `idx_driver_locations_shipment`, `idx_driver_locations_driver`

## Files created
- `supabase/migrations/20260720200000_create_driver_locations.sql`
