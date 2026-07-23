"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/statuses"
import { MobileTable } from "@/components/mobile-table"
import { Search } from "lucide-react"
import { TableSkeleton } from "@/components/ui/skeleton-table"

const TRANSIT_STATUSES = ["cargo_on_air", "on_transit", "cargo_on_transit", "custom_check", "on_customs_hold", "cargo_on_move"]

export default function InTransitPage() {
  const [items, setItems] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    db<any[]>("parcels", "select", { in: { status: TRANSIT_STATUSES }, order: { column: "created_at", ascending: false }, limit: 50 }).then((data) => {
      if (data) setItems(data)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = items.filter((s) =>
    s.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.sender_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>In Transit</h1>
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
              { label: "Tracking #", key: "tracking_number", render: (s) => <span className="font-mono text-xs">{s.tracking_number || "—"}</span> },
              { label: "Sender", key: "sender_name" },
              { label: "Receiver", key: "receiver_name" },
              { label: "Status", key: "status", render: (s) => <Badge variant="outline" style={{backgroundColor:STATUS_COLORS[s.status]?.backgroundColor || 'var(--badge-info-bg)',color:STATUS_COLORS[s.status]?.color || 'var(--badge-info-text)'}}>{STATUS_LABELS[s.status] || s.status}</Badge> },
              { label: "Date", key: "created_at", render: (s) => <span style={{ color: 'var(--text-muted)' }}>{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</span> },
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
      )}
    </div>
  )
}


