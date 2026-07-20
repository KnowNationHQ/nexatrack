"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import QRCode from "qrcode"
import {
  ArrowLeft, Package, MapPin, User, Phone, Map, Weight, CreditCard,
  Clock, Share2, Copy, Check, QrCode, FileText, ChevronDown,
} from "lucide-react"

const ALL_STATUSES = [
  "pending", "pickup_assign", "picked_up", "received_warehouse",
  "delivery_man_assign", "in_transit", "out_for_delivery",
  "partial_delivered", "delivered", "return_assign_to_merchant",
  "return_received_by_merchant", "cancelled",
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-900/50 text-yellow-400", pickup_assign: "bg-orange-900/50 text-orange-400",
  picked_up: "bg-purple-900/50 text-purple-400", received_warehouse: "bg-indigo-900/50 text-indigo-400",
  delivery_man_assign: "bg-cyan-900/50 text-cyan-400", in_transit: "bg-blue-900/50 text-blue-400",
  out_for_delivery: "bg-sky-900/50 text-sky-400", partial_delivered: "bg-amber-900/50 text-amber-400",
  delivered: "bg-green-900/50 text-green-400", return_assign_to_merchant: "bg-rose-900/50 text-rose-400",
  return_received_by_merchant: "bg-pink-900/50 text-pink-400", cancelled: "bg-gray-900/50 text-gray-400",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", pickup_assign: "Pickup Assigned", picked_up: "Picked Up",
  received_warehouse: "At Warehouse", delivery_man_assign: "Driver Assigned",
  in_transit: "In Transit", out_for_delivery: "Out for Delivery",
  partial_delivered: "Partially Delivered", delivered: "Delivered",
  return_assign_to_merchant: "Return Initiated", return_received_by_merchant: "Returned",
  cancelled: "Cancelled",
}

const PROGRESS_STATUSES = ALL_STATUSES.filter(s => s !== "cancelled")

export default function MerchantShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [shipment, setShipment] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [serviceType, setServiceType] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const qrRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/parcels/${id}`).then(r => r.json()).then(async (data) => {
      if (!data.parcel) return
      setShipment(data.parcel)
      if (data.serviceType) setServiceType(data.serviceType)
      if (data.category) setCategory(data.category)
      if (data.events) setEvents(data.events)

      const url = `https://nexatrackcourierservices.com/track?number=${data.parcel.tracking_number}`
      try {
        const dataUrl = await QRCode.toDataURL(url, { width: 180, margin: 2, color: { dark: "#ffffff", light: "#0a0715" } })
        setQrDataUrl(dataUrl)
      } catch {}
    })
  }, [id])

  const trackingUrl = shipment ? `https://nexatrackcourierservices.com/track?number=${shipment.tracking_number}` : ""

  const share = async () => {
    const text = `Track your shipment ${shipment.tracking_number}: ${trackingUrl}`
    if (navigator.share) {
      await navigator.share({ title: "Nexatrack Shipment", text, url: trackingUrl })
    } else {
      await navigator.clipboard.writeText(trackingUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(trackingUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!shipment) return <p className="text-gray-500">Loading...</p>

  const currentIdx = ALL_STATUSES.indexOf(shipment.status)
  const chargeItems = [
    { label: "Delivery Charge", value: shipment.delivery_charge },
    { label: "VAT", value: shipment.vat_amount },
    { label: "COD Charge", value: shipment.cod_charge },
    { label: "Packaging Charge", value: shipment.packaging_charge },
    { label: "Liquid/Fragile Charge", value: shipment.liquid_fragile_charge },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push("/merchant/shipments")} className="text-gray-400 hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={share} className="border-[#1a1725] text-gray-400 hover:text-white">
            <Share2 size={14} className="mr-1" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={copyLink} className="border-[#1a1725] text-gray-400 hover:text-white">
            {copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="border-[#1a1725] bg-[#0a0715]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Shipment Details</CardTitle>
                <p className="font-mono text-sm text-gray-400">{shipment.tracking_number}</p>
              </div>
              <Badge variant="outline" className={statusColors[shipment.status] || ""}>
                {STATUS_LABELS[shipment.status] || shipment.status?.replace(/_/g, " ")}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm text-gray-400"><Map size={12} /> Route</p>
                  <p className="text-white text-sm">{shipment.origin_city} → {shipment.destination_city}</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm text-gray-400"><Weight size={12} /> Weight</p>
                  <p className="text-white">{shipment.weight} kg</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm text-gray-400"><Package size={12} /> Priority</p>
                  <p className="text-white capitalize">{shipment.priority || "normal"}</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm text-gray-400"><CreditCard size={12} /> Payment</p>
                  <Badge variant="outline" className={shipment.payment_status === "paid" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}>
                    {shipment.payment_status}
                  </Badge>
                </div>
              </div>

              {(serviceType || category) && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-400">Service Type</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceType && <Badge variant="outline" className="border-blue-700 bg-blue-900/30 text-blue-300">{serviceType}</Badge>}
                    {category && <Badge variant="outline" className="border-emerald-700 bg-emerald-900/30 text-emerald-300">{category}</Badge>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-[#1a1725] bg-[#0a0715]">
            <CardHeader><CardTitle className="flex items-center gap-2 text-white"><FileText size={16} /> Receipt</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-[#1a1725] bg-[#0d0a18] p-4 font-mono text-sm">
                <div className="mb-3 text-center">
                  <p className="text-lg font-bold text-white">NEXATRACK</p>
                  <p className="text-xs text-gray-500">Florida&apos;s Fastest Courier</p>
                  <p className="mt-1 text-xs text-gray-500">{shipment.tracking_number}</p>
                </div>
                <div className="mb-3 border-t border-dashed border-[#1a1725]" />
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400"><span>Date</span><span className="text-white">{new Date(shipment.created_at).toLocaleDateString()}</span></div>
                  <div className="flex justify-between text-gray-400"><span>From</span><span className="text-white text-right max-w-[200px] truncate">{shipment.origin_city || "—"}</span></div>
                  <div className="flex justify-between text-gray-400"><span>To</span><span className="text-white text-right max-w-[200px] truncate">{shipment.destination_city || "—"}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Weight</span><span className="text-white">{shipment.weight} kg</span></div>
                  <div className="flex justify-between text-gray-400"><span>Receiver</span><span className="text-white text-right max-w-[200px] truncate">{shipment.receiver_name || "—"}</span></div>
                </div>
                <div className="my-3 border-t border-dashed border-[#1a1725]" />
                <div className="space-y-1">
                  {chargeItems.filter(c => Number(c.value)).map(c => (
                    <div key={c.label} className="flex justify-between text-gray-400">
                      <span>{c.label}</span>
                      <span className="text-white">${Number(c.value).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-dashed border-[#1a1725] pt-2">
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-white">TOTAL</span>
                    <span className="text-[#FF3E41]">${Number(shipment.total_charge || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3 text-center text-xs text-gray-500">Thank you for choosing Nexatrack</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-[#1a1725] bg-[#0a0715]">
            <CardHeader><CardTitle className="flex items-center gap-2 text-white"><QrCode size={16} /> Track Shipment</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="h-40 w-40 rounded-lg" />
              ) : (
                <canvas ref={qrRef} className="h-40 w-40 rounded-lg" />
              )}
              <p className="text-xs text-gray-500 text-center">Scan to track this shipment</p>
              <Button variant="outline" size="sm" onClick={copyLink} className="w-full border-[#1a1725] text-gray-400 hover:text-white">
                {copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}
                {copied ? "Copied" : "Copy Tracking Link"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-[#1a1725] bg-[#0a0715]">
            <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Package size={16} /> Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1">
                {PROGRESS_STATUSES.map((s, i) => {
                  const statusIdx = ALL_STATUSES.indexOf(s)
                  const isComplete = currentIdx >= statusIdx && shipment.status !== "cancelled"
                  const isCurrent = s === shipment.status
                  return (
                    <div key={s} className="flex items-center gap-2 py-0.5">
                      <div className={`h-2 w-2 shrink-0 rounded-full ${shipment.status === "cancelled" ? "bg-gray-700" : isComplete ? "bg-green-500" : isCurrent ? "bg-[#FF3E41] animate-pulse" : "bg-[#1a1725]"}`} />
                      <span className={`text-xs ${shipment.status === "cancelled" ? "text-gray-600" : isComplete ? "text-green-400" : isCurrent ? "text-white font-medium" : "text-gray-600"}`}>
                        {STATUS_LABELS[s]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-[#1a1725] bg-[#0a0715]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Clock size={16} /> Tracking Timeline</CardTitle></CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No tracking events yet.</p>
          ) : (
            <div className="space-y-4">
              {events.map((e, i) => (
                <div key={e.id} className="relative flex gap-4 pb-4">
                  {i < events.length - 1 && <div className="absolute left-2 top-4 h-full w-px bg-[#1a1725]" />}
                  <div className={`mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 ${i === 0 ? "border-[#FF3E41] bg-[#FF3E41]/20" : "border-[#1a1725]"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{e.title}</p>
                    {e.description && <p className="text-xs text-gray-400">{e.description}</p>}
                    {e.location && <p className="flex items-center gap-1 text-xs text-gray-500"><MapPin size={10} />{e.location}</p>}
                    <p className="text-xs text-gray-600">{new Date(e.event_time || e.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
