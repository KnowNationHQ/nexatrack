"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/hooks/use-toast"
import { MobileTable } from "@/components/mobile-table"
import { Search, Loader2, Truck } from "lucide-react"

const STATUSES = ["pending", "assigned", "picked_up", "completed", "cancelled"]
const STATUS_LABELS: Record<string, string> = { pending: "Pending", assigned: "Assigned", picked_up: "Picked Up", completed: "Completed", cancelled: "Cancelled" }

export default function PickupsPage() {
  const [pickups, setPickups] = useState<any[]>([])
  const [drivers, setDrivers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [selected, setSelected] = useState<any>(null)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    db<any[]>("pickup_requests", "select", { order: { column: "created_at", ascending: false } }).then((data) => { if (data) setPickups(data) })
    db("profiles", "select", { eq: { role: "driver" } }).then(setDrivers)
  }, [])

  const filtered = pickups.filter((p) => {
    if (filter !== "all" && p.status !== filter) return false
    if (search && !p.address?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const updatePickup = async (id: string, updates: Record<string, any>) => {
    setSaving(true)
    try {
      await db("pickup_requests", "update", { eq: { id }, data: updates })
      setPickups(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))
      toast({ title: "Pickup updated" })
      setSelected(null)
    } catch { toast({ title: "Error updating pickup", variant: "destructive" }) }
    setSaving(false)
  }

  const updateStatus = (id: string, status: string) => updatePickup(id, { status })

  const assignDriver = async (driverId: string) => {
    if (!selected) return
    await updatePickup(selected.id, { driver_id: driverId, status: "assigned" })
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Pickup Requests</h1>
      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Search size={16} style={{ color: 'var(--text-muted)' }} />
              <Input placeholder="Search address..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
            </div>
            <div className="flex flex-wrap gap-1">
              {["all", ...STATUSES].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className="rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                  style={{ backgroundColor: filter === s ? '#FF3E41' : 'var(--input-bg)', color: filter === s ? 'white' : 'var(--text-muted)' }}>
                  {s === "all" ? "All" : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Address", key: "address", render: (p) => p.address || "—" },
              { label: "City", key: "city", render: (p) => <span style={{ color: 'var(--text-muted)' }}>{p.city || "—"}</span> },
              { label: "Parcels", key: "parcel_count", render: (p) => p.parcel_count || 1 },
              { label: "Status", key: "status", render: (p) => <PickupStatusBadge status={p.status || "pending"} /> },
              { label: "Driver", key: "driver_id", render: (p) => p.driver_id ? <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--badge-success-text)' }}><Truck size={12} /> Assigned</span> : <span style={{ color: 'var(--text-muted)' }}>—</span> },
              { label: "Actions", key: "id", render: (p) => (
                <div className="flex gap-1">
                  <select value={p.status || "pending"} onChange={(e) => updateStatus(p.id, e.target.value)}
                    className="rounded px-1.5 py-0.5 text-[10px]"
                    style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <button onClick={() => setSelected(p)}
                    className="rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors"
                    style={{ border: '1px solid var(--card-border)', color: 'var(--accent)' }}>
                    Assign
                  </button>
                </div>
              )},
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null) }}>
        <SheetContent side="right" className="w-[400px] border-l" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)', color: 'var(--text-primary)' }}>
          <SheetHeader>
            <SheetTitle style={{ color: 'var(--text-primary)' }}>Assign Driver</SheetTitle>
            <SheetDescription style={{ color: 'var(--text-muted)' }}>
              {selected?.address} — {selected?.city}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label style={{ color: 'var(--text-secondary)' }}>Driver</Label>
              <Select onValueChange={assignDriver} disabled={saving}>
                <SelectTrigger style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                  {drivers.map((d: any) => (
                    <SelectItem key={d.id} value={d.id} style={{ color: 'var(--text-primary)' }}>
                      {d.name || d.email || d.id?.slice(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {saving && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function PickupStatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'var(--badge-warning-bg)', text: 'var(--badge-warning-text)' },
    assigned: { bg: 'var(--badge-info-bg)', text: 'var(--badge-info-text)' },
    picked_up: { bg: 'var(--badge-purple-bg)', text: 'var(--badge-purple-text)' },
    completed: { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)' },
    cancelled: { bg: 'var(--badge-neutral-bg)', text: 'var(--badge-neutral-text)' },
  }
  const c = colors[status] || colors.pending
  return <Badge variant="outline" style={{ backgroundColor: c.bg, color: c.text }}>{STATUS_LABELS[status] || status}</Badge>
}
