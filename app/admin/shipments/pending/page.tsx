"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MobileTable } from "@/components/mobile-table"
import Link from "next/link"
import { Search, Plus } from "lucide-react"
import { TableSkeleton } from "@/components/ui/skeleton-table"

export default function PendingShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    db<any[]>("parcels", "select", { eq: { status: "pending" }, order: { column: "created_at", ascending: false }, limit: 50 }).then((data) => {
      if (data) setShipments(data)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = shipments.filter((s) =>
    s.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
    s.sender_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Pending Shipments</h1>
        <Link href="/admin/shipments/new"><Button className="bg-[#FF3E41] hover:bg-[#d92e31]"><Plus size={16} className="mr-1" /> New</Button></Link>
      </div>
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
              { label: "Status", key: "status", render: () => <Badge variant="outline" style={{backgroundColor:'var(--badge-warning-bg)',color:'var(--badge-warning-text)'}}>pending</Badge> },
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


