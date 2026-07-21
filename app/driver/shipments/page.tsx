"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/db-client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AllJobsPage() {
  const [shipments, setShipments] = useState<any[]>([])

  useEffect(() => {
    db<{ data: any[] }>("parcels", "select", { neq: [{ col: "status", val: "delivered" }, { col: "status", val: "cancelled" }], order: { column: "created_at", ascending: false } }).then(({ data }) => {
      if (data) setShipments(data)
    })
  }, [])

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400 border-yellow-900/50 bg-yellow-900/20",
    in_transit: "text-blue-400 border-blue-900/50 bg-blue-900/20",
    picked_up: "text-purple-400 border-purple-900/50 bg-purple-900/20",
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Available Jobs</h1>
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
                <Badge variant="outline" className={statusColors[s.status] || "text-gray-400 border-gray-700 bg-gray-900/20"}>
                  {s.status?.replace(/_/g, " ") || "available"}
                </Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
        {shipments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No available jobs.</p>}
      </div>
    </div>
  )
}
