# GPS Tracking + Driver Dispatch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add real-time GPS tracking on public tracking page + admin driver dispatch board.

**Architecture:** Four new API routes (update-location, driver-location, assign-driver, dispatch-shipments). Leaflet map on public tracking page showing driver position. Geolocation sender hook on driver job page. Kanban-style dispatch board for admin.

**Tech Stack:** Next.js 14 App Router, Supabase (service role via createAdminClient), Leaflet + OSM tiles, shadcn Sheet, existing db() helper.

## Global Constraints
- All API routes use `createAdminClient` from `@/lib/supabase-admin` (service_role)
- All action buttons show spinner during API calls (shadcn Button disabled + spinner)
- Destructive actions show confirmation dialog
- Toast on success/error for all mutations
- Admin nav pattern: menuGroups array in app/admin/layout.tsx
- Existing db() helper from @/lib/db-client for client-side queries
- Migration naming: supabase/migrations/20260720XXXXXX_descriptive_name.sql

---

### Task 1: Create driver_locations table

**Files:**
- Create: `supabase/migrations/20260720200000_create_driver_locations.sql`

**Interfaces:**
- Produces: `driver_locations` table with columns: `id (uuid PK)`, `driver_id (uuid FK to auth.users)`, `shipment_id (uuid FK to parcels)`, `latitude (float8)`, `longitude (float8)`, `recorded_at (timestamptz default now())`

- [ ] **Step 1: Create migration file**

```sql
CREATE TABLE IF NOT EXISTS driver_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shipment_id UUID REFERENCES parcels(id) ON DELETE CASCADE,
  latitude FLOAT8 NOT NULL,
  longitude FLOAT8 NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_driver_locations_shipment ON driver_locations(shipment_id);
CREATE INDEX idx_driver_locations_driver ON driver_locations(driver_id);
```

- [ ] **Step 2: Apply migration via Supabase**

Run: `npx supabase migration up` or apply via MCP.

---

### Task 2: Create location API routes

**Files:**
- Create: `app/api/update-location/route.ts`
- Create: `app/api/driver-location/route.ts`

**Interfaces:**
- `POST /api/update-location` consumes `{ driver_id, shipment_id, lat, lng }`, returns `{ success: true }`
- `GET /api/driver-location?shipment_id=X` returns `{ latitude, longitude, recorded_at }` (latest)

- [ ] **Step 1: Create POST /api/update-location**

```ts
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { driver_id, shipment_id, lat, lng } = await req.json()
  if (!driver_id || !lat || !lng) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { error } = await supabase.from("driver_locations").insert({
    driver_id, shipment_id, latitude: lat, longitude: lng,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 2: Create GET /api/driver-location**

```ts
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const shipment_id = searchParams.get("shipment_id")
  if (!shipment_id) {
    return NextResponse.json({ error: "Missing shipment_id" }, { status: 400 })
  }
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("driver_locations")
    .select("latitude, longitude, recorded_at")
    .eq("shipment_id", shipment_id)
    .order("recorded_at", { ascending: false })
    .limit(1)
    .single()
  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data || null)
}
```

- [ ] **Step 3: Create POST /api/assign-driver**

```ts
import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(req: Request) {
  const { shipment_id, driver_id } = await req.json()
  if (!shipment_id || !driver_id) {
    return NextResponse.json({ error: "Missing shipment_id or driver_id" }, { status: 400 })
  }
  const supabase = createAdminClient()

  const { error: updateError } = await supabase
    .from("parcels")
    .update({ driver_id, status: "delivery_man_assign" })
    .eq("id", shipment_id)
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 })

  const { error: eventError } = await supabase.from("tracking_events").insert({
    parcel_id: shipment_id,
    status: "delivery_man_assign",
    title: "Driver Assigned",
    description: "Driver has been assigned to this shipment",
  })
  if (eventError) return NextResponse.json({ error: eventError.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
```

---

### Task 3: Install Leaflet + create Map component

**Files:**
- Modify: `package.json`
- Create: `components/map.tsx`

**Interfaces:**
- `<MapView center={[lat, lng]} zoom={13} markers={[{lat, lng, label}]} className="..." />`
- Consumes nothing from earlier tasks

- [ ] **Step 1: Install Leaflet**

Run: `npm install leaflet && npm install -D @types/leaflet`

- [ ] **Step 2: Create Map component**

```tsx
"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapMarker {
  lat: number
  lng: number
  label?: string
}

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  markers?: MapMarker[]
  className?: string
}

export default function MapView({ center, zoom = 13, markers = [], className }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const instanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || instanceRef.current) return
    const map = L.map(mapRef.current).setView(center || [27.9942, -81.7603], zoom)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map)
    instanceRef.current = map
  }, [])

  useEffect(() => {
    const map = instanceRef.current
    if (!map) return
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) map.removeLayer(layer)
    })
    markers.forEach((m) => {
      L.marker([m.lat, m.lng]).addTo(map).bindPopup(m.label || "")
    })
  }, [markers])

  useEffect(() => {
    const map = instanceRef.current
    if (!map) return
    if (center) map.setView(center)
  }, [center])

  return <div ref={mapRef} className={`h-[300px] w-full rounded-lg ${className || ""}`} />
}
```

---

### Task 4: Create driver location sender

**Files:**
- Create: `components/driver-location-sender.tsx`
- Modify: `app/driver/shipments/[id]/page.tsx`

**Interfaces:**
- `<DriverLocationSender shipmentId={id} />` — hook/component handles geolocation, sends every 10s
- Consumes: POST /api/update-location

- [ ] **Step 1: Create DriverLocationSender component**

```tsx
"use client"

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-browser"

export default function DriverLocationSender({ shipmentId }: { shipmentId: string }) {
  const watchRef = useRef<number | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    const supabase = createClient()

    watchRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        try {
          await fetch("/api/update-location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              driver_id: user.id,
              shipment_id: shipmentId,
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }),
          })
        } catch { /* silently retries next interval */ }
      },
      () => { /* permission denied or error */ },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    )

    return () => {
      if (watchRef.current !== null) navigator.geolocation.clearWatch(watchRef.current)
    }
  }, [shipmentId])

  return <div className="flex items-center gap-2 text-xs text-gray-500"><span className="h-2 w-2 animate-pulse rounded-full bg-green-500" /> GPS active</div>
}
```

- [ ] **Step 2: Integrate into driver shipment detail page**

Add to `app/driver/shipments/[id]/page.tsx`:
- Import `DriverLocationSender`
- Render `<DriverLocationSender shipmentId={id} />` near the status buttons

Edit: Import at top:
```tsx
import DriverLocationSender from "@/components/driver-location-sender"
```
And render inside the CardContent:
```tsx
{isAssignedToMe && <DriverLocationSender shipmentId={id} />}
```

---

### Task 5: Update public tracking page with map

**Files:**
- Modify: `app/track/page.tsx`

**Interfaces:**
- Consumes: `MapView` component, GET /api/driver-location

- [ ] **Step 1: Add map import and state**

After the `parcel` fetch in the track page, add a fetch to `/api/driver-location?shipment_id=${parcel.id}` and store driver location. Import `MapView` and render it between the shipment card and the timeline.

Edit top imports:
```tsx
import dynamic from "next/dynamic"

const MapView = dynamic(() => import("@/components/map"), { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-800" /> })
```

In the component, add state:
```tsx
const [driverLoc, setDriverLoc] = useState<{latitude: number; longitude: number} | null>(null)
```

After the tracking fetch, add:
```tsx
if (data?.parcel?.id) {
  fetch(`/api/driver-location?shipment_id=${data.parcel.id}`)
    .then(r => r.json())
    .then(loc => { if (loc?.latitude) setDriverLoc(loc) })
    .catch(() => {})
}
```

Add map after the shipment card and before the timeline:
```tsx
{driverLoc && (
  <div className="mt-6">
    <h2 className="mb-3 text-lg font-semibold text-white">Driver Location</h2>
    <MapView
      center={[driverLoc.latitude, driverLoc.longitude]}
      zoom={15}
      markers={[{ lat: driverLoc.latitude, lng: driverLoc.longitude, label: "Driver" }]}
    />
  </div>
)}
```

---

### Task 6: Build admin dispatch board

**Files:**
- Create: `app/admin/dispatch/page.tsx`

**Interfaces:**
- Consumes: POST /api/assign-driver, profiles table (drivers), parcels table
- Produces: admin dispatch board with column layout + Sheet assignment

- [ ] **Step 1: Create dispatch page**

```tsx
"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/hooks/use-toast"
import { Loader2, Truck } from "lucide-react"

const DISPATCH_STATUSES = ["pending", "pickup_assign", "picked_up", "received_warehouse", "delivery_man_assign", "in_transit", "out_for_delivery"]

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  pickup_assign: "Pickup Assigned",
  picked_up: "Picked Up",
  received_warehouse: "At Warehouse",
  delivery_man_assign: "Delivery Assigned",
  in_transit: "In Transit",
  out_for_delivery: "Out for Delivery",
}

export default function DispatchPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [assigning, setAssigning] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    db("parcels", "select", { order: { column: "created_at", ascending: false } }).then(setShipments)
    db("profiles", "select", { eq: { role: "driver" } }).then(setDrivers)
  }, [])

  const assignDriver = async (driverId: string) => {
    if (!selected) return
    setAssigning(true)
    try {
      const res = await fetch("/api/assign-driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipment_id: selected.id, driver_id: driverId }),
      })
      if (!res.ok) throw new Error("Failed to assign")
      toast({ title: "Driver assigned" })
      setSelected(null)
      setShipments(prev => prev.map(s => s.id === selected.id ? { ...s, driver_id: driverId, status: "delivery_man_assign" } : s))
    } catch {
      toast({ title: "Error assigning driver", variant: "destructive" })
    } finally {
      setAssigning(false)
    }
  }

  const grouped = DISPATCH_STATUSES.map(status => ({
    status,
    label: STATUS_LABELS[status],
    items: shipments.filter(s => s.status === status),
  }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Dispatch Board</h1>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {grouped.map(group => (
          <div key={group.status} className="min-w-[280px] flex-shrink-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-300">{group.label}</h2>
              <Badge variant="outline" className="bg-gray-800 text-gray-400">{group.items.length}</Badge>
            </div>
            <div className="space-y-3">
              {group.items.length === 0 && (
                <p className="py-8 text-center text-sm text-gray-600">No shipments</p>
              )}
              {group.items.map(shipment => (
                <Card
                  key={shipment.id}
                  className="cursor-pointer border-[#1a1725] bg-[#0a0715] p-4 transition-colors hover:border-gray-600"
                  onClick={() => setSelected(shipment)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-white">{shipment.tracking_number?.slice(0, 12)}</span>
                      {shipment.driver_id && <Truck className="h-3 w-3 text-green-500" />}
                    </div>
                    <p className="text-xs text-gray-400">{shipment.origin_city} → {shipment.destination_city}</p>
                    <p className="text-xs text-gray-500">{shipment.weight ? `${shipment.weight}kg` : ""} · {shipment.receiver_name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null) }}>
        <SheetContent side="right" className="w-[400px] border-l border-[#1a1725] bg-[#0a0715] text-white">
          <SheetHeader>
            <SheetTitle className="text-white">Assign Driver</SheetTitle>
            <SheetDescription className="text-gray-400">
              {selected?.tracking_number} — {selected?.origin_city} → {selected?.destination_city}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Driver</Label>
              <Select onValueChange={assignDriver} disabled={assigning}>
                <SelectTrigger className="border-[#1a1725] bg-[#0f0a1e] text-white">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent className="border-[#1a1725] bg-[#0f0a1e] text-white">
                  {drivers.map((d: any) => (
                    <SelectItem key={d.id} value={d.id} className="text-white focus:bg-gray-800 focus:text-white">
                      {d.name || d.email || d.id?.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {assigning && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" /> Assigning...
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
```

---

### Task 7: Add Dispatch nav link to admin sidebar

**Files:**
- Modify: `app/admin/layout.tsx`

- [ ] **Step 1: Add Dispatch to Logistics section**

In the menuGroups array, add `{ href: "/admin/dispatch", label: "Dispatch", icon: ClipboardList }` to the Logistics group (before Pickup Requests):

```tsx
{ label: "Logistics", items: [
  { href: "/admin/shipments", label: "All Shipments", icon: Package },
  { href: "/admin/shipments/pending", label: "Pending", icon: PackageOpen },
  { href: "/admin/shipments/transit", label: "In Transit", icon: Truck },
  { href: "/admin/dispatch", label: "Dispatch", icon: ClipboardList },
  { href: "/admin/pickups", label: "Pickup Requests", icon: ClipboardList },
]}
```

`ClipboardList` is already imported in the layout file.
