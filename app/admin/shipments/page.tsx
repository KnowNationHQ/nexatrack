"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/db-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TableSkeleton } from "@/components/ui/skeleton-table"
import { MobileTable } from "@/components/mobile-table"
import { Plus, Search, Pencil, ExternalLink } from "lucide-react"
import { STATUS_COLORS } from "@/lib/statuses"
const statusStyles = STATUS_COLORS as unknown as Record<string, React.CSSProperties>

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadShipments()
  }, [])

  async function loadShipments() {
    setLoading(true)
    const data = await db("parcels", "select", { order: { column: "created_at", ascending: false }, limit: 50 })
    if (data) setShipments(data)
    setLoading(false)
  }

  const filtered = shipments.filter(
    (s) =>
      s.tracking_number?.toLowerCase().includes(search.toLowerCase()) ||
      s.sender_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.receiver_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Shipments</h1>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
      <div className="rounded-xl border p-5" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <TableSkeleton rows={5} />
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Shipments</h1>
        <Link href="/admin/shipments/new">
          <Button className="bg-[#FF3E41] hover:bg-[#d92e31]">
            <Plus size={16} className="mr-1" /> New Shipment
          </Button>
        </Link>
      </div>

      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <Input
              placeholder="Search by tracking #, sender or receiver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <MobileTable
            cols={[
              { label: "Tracking #", key: "tracking_number", render: (s) => <span className="font-mono text-xs">{s.tracking_number || "—"}</span> },
              { label: "Sender", key: "sender_name" },
              { label: "Receiver", key: "receiver_name" },
              { label: "Status", key: "status", render: (s) => <Badge variant="outline" style={statusStyles[s.status]}>{s.status?.replace(/_/g, " ") || "pending"}</Badge> },
              { label: "Charge", key: "total_charge", render: (s) => `$${Number(s.total_charge || 0).toFixed(2)}` },
              { label: "Date", key: "created_at", render: (s) => <span style={{ color: 'var(--text-muted)' }}>{s.created_at ? new Date(s.created_at).toLocaleDateString() : "—"}</span> },
              { label: "", key: "actions", render: (s) => (
                <div className="flex gap-1">
                  <Link href={`/admin/shipments/${s.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="View"><ExternalLink size={14} /></Button>
                  </Link>
                  <Link href={`/admin/shipments/${s.id}/edit`}>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[#FF3E41]" title="Edit"><Pencil size={14} /></Button>
                  </Link>
                </div>
              )},
            ]}
            data={filtered}
          />
        </CardContent>
      </Card>
    </div>
  )
}
