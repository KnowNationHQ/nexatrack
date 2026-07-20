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
    pending: "bg-yellow-900/50 text-yellow-400", in_transit: "bg-blue-900/50 text-blue-400",
    picked_up: "bg-purple-900/50 text-purple-400",
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Available Jobs</h1>
      {shipments.map((s) => (
        <Link key={s.id} href={`/driver/shipments/${s.id}`}>
          <Card className="mb-3 border-[#1a1725] bg-[#0a0715] hover:border-[#FF3E41]/50 cursor-pointer transition-colors">
            <CardContent className="flex items-center justify-between pt-6">
              <div>
                <p className="font-mono text-xs text-gray-400">{s.tracking_number || "—"}</p>
                <p className="font-medium text-white">{s.receiver_name}</p>
                <p className="text-sm text-gray-400">{s.destination_city || s.receiver_address || ""}</p>
              </div>
              <Badge variant="outline" className={statusColors[s.status] || "bg-gray-900/50 text-gray-400"}>{s.status?.replace(/_/g, " ") || "available"}</Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
      {shipments.length === 0 && <p className="text-gray-500">No available jobs.</p>}
    </div>
  )
}
