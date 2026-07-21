# Task 6 Report: Admin Dispatch Board

**Status:** DONE

**File created:** `app/admin/dispatch/page.tsx`

- Kanban-style dispatch board with 7 status columns (pending → out_for_delivery)
- Clicking a shipment opens a Sheet to assign a driver via `POST /api/assign-driver`
- Fetches shipments from `parcels` table and drivers from `profiles` (role=driver)

**Concerns:** None — follows existing admin layout conventions and uses already-in-place API route.
