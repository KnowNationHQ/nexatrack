"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"
import { TableSkeleton } from "@/components/ui/skeleton-table"

export default function MerchantShipments() {
  const [shipments, setShipments] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      db<any[]>("parcels", "select", { eq: { merchant_id: user.id }, order: { column: "created_at", ascending: false }, limit: 50 }).then((data) => {
        if (data) setShipments(data); setLoading(false)
      })
    })
  }, [])

  const filtered = shipments.filter((s) =>
    s.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.receiver_name?.toLowerCase().includes(search.toLowerCase())
  )

  const statusColors: Record<string, {backgroundColor:string;color:string}> = {
    pending: {backgroundColor:'var(--badge-warning-bg)',color:'var(--badge-warning-text)'},
    in_transit: {backgroundColor:'var(--badge-info-bg)',color:'var(--badge-info-text)'},
    delivered: {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'},
    picked_up: {backgroundColor:'var(--badge-purple-bg)',color:'var(--badge-purple-text)'},
    cancelled: {backgroundColor:'var(--badge-neutral-bg)',color:'var(--badge-neutral-text)'},
    returned: {backgroundColor:'var(--badge-error-bg)',color:'var(--badge-error-text)'},
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>My Shipments</h1>
{loading ? (
  <div className="rounded-xl border p-5" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
    <TableSkeleton rows={5} />
  </div>
) : (
  <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader><div className="flex items-center gap-2"><Search size={16} style={{ color: 'var(--text-muted)' }} /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} /></div></CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Tracking", key: "tracking_number", render: (s) => <span className="font-mono text-xs">{s.tracking_number || "—"}</span> },
              { label: "Receiver", key: "receiver_name" },
              { label: "Destination", key: "destination_city" },
              { label: "Status", key: "status", render: (s) => <Badge variant="outline" style={statusColors[s.status]}>{s.status?.replace(/_/g, " ")}</Badge> },
              { label: "Charge", key: "total_charge", render: (s) => `$${Number(s.total_charge || 0).toFixed(2)}` },
              { label: "Date", key: "created_at", render: (s) => s.created_at ? new Date(s.created_at).toLocaleDateString() : "—" },
            ]}
            data={filtered}
            onRowClick={(s) => window.location.href = `/merchant/shipments/${s.id}`}
          />
        </CardContent>
      </Card>
    )}
    </div>
  )
}
