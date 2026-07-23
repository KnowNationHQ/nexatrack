"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { STATUS_COLORS_3 } from "@/lib/statuses"

export default function AllJobsPage() {
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db<{ data: any[] }>("parcels", "select", { neq: [{ col: "status", val: "arrived" }, { col: "status", val: "on_hold" }], order: { column: "created_at", ascending: false } }).then(({ data }) => {
      if (data) setShipments(data)
    }).finally(() => setLoading(false))
  }, [])

  const statusColors = STATUS_COLORS_3

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Available Jobs</h1>
      {loading ? (
        <div className="space-y-3">
          {Array.from({length:5}).map((_,i)=><Skeleton key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : (
      <div className="space-y-3">
        {shipments.map((s) => (
          <Link key={s.id} href={`/driver/shipments/${s.id}`}>
            <Card className="border transition-all cursor-pointer"
              style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{s.tracking_number || "—"}</p>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{s.receiver_name}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.destination_city || s.receiver_address || ""}</p>
                </div>
                <Badge variant="outline" style={statusColors[s.status] || {color:'var(--badge-neutral-text)',borderColor:'var(--badge-neutral-bg)',backgroundColor:'var(--badge-neutral-bg)'}}>
                  {s.status?.replace(/_/g, " ") || "available"}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
        {shipments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No available jobs.</p>}
      </div>
      )}
    </div>
  )
}
