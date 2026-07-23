"use client"

import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { db } from "@/lib/db-client"
import { StatCardSkeleton, ChartSkeleton } from "@/components/ui/skeleton-table"
import { Skeleton } from "@/components/ui/skeleton"
import { getCityCoords } from "@/lib/florida-cities"
import { optimizeRoute, totalRouteDistance } from "@/lib/route-optimizer"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, Clock, MapPin, User, ArrowRight, Navigation } from "lucide-react"

const MockMap = dynamic(() => import("@/components/mock-map"), { ssr: false })

export default function DriverDashboard() {
  const [shipments, setShipments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      Promise.all([
        db<any[]>("parcels", "select", { eq: { driver_id: user.id }, order: { column: "created_at", ascending: false } }),
        db<any[]>("parcels", "select", { eq: { status: "delivery_man_assign" }, isNull: ["driver_id"], order: { column: "created_at", ascending: false } }),
      ]).then(([mine, available]) => {
        const ids = new Set((mine || []).map(s => s.id))
        const combined = [...(mine || []), ...(available || []).filter(s => !ids.has(s.id))]
        setShipments(combined)
      }).finally(() => setLoading(false))
    })
  }, [])

  const routeStops = useMemo(() => {
    const stops: { lat: number; lng: number; label: string }[] = []
    for (const sh of shipments) {
      if (sh.status === "delivered" || sh.status === "cancelled") continue
      const o = sh.origin_lat ? { lat: Number(sh.origin_lat), lng: Number(sh.origin_lng) } : getCityCoords(sh.origin_city || "")
      const d = sh.dest_lat ? { lat: Number(sh.dest_lat), lng: Number(sh.dest_lng) } : getCityCoords(sh.destination_city || "")
      if (o) stops.push({ ...o, label: `Pickup: ${sh.tracking_number}` })
      if (d) stops.push({ ...d, label: `Drop: ${sh.tracking_number}` })
    }
    return stops.length > 2 ? optimizeRoute(stops) : stops
  }, [shipments])

  const routeDist = useMemo(() => routeStops.length > 1 ? totalRouteDistance(routeStops) : 0, [routeStops])

  const active = shipments.filter(s => !["delivered", "cancelled"].includes(s.status))
  const delivered = shipments.filter(s => s.status === "delivered")
  const today = delivered.filter(s => {
    const d = s.updated_at ? new Date(s.updated_at) : null
    return d && d.toDateString() === new Date().toDateString()
  })

  const statusColors: Record<string, {color:string;borderColor:string;backgroundColor:string}> = {
    delivery_man_assign: {color:'var(--badge-orange-text)',borderColor:'var(--badge-orange-bg)',backgroundColor:'var(--badge-orange-bg)'},
    out_for_delivery:    {color:'var(--badge-info-text)',borderColor:'var(--badge-info-bg)',backgroundColor:'var(--badge-info-bg)'},
    in_transit:          {color:'var(--badge-indigo-text)',borderColor:'var(--badge-indigo-bg)',backgroundColor:'var(--badge-indigo-bg)'},
    picked_up:           {color:'var(--badge-purple-text)',borderColor:'var(--badge-purple-bg)',backgroundColor:'var(--badge-purple-bg)'},
    delivered:           {color:'var(--badge-success-text)',borderColor:'var(--badge-success-bg)',backgroundColor:'var(--badge-success-bg)'},
    pending:             {color:'var(--badge-warning-text)',borderColor:'var(--badge-warning-bg)',backgroundColor:'var(--badge-warning-bg)'},
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
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Driver Portal</h1>

      {loading ? (
        <>
          <StatCardSkeleton count={4} />
          <ChartSkeleton height={300} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {Array.from({length:3}).map((_,i)=>(
              <div key={i} className="rounded-xl border p-5" style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
                <Skeleton className="mb-3 h-4 w-24" />
                <Skeleton className="mb-2 h-5 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
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

          {routeStops.length > 0 && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>My Route</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{routeStops.length} stops · {routeDist.toFixed(1)} mi</p>
              </div>
              <div className="mb-6">
                <MockMap
                  origin={routeStops[0]}
                  destination={routeStops[routeStops.length - 1]}
                  originLabel={routeStops[0]?.label}
                  destLabel={routeStops[routeStops.length - 1]?.label}
                />
              </div>
              <div className="mb-6 flex flex-wrap gap-1">
                <Navigation size={14} className="mr-1" style={{ color: 'var(--text-muted)' }} />
                {routeStops.map((s, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]" style={i === 0 ? {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'} : i === routeStops.length - 1 ? {backgroundColor:'var(--badge-error-bg)',color:'var(--badge-error-text)'} : {backgroundColor:'var(--badge-info-bg)',color:'var(--badge-info-text)'}}>
                    {i + 1}. {s.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>My Jobs</h2>
          {shipments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No shipments assigned yet.</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
                      <Badge variant="outline" className="text-[11px] px-2 py-0" style={statusColors[s.status] || {color:'var(--badge-neutral-text)',borderColor:'var(--badge-neutral-bg)',backgroundColor:'var(--badge-neutral-bg)'}}>
                        {s.status?.replace(/_/g, " ") || "available"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
