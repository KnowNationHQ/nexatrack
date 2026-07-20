"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-browser"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Package, MapPin, User, Phone, Map, Weight, CreditCard, Clock } from "lucide-react"

export default function MerchantShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [shipment, setShipment] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.from("parcels").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setShipment(data)
    })
    supabase.from("tracking_events").select("*").eq("shipment_id", id).order("event_time", { ascending: false }).then(({ data }) => {
      if (data) setEvents(data)
    })
  }, [id])

  if (!shipment) return <p className="text-gray-500">Loading...</p>

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-900/50 text-yellow-400", in_transit: "bg-blue-900/50 text-blue-400",
    delivered: "bg-green-900/50 text-green-400", picked_up: "bg-purple-900/50 text-purple-400",
    cancelled: "bg-gray-900/50 text-gray-400", returned: "bg-red-900/50 text-red-400",
  }

  const chargeItems = [
    { label: "Delivery Charge", value: shipment.delivery_charge },
    { label: "VAT", value: shipment.vat_amount },
    { label: "COD Charge", value: shipment.cod_charge },
    { label: "Packaging Charge", value: shipment.packaging_charge },
    { label: "Liquid/Fragile Charge", value: shipment.liquid_fragile_charge },
  ]

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.push("/merchant/shipments")} className="text-gray-400 hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipments
      </Button>

      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">Shipment Details</CardTitle>
            <p className="font-mono text-sm text-gray-400">{shipment.tracking_number}</p>
          </div>
          <Badge variant="outline" className={statusColors[shipment.status] || ""}>{shipment.status?.replace(/_/g, " ")}</Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-400"><User size={14} /> Sender</h3>
              <p className="text-white">{shipment.sender_name}</p>
              {shipment.sender_phone && <p className="flex items-center gap-1 text-sm text-gray-400"><Phone size={12} />{shipment.sender_phone}</p>}
              {shipment.sender_address && <p className="flex items-start gap-1 text-sm text-gray-400"><MapPin size={12} className="mt-0.5" />{shipment.sender_address}</p>}
            </div>
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-medium text-gray-400"><User size={14} /> Receiver</h3>
              <p className="text-white">{shipment.receiver_name}</p>
              {shipment.receiver_phone && <p className="flex items-center gap-1 text-sm text-gray-400"><Phone size={12} />{shipment.receiver_phone}</p>}
              {shipment.receiver_address && <p className="flex items-start gap-1 text-sm text-gray-400"><MapPin size={12} className="mt-0.5" />{shipment.receiver_address}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-sm text-gray-400"><Map size={12} /> Route</p>
              <p className="text-white">{shipment.origin_city} → {shipment.destination_city}</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-sm text-gray-400"><Weight size={12} /> Weight</p>
              <p className="text-white">{shipment.weight} kg</p>
            </div>
            <div className="space-y-1">
              <p className="flex items-center gap-1 text-sm text-gray-400"><CreditCard size={12} /> Payment</p>
              <Badge variant="outline" className={shipment.payment_status === "paid" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}>
                {shipment.payment_status}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Charges</h3>
            <div className="rounded-lg border border-[#1a1725] p-3">
              {chargeItems.filter(c => Number(c.value)).map(c => (
                <div key={c.label} className="flex justify-between py-1 text-sm">
                  <span className="text-gray-400">{c.label}</span>
                  <span className="text-white">${Number(c.value).toFixed(2)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-[#1a1725] pt-2 font-medium">
                <span className="text-white">Total</span>
                <span className="text-white">${Number(shipment.total_charge || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {events.length > 0 && (
        <Card className="border-[#1a1725] bg-[#0a0715]">
          <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Clock size={16} /> Tracking Timeline</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((e, i) => (
                <div key={e.id} className="relative flex gap-4 pb-4">
                  {i < events.length - 1 && <div className="absolute left-2 top-4 h-full w-px bg-[#1a1725]" />}
                  <div className="mt-1.5 h-4 w-4 rounded-full border-2 border-[#FF3E41] bg-[#0a0715]" />
                  <div className="flex-1">
                    <p className="text-white">{e.title}</p>
                    {e.description && <p className="text-sm text-gray-400">{e.description}</p>}
                    {e.location && <p className="text-xs text-gray-500">{e.location}</p>}
                    <p className="text-xs text-gray-500">{new Date(e.event_time || e.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
