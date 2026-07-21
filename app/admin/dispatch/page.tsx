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
