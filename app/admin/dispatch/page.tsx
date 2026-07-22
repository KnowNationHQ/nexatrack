"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { db } from "@/lib/db-client"
import { getCityCoords } from "@/lib/florida-cities"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/hooks/use-toast"
import { Loader2, Truck, Map as MapIcon, CheckSquare, Square } from "lucide-react"

const MockMap = dynamic(() => import("@/components/mock-map"), { ssr: false })

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
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [batchDriver, setBatchDriver] = useState<string>("")
  const [batching, setBatching] = useState(false)
  const [routeDriver, setRouteDriver] = useState<string | null>(null)
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

  const batchAssign = async () => {
    if (!batchDriver || checked.size === 0) return
    setBatching(true)
    let ok = 0; let fail = 0
    for (const id of Array.from(checked)) {
      try {
        const res = await fetch("/api/assign-driver", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ shipment_id: id, driver_id: batchDriver }),
        })
        if (res.ok) ok++; else fail++
      } catch { fail++ }
    }
    toast({ title: `Assigned ${ok} shipment(s)${fail ? `, ${fail} failed` : ""}` })
    setChecked(new Set())
    setBatchDriver("")
    setBatching(false)
    setShipments(await db("parcels", "select", { order: { column: "created_at", ascending: false } }))
  }

  const toggleCheck = (id: string) => {
    setChecked(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n })
  }

  const routeStops = useMemo(() => {
    if (!routeDriver) return []
    const s = shipments.filter(x => x.driver_id === routeDriver && x.status !== "delivered" && x.status !== "cancelled")
    const stops: { lat: number; lng: number; label: string }[] = []
    for (const sh of s) {
      const o = sh.origin_lat ? { lat: sh.origin_lat, lng: sh.origin_lng } : getCityCoords(sh.origin_city || "")
      const d = sh.dest_lat ? { lat: sh.dest_lat, lng: sh.dest_lng } : getCityCoords(sh.destination_city || "")
      if (o) stops.push({ ...o, label: `Pickup: ${sh.tracking_number}` })
      if (d) stops.push({ ...d, label: `Drop: ${sh.tracking_number}` })
    }
    return stops
  }, [routeDriver, shipments])

  const grouped = DISPATCH_STATUSES.map(status => ({
    status,
    label: STATUS_LABELS[status],
    items: shipments.filter(s => s.status === status),
  }))

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dispatch Board</h1>
        <div className="flex flex-wrap items-center gap-2">
          {checked.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{checked.size} selected</span>
              <Select onValueChange={setBatchDriver} value={batchDriver}>
                <SelectTrigger className="h-8 w-40" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)' }}>
                  {drivers.map((d: any) => (
                    <SelectItem key={d.id} value={d.id} className="text-xs" style={{ color: 'var(--text-primary)' }}>{d.name || d.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" className="h-8 bg-[#FF3E41] hover:bg-[#d92e31]" disabled={!batchDriver || batching} onClick={batchAssign}>
                {batching ? <Loader2 className="h-3 w-3 animate-spin" /> : "Assign"}
              </Button>
            </div>
          )}
          {drivers.map((d: any) => (
            <Button key={d.id} variant="outline" size="sm" className="h-8" style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
              onClick={() => setRouteDriver(routeDriver === d.id ? null : d.id)}>
              <MapIcon size={12} className="mr-1" />{d.name || d.email?.split("@")[0]}
            </Button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {grouped.filter(g => g.items.length > 0).map(group => (
          <div key={group.status}>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{group.label}</h2>
              <Badge variant="outline" className="bg-gray-800" style={{ color: 'var(--text-muted)' }}>{group.items.length}</Badge>
            </div>
            <div className="space-y-3">
              {group.items.map(shipment => (
                <Card
                  key={shipment.id}
                  className="cursor-pointer p-4 transition-colors hover:border-gray-600" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}
                  onClick={() => setSelected(shipment)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div onClick={(e) => { e.stopPropagation(); toggleCheck(shipment.id) }}>
                          {checked.has(shipment.id)
                            ? <CheckSquare size={16} className="text-[#FF3E41]" />
                            : <Square size={16} style={{ color: 'var(--text-muted)' }} />}
                        </div>
                        <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>{shipment.tracking_number?.slice(0, 12)}</span>
                      </div>
                      {shipment.driver_id && <Truck className="h-3 w-3 text-green-500" />}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{shipment.origin_city} → {shipment.destination_city}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{shipment.weight ? `${shipment.weight}kg` : ""} · {shipment.receiver_name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
        {grouped.every(g => g.items.length === 0) && (
          <p className="py-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No shipments to dispatch</p>
        )}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null) }}>
        <SheetContent side="right" className="w-[400px] border-l" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <SheetHeader>
            <SheetTitle style={{ color: 'var(--text-primary)' }}>Assign Driver</SheetTitle>
            <SheetDescription style={{ color: 'var(--text-muted)' }}>
              {selected?.tracking_number} — {selected?.origin_city} → {selected?.destination_city}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label style={{ color: 'var(--text-secondary)' }}>Driver</Label>
              <Select onValueChange={assignDriver} disabled={assigning}>
                <SelectTrigger style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  {drivers.map((d: any) => (
                    <SelectItem key={d.id} value={d.id} className="focus:bg-gray-800 focus:text-white" style={{ color: 'var(--text-primary)' }}>
                      {d.name || d.email || d.id?.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {assigning && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Loader2 className="h-4 w-4 animate-spin" /> Assigning...
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={!!routeDriver} onOpenChange={(o) => { if (!o) setRouteDriver(null) }}>
        <DialogContent className="max-w-2xl" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
          <DialogHeader>
            <DialogTitle style={{ color: 'var(--text-primary)' }}>Driver Route</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {routeStops.length === 0 ? (
              <p className="py-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No active stops for this driver</p>
            ) : (
              <>
                <div className="space-y-1">
                  <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{routeStops.length} stop{routeStops.length > 1 ? "s" : ""} · Sorted by proximity</p>
                  <div className="flex flex-wrap gap-1">
                    {routeStops.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]" style={{backgroundColor:'var(--badge-info-bg)',color:'var(--badge-info-text)'}}>
                        {i + 1}. {s.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="h-[350px] w-full rounded-lg overflow-hidden">
                  <MockMap
                    origin={routeStops.length > 0 ? routeStops[0] : null}
                    destination={routeStops.length > 1 ? routeStops[routeStops.length - 1] : null}
                    originLabel={routeStops[0]?.label}
                    destLabel={routeStops[routeStops.length - 1]?.label}
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
