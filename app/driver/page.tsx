"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DriverDashboard() {
  const [shipments, setShipments] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase.from("parcels").select("*").eq("driver_id", user.id).order("created_at", { ascending: false }).then(({ data }) => {
        if (data) setShipments(data)
      })
    })
  }, [])

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-900/50 text-yellow-400", in_transit: "bg-blue-900/50 text-blue-400",
    delivered: "bg-green-900/50 text-green-400", picked_up: "bg-purple-900/50 text-purple-400",
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">My Jobs</h1>
      {shipments.length === 0 && <p className="text-gray-500">No shipments assigned yet.</p>}
      <div className="space-y-3">
        {shipments.map((s) => (
          <Link key={s.id} href={`/driver/shipments/${s.id}`}>
            <Card className="border-[#1a1725] bg-[#0a0715] hover:border-[#FF3E41]/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-between pt-6">
                <div>
                  <p className="font-mono text-xs text-gray-400">{s.tracking_number || "—"}</p>
                  <p className="text-white font-medium">{s.receiver_name || "—"}</p>
                  <p className="text-sm text-gray-400">{s.destination_city || s.receiver_address || ""}</p>
                </div>
                <Badge variant="outline" className={statusColors[s.status] || ""}>{s.status?.replace(/_/g, " ")}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
