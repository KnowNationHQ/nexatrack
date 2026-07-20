"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Package } from "lucide-react"

export default function TrackPage() {
  const [tracking, setTracking] = useState("")
  const [shipment, setShipment] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const supabase = createClient()

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setShipment(null)
    setEvents([])
    if (!tracking.trim()) return

    setLoading(true)
    const { data: parcel } = await supabase
      .from("parcels")
      .select("*")
      .ilike("tracking_number", tracking.trim())
      .single()

    if (!parcel) {
      setError("No shipment found with that tracking number")
      setLoading(false)
      return
    }

    setShipment(parcel)
    const { data: trackingEvents } = await supabase
      .from("tracking_events")
      .select("*")
      .eq("parcel_id", parcel.id)
      .order("created_at", { ascending: false })
    if (trackingEvents) setEvents(trackingEvents)
    setLoading(false)
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-900/50 text-yellow-400",
    picked_up: "bg-purple-900/50 text-purple-400",
    in_transit: "bg-blue-900/50 text-blue-400",
    delivered: "bg-green-900/50 text-green-400",
    returned: "bg-red-900/50 text-red-400",
    cancelled: "bg-gray-900/50 text-gray-400",
  }

  return (
    <div className="min-h-screen bg-[#0a0715] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-3">
          <Package className="h-8 w-8 text-[#FF3E41]" />
          <h1 className="text-3xl font-bold text-white">Track Your Shipment</h1>
        </div>

        <Card className="mb-6 border-[#1a1725] bg-[#0a0715]">
          <CardContent className="pt-6">
            <form onSubmit={handleTrack} className="flex gap-2">
              <Input
                placeholder="Enter tracking number (e.g. NXT-...)"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                className="border-[#1a1725] bg-[#1a1725] text-white"
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
            <Card className="mb-4 border-[#1a1725] bg-[#0a0715]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Shipment Status</CardTitle>
                  <Badge variant="outline" className={statusColors[shipment.status] || ""}>
                    {shipment.status?.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-400">Tracking Number</p>
                  <p className="font-mono text-white">{shipment.tracking_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">From</p>
                  <p className="text-white">{shipment.origin_city || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">To</p>
                  <p className="text-white">{shipment.destination_city || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Weight</p>
                  <p className="text-white">{shipment.weight} kg</p>
                </div>
                {shipment.receiver_name && (
                  <div>
                    <p className="text-sm text-gray-400">Receiver</p>
                    <p className="text-white">{shipment.receiver_name}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {events.length > 0 && (
              <Card className="border-[#1a1725] bg-[#0a0715]">
                <CardHeader><CardTitle className="text-white">Tracking History</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.map((e, i) => (
                      <div key={e.id || i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${i === 0 ? "bg-[#FF3E41]" : "bg-[#1a1725]"}`} />
                          {i < events.length - 1 && <div className="w-0.5 flex-1 bg-[#1a1725]" />}
                        </div>
                        <div className="pb-4">
                          <p className="font-medium text-white capitalize">{e.status?.replace(/_/g, " ") || "Update"}</p>
                          {e.location && <p className="text-sm text-gray-400">{e.location}</p>}
                          {e.description && <p className="text-sm text-gray-400">{e.description}</p>}
                          <p className="text-xs text-gray-500">{e.created_at ? new Date(e.created_at).toLocaleString() : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
