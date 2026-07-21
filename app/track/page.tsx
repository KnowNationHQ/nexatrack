"use client"

import dynamic from "next/dynamic"
import { Suspense, useEffect, useState } from "react"

const MapView = dynamic(() => import("@/components/map"), { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse rounded-lg bg-gray-800" /> })
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Package, MapPin, Share2, Copy, Check, ChevronRight, Shield, Truck } from "lucide-react"

const ALL_STATUSES = [
  "pending", "pickup_assign", "picked_up", "received_warehouse",
  "delivery_man_assign", "in_transit", "out_for_delivery",
  "partial_delivered", "delivered",
]

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", pickup_assign: "Pickup Assigned", picked_up: "Picked Up",
  received_warehouse: "At Warehouse", delivery_man_assign: "Driver Assigned",
  in_transit: "In Transit", out_for_delivery: "Out for Delivery",
  partial_delivered: "Partially Delivered", delivered: "Delivered",
  cancelled: "Cancelled",
}

const statusColors: Record<string, {backgroundColor:string;color:string}> = {
  pending: {backgroundColor:'var(--badge-warning-bg)',color:'var(--badge-warning-text)'},
  picked_up: {backgroundColor:'var(--badge-purple-bg)',color:'var(--badge-purple-text)'},
  in_transit: {backgroundColor:'var(--badge-info-bg)',color:'var(--badge-info-text)'},
  delivered: {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'},
  returned: {backgroundColor:'var(--badge-error-bg)',color:'var(--badge-error-text)'},
  cancelled: {backgroundColor:'var(--badge-neutral-bg)',color:'var(--badge-neutral-text)'},
}

function TrackPageInner() {
  const [tracking, setTracking] = useState("")
  const [shipment, setShipment] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [driverLoc, setDriverLoc] = useState<{latitude: number; longitude: number} | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const num = searchParams.get("number")
    if (num) {
      setTracking(num)
      doTrack(num)
    }
  }, [])

  async function doTrack(num: string) {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/track-shipment?number=${encodeURIComponent(num)}`)
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      setShipment(data.parcel)
      if (data.events) setEvents(data.events)
      if (data?.parcel?.id) {
        fetch(`/api/driver-location?shipment_id=${data.parcel.id}`)
          .then(r => r.json())
          .then(loc => { if (loc?.latitude) setDriverLoc(loc) })
          .catch(() => {})
      }
    } catch { setError("Something went wrong.") }
    setLoading(false)
  }

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tracking.trim()) return
    doTrack(tracking.trim())
  }

  const trackingUrl = shipment ? `https://nexatrackcourierservices.com/track?number=${shipment.tracking_number}` : ""

  const copyLink = async () => {
    await navigator.clipboard.writeText(trackingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Track my shipment ${shipment.tracking_number}: ${trackingUrl}`)}`, "_blank")
  }

  const shareSMS = () => {
    window.open(`sms:?body=${encodeURIComponent(`Track my shipment ${shipment.tracking_number}: ${trackingUrl}`)}`, "_blank")
  }

  const currentIdx = shipment ? ALL_STATUSES.indexOf(shipment.status) : -1

  return (
    <div className="min-h-screen p-4 md:p-8" style={{backgroundColor:'var(--card-bg)'}}>
      <div className="mx-auto w-full max-w-2xl px-4">
        <div className="mb-8 flex items-center gap-3">
          <Package className="h-8 w-8 text-[#FF3E41]" />
          <div>
            <h1 className="text-3xl font-bold" style={{color:'var(--text-primary)'}}>Track Your Shipment</h1>
            <p className="text-sm" style={{color:'var(--text-muted)'}}>Enter your tracking number to see real-time updates</p>
          </div>
        </div>

        <Card className="mb-6" style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
          <CardContent className="pt-6">
            <form onSubmit={handleTrack} className="flex gap-2">
              <Input
                placeholder="Enter tracking number (e.g. NXT-...)"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                style={{borderColor:'var(--card-border)',backgroundColor:'var(--input-bg)',color:'var(--text-primary)'}}
              />
              <Button type="submit" disabled={loading} className="bg-[#FF3E41] hover:bg-[#d92e31]">
                <Search size={16} className="mr-1" /> Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && <p className="mb-4 text-center text-red-400">{error}</p>}

        {shipment && (
          <>
            <Card className="mb-4" style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
              <CardHeader>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <CardTitle className="" style={{color:'var(--text-primary)'}}>Shipment Status</CardTitle>
                    <p className="font-mono text-xs" style={{color:'var(--text-muted)'}}>{shipment.tracking_number}</p>
                  </div>
                  <Badge variant="outline" style={statusColors[shipment.status]}>
                    {STATUS_LABELS[shipment.status] || shipment.status?.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm" style={{color:'var(--text-muted)'}}>From</p>
                    <p style={{color:'var(--text-primary)'}}>{shipment.origin_city || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{color:'var(--text-muted)'}}>To</p>
                    <p style={{color:'var(--text-primary)'}}>{shipment.destination_city || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{color:'var(--text-muted)'}}>Weight</p>
                    <p style={{color:'var(--text-primary)'}}>{shipment.weight} kg</p>
                  </div>
                  <div>
                    <p className="text-sm" style={{color:'var(--text-muted)'}}>Status</p>
                    <p className="capitalize" style={{color:'var(--text-primary)'}}>{shipment.status?.replace(/_/g, " ")}</p>
                  </div>
                </div>

                {shipment.status !== "cancelled" && (
                  <div className="space-y-2">
                    <p className="text-xs" style={{color:'var(--text-muted)'}}>Progress</p>
                    <div className="flex items-center gap-1 overflow-x-auto pb-1">
                      {ALL_STATUSES.map((s, i) => {
                        const isComplete = currentIdx > i || (currentIdx === i && s === shipment.status)
                        const isCurrent = s === shipment.status
                        return (
                          <div key={s} className="flex items-center gap-1">
                            <div className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${
                              isCurrent ? "bg-[#FF3E41] text-white" : ""
                            }`} style={isCurrent ? undefined : isComplete ? {backgroundColor:'var(--badge-success-bg)',color:'var(--badge-success-text)'} : {backgroundColor:'var(--input-bg)',color:'var(--text-muted)'}}>
                              {STATUS_LABELS[s]}
                            </div>
                            {i < ALL_STATUSES.length - 1 && (
                              <ChevronRight size={12} className="shrink-0" style={{color: isComplete && i < ALL_STATUSES.length - 1 ? '#22c55e' : 'var(--card-border)'}} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={shareWhatsApp} style={{borderColor:'var(--card-border)',color:'var(--text-muted)'}} onMouseEnter={(e)=>(e.currentTarget.style.color='white')} onMouseLeave={(e)=>(e.currentTarget.style.color='var(--text-muted)')}>
                    <Share2 size={14} className="mr-1" /> WhatsApp
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareSMS} style={{borderColor:'var(--card-border)',color:'var(--text-muted)'}} onMouseEnter={(e)=>(e.currentTarget.style.color='white')} onMouseLeave={(e)=>(e.currentTarget.style.color='var(--text-muted)')}>
                    <Share2 size={14} className="mr-1" /> SMS
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyLink} style={{borderColor:'var(--card-border)',color:'var(--text-muted)'}} onMouseEnter={(e)=>(e.currentTarget.style.color='white')} onMouseLeave={(e)=>(e.currentTarget.style.color='var(--text-muted)')}>
                    {copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}
                    {copied ? "Copied" : "Copy Link"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {driverLoc && (
              <div className="mt-6">
                <h2 className="mb-3 text-lg font-semibold" style={{color:'var(--text-primary)'}}>Driver Location</h2>
                <MapView
                  center={[driverLoc.latitude, driverLoc.longitude]}
                  zoom={15}
                  markers={[{ lat: driverLoc.latitude, lng: driverLoc.longitude, label: "Driver" }]}
                />
              </div>
            )}

            {events.length > 0 && (
              <Card className="mb-4" style={{borderColor:'var(--card-border)',backgroundColor:'var(--card-bg)'}}>
                <CardHeader><CardTitle className="" style={{color:'var(--text-primary)'}}>Tracking History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((e, i) => (
                      <div key={e.id || i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full" style={{backgroundColor: i === 0 ? '#FF3E41' : 'var(--card-border)'}} />
                          {i < events.length - 1 && <div className="w-0.5 flex-1" style={{backgroundColor:'var(--card-border)'}} />}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium" style={{color:'var(--text-primary)'}}>{e.title}</p>
                          {e.location && <p className="flex items-center gap-1 text-sm" style={{color:'var(--text-muted)'}}><MapPin size={12} />{e.location}</p>}
                          {e.description && <p className="text-sm" style={{color:'var(--text-muted)'}}>{e.description}</p>}
                          <p className="text-xs" style={{color:'var(--text-muted)'}}>{e.event_time ? new Date(e.event_time).toLocaleString() : e.created_at ? new Date(e.created_at).toLocaleString() : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border bg-[#0d0a18] p-4" style={{borderColor:'var(--card-border)'}}>
              <div className="flex items-center gap-2 text-sm" style={{color:'var(--text-muted)'}}>
                <Truck size={16} className="text-[#FF3E41]" />
                <span>1,000+ deliveries across Florida</span>
              </div>
              <div className="flex items-center gap-2 text-sm" style={{color:'var(--text-muted)'}}>
                <Shield size={16} className="text-green-400" />
                <span>Real-time tracking</span>
              </div>
              <Link href="/auth/register" className="text-sm text-[#FF3E41] hover:underline">
                Ship with us →
              </Link>
            </div>
          </>
        )}

        {!shipment && !loading && tracking && (
          <div className="flex flex-wrap items-center justify-center gap-4 rounded-lg border bg-[#0d0a18] p-4" style={{borderColor:'var(--card-border)'}}>
            <p className="text-sm" style={{color:'var(--text-muted)'}}>Need to send a package?</p>
            <Link href="/auth/register" className="text-sm font-medium text-[#FF3E41] hover:underline">
              Sign up free → Nexatrack
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function TrackPage() {
  return <Suspense><TrackPageInner /></Suspense>
}
