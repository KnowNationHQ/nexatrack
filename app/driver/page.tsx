"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, Clock, MapPin, User, ArrowRight } from "lucide-react"

export default function DriverDashboard() {
  const [shipments, setShipments] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      db<any[]>("parcels", "select", { eq: { driver_id: user.id }, order: { column: "created_at", ascending: false } }).then((data) => {
        if (data) setShipments(data)
      })
    })
  }, [])

  const active = shipments.filter(s => !["delivered", "cancelled"].includes(s.status))
  const delivered = shipments.filter(s => s.status === "delivered")
  const today = delivered.filter(s => {
    const d = s.updated_at ? new Date(s.updated_at) : null
    return d && d.toDateString() === new Date().toDateString()
  })

  const statusColors: Record<string, string> = {
    delivery_man_assign: "text-orange-400 border-orange-900/50 bg-orange-900/20",
    out_for_delivery:    "text-blue-400 border-blue-900/50 bg-blue-900/20",
    in_transit:          "text-indigo-400 border-indigo-900/50 bg-indigo-900/20",
    picked_up:           "text-purple-400 border-purple-900/50 bg-purple-900/20",
    delivered:           "text-green-400 border-green-900/50 bg-green-900/20",
    pending:             "text-yellow-400 border-yellow-900/50 bg-yellow-900/20",
  }

  const dotColors: Record<string, string> = {
    delivery_man_assign: "bg-orange-400", out_for_delivery: "bg-blue-400",
    in_transit: "bg-indigo-400", picked_up: "bg-purple-400",
    delivered: "bg-green-400", pending: "bg-yellow-400",
  }

  const statCards = [
    { label: "Active Jobs", value: active.length, icon: Truck, color: "text-blue-400", sub: "Currently assigned" },
    { label: "Delivered", value: delivered.length, icon: CheckCircle, color: "text-green-400", sub: "All time" },
    { label: "Delivered Today", value: today.length, icon: Clock, color: "text-amber-400", sub: new Date().toLocaleDateString() },
    { label: "Total Jobs", value: shipments.length, icon: Package, color: "text-purple-400", sub: "All assignments" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Driver Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border transition-all cursor-default"
              style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.sub}</p>
                    </div>
                  </div>
                  <Icon size={24} className={`${s.color} opacity-80`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>My Jobs</h2>
      {shipments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No shipments assigned yet.</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shipments.map((s) => (
          <Link key={s.id} href={`/driver/shipments/${s.id}`} className="group">
            <Card className="h-full border transition-all"
              style={{
                borderColor: 'var(--card-border)',
                backgroundColor: 'var(--card-bg)',
              }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{s.tracking_number || "—"}</span>
                  <span className={`h-2 w-2 rounded-full ${dotColors[s.status] || "bg-gray-400"} shadow-sm`} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{s.receiver_name || "—"}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <span className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                      {s.origin_city || "—"} <ArrowRight size={12} className="inline" style={{ color: 'var(--text-muted)' }} /> {s.destination_city || s.receiver_address || "—"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--card-border)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.weight ? `${s.weight} kg` : "—"}</span>
                  <Badge variant="outline" className={`text-[11px] px-2 py-0 ${statusColors[s.status] || "text-gray-400 border-gray-700 bg-gray-900/20"}`}>
                    {s.status?.replace(/_/g, " ") || "available"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
