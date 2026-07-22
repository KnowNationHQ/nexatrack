"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import QRCode from "qrcode"
import { useToast } from "@/components/hooks/use-toast"
import {
  ArrowLeft, Package, MapPin, User, Phone, Map, Weight, CreditCard,
  Clock, Share2, Copy, Check, QrCode, FileText, PenSquare,
} from "lucide-react"

const ALL_STATUSES = [
  "pending", "pickup_assign", "picked_up", "received_warehouse",
  "delivery_man_assign", "in_transit", "out_for_delivery",
  "partial_delivered", "delivered", "return_assign_to_merchant",
  "return_received_by_merchant", "cancelled",
]

const statusStyles: Record<string, React.CSSProperties> = {
  pending: {color:'var(--badge-warning-text)',borderColor:'var(--badge-warning-bg)',backgroundColor:'var(--badge-warning-bg)'},
  pickup_assign: {color:'var(--badge-orange-text)',borderColor:'var(--badge-orange-bg)',backgroundColor:'var(--badge-orange-bg)'},
  picked_up: {color:'var(--badge-purple-text)',borderColor:'var(--badge-purple-bg)',backgroundColor:'var(--badge-purple-bg)'},
  received_warehouse: {color:'var(--badge-indigo-text)',borderColor:'var(--badge-indigo-bg)',backgroundColor:'var(--badge-indigo-bg)'},
  delivery_man_assign: {color:'var(--badge-info-text)',borderColor:'var(--badge-info-bg)',backgroundColor:'var(--badge-info-bg)'},
  in_transit: {color:'var(--badge-info-text)',borderColor:'var(--badge-info-bg)',backgroundColor:'var(--badge-info-bg)'},
  out_for_delivery: {color:'var(--badge-info-text)',borderColor:'var(--badge-info-bg)',backgroundColor:'var(--badge-info-bg)'},
  partial_delivered: {color:'var(--badge-warning-text)',borderColor:'var(--badge-warning-bg)',backgroundColor:'var(--badge-warning-bg)'},
  delivered: {color:'var(--badge-success-text)',borderColor:'var(--badge-success-bg)',backgroundColor:'var(--badge-success-bg)'},
  return_assign_to_merchant: {color:'var(--badge-error-text)',borderColor:'var(--badge-error-bg)',backgroundColor:'var(--badge-error-bg)'},
  return_received_by_merchant: {color:'var(--badge-purple-text)',borderColor:'var(--badge-purple-bg)',backgroundColor:'var(--badge-purple-bg)'},
  cancelled: {color:'var(--badge-neutral-text)',borderColor:'var(--badge-neutral-bg)',backgroundColor:'var(--badge-neutral-bg)'},
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

export default function AdminShipmentDetail() {
  const { id } = useParams<{ id: string }>()
  const [shipment, setShipment] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [serviceType, setServiceType] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [newStatus, setNewStatus] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [updating, setUpdating] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetch(`/api/parcels/${id}`).then(r => r.json()).then(async (data) => {
      if (!data.parcel) return
      setShipment(data.parcel)
      setNewStatus(data.parcel.status)
      if (data.serviceType) setServiceType(data.serviceType)
      if (data.category) setCategory(data.category)
      if (data.events) setEvents(data.events)

      const url = `https://nexatrackcourierservices.com/track?number=${data.parcel.tracking_number}`
      try {
        const isDark = document.documentElement.getAttribute("data-theme") !== "light"
        const dataUrl = await QRCode.toDataURL(url, { width: 180, margin: 2, color: { dark: isDark ? "#ffffff" : "#0a0715", light: isDark ? "#0a0715" : "#ffffff" } })
        setQrDataUrl(dataUrl)
      } catch {}
    })
  }, [id])

  const trackingUrl = shipment ? `https://nexatrackcourierservices.com/track?number=${shipment.tracking_number}` : ""

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Nexatrack Shipment", text: `Track ${shipment.tracking_number}: ${trackingUrl}`, url: trackingUrl })
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

  const updateStatus = async () => {
    if (!newStatus || newStatus === shipment.status) return
    setUpdating(true)
    try {
      const res = await fetch("/api/update-shipment-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipment_id: id, status: newStatus, location: newLocation || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast({ title: "Status updated", description: `Changed to ${STATUS_LABELS[newStatus]}` })
      await new Promise(r => setTimeout(r, 200))
      const refreshed = await fetch(`/api/parcels/${id}`).then(r => r.json())
      if (refreshed.parcel) setShipment(refreshed.parcel)
      if (refreshed.events) setEvents(refreshed.events)
      setNewLocation("")
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    }
    setUpdating(false)
  }

  if (!shipment) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>

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
        <Button variant="ghost" onClick={() => router.push("/admin/shipments")}
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipments
        </Button>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/shipments/${id}/edit`}>
            <Button variant="outline" size="sm"
              style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
              <PenSquare size={14} className="mr-1" /> Edit
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={share}
            style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
            <Share2 size={14} className="mr-1" /> Share
          </Button>
          <Button variant="outline" size="sm" onClick={copyLink}
            style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
            {copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}
            {copied ? "Copied" : "Copy Link"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle style={{ color: 'var(--text-primary)' }}>Shipment Details</CardTitle>
                <p className="font-mono text-sm" style={{ color: 'var(--text-muted)' }}>{shipment.tracking_number}</p>
              </div>
              <Badge variant="outline" style={statusStyles[shipment.status]}>
                {STATUS_LABELS[shipment.status] || shipment.status?.replace(/_/g, " ")}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}><User size={14} /> Sender</h3>
                  <p style={{ color: 'var(--text-primary)' }}>{shipment.sender_name}</p>
                  {shipment.sender_phone && <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Phone size={12} />{shipment.sender_phone}</p>}
                  {shipment.sender_address && <p className="flex items-start gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><MapPin size={12} className="mt-0.5" />{shipment.sender_address}</p>}
                </div>
                <div className="space-y-3">
                  <h3 className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--text-muted)' }}><User size={14} /> Receiver</h3>
                  <p style={{ color: 'var(--text-primary)' }}>{shipment.receiver_name}</p>
                  {shipment.receiver_phone && <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Phone size={12} />{shipment.receiver_phone}</p>}
                  {shipment.receiver_address && <p className="flex items-start gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><MapPin size={12} className="mt-0.5" />{shipment.receiver_address}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Map size={12} /> Route</p>
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{shipment.origin_city} → {shipment.destination_city}</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Weight size={12} /> Weight</p>
                  <p style={{ color: 'var(--text-primary)' }}>{shipment.weight} kg</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><Package size={12} /> Priority</p>
                  <p className="capitalize" style={{ color: 'var(--text-primary)' }}>{shipment.priority || "normal"}</p>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1 text-sm" style={{ color: 'var(--text-muted)' }}><CreditCard size={12} /> Payment</p>
                  <Badge variant="outline" style={shipment.payment_status === "paid" ? {color:'var(--badge-success-text)',borderColor:'var(--badge-success-bg)',backgroundColor:'var(--badge-success-bg)'} : {color:'var(--badge-warning-text)',borderColor:'var(--badge-warning-bg)',backgroundColor:'var(--badge-warning-bg)'}}>
                    {shipment.payment_status}
                  </Badge>
                </div>
              </div>

              {(serviceType || category) && (
                <div className="space-y-1">
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Service Type</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceType && <Badge variant="outline" style={{backgroundColor:'var(--badge-info-bg)',color:'var(--badge-info-text)'}}>{serviceType}</Badge>}
                    {category && <Badge variant="outline" style={{backgroundColor:'var(--badge-green-bg)',color:'var(--badge-green-text)'}}>{category}</Badge>}
                  </div>
                </div>
              )}

              <div className="space-y-3 rounded-lg p-4" style={{ border: '1px solid var(--card-border)' }}>
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#FF3E41]"
                    style={{ border: '1px solid var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                  >
                    {ALL_STATUSES.map(s => (
                      <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Location (optional)"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full md:w-48"
                    style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }}
                  />
                </div>
                <Button
                  onClick={updateStatus}
                  disabled={updating || newStatus === shipment.status}
                  className="w-full bg-[#FF3E41] hover:bg-[#d92e31] disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Status"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
            <CardHeader><CardTitle className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><FileText size={16} /> Receipt</CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-4 font-mono text-sm" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
                <div className="mb-3 text-center">
                  <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>NEXATRACK</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Florida&apos;s Fastest Courier</p>
                  <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>{shipment.tracking_number}</p>
                </div>
                <div className="mb-3 border-t border-dashed" style={{ borderColor: 'var(--card-border)' }} />
                <div className="space-y-1">
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}><span>Date</span><span style={{ color: 'var(--text-primary)' }}>{new Date(shipment.created_at).toLocaleDateString()}</span></div>
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}><span>From</span><span className="text-right max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }}>{shipment.origin_city || "—"}</span></div>
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}><span>To</span><span className="text-right max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }}>{shipment.destination_city || "—"}</span></div>
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}><span>Weight</span><span style={{ color: 'var(--text-primary)' }}>{shipment.weight} kg</span></div>
                  <div className="flex justify-between" style={{ color: 'var(--text-muted)' }}><span>Receiver</span><span className="text-right max-w-[200px] truncate" style={{ color: 'var(--text-primary)' }}>{shipment.receiver_name || "—"}</span></div>
                </div>
                <div className="my-3 border-t border-dashed" style={{ borderColor: 'var(--card-border)' }} />
                <div className="space-y-1">
                  {chargeItems.filter(c => Number(c.value)).map(c => (
                    <div key={c.label} className="flex justify-between" style={{ color: 'var(--text-muted)' }}>
                      <span>{c.label}</span>
                      <span style={{ color: 'var(--text-primary)' }}>${Number(c.value).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-dashed pt-2" style={{ borderColor: 'var(--card-border)' }}>
                  <div className="flex justify-between text-base font-bold">
                    <span style={{ color: 'var(--text-primary)' }}>TOTAL</span>
                    <span style={{ color: '#FF3E41' }}>${Number(shipment.total_charge || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-3 text-center text-xs" style={{ color: 'var(--text-muted)' }}>Thank you for choosing Nexatrack</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
            <CardHeader><CardTitle className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><QrCode size={16} /> Track Shipment</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              {qrDataUrl ? (
                <img src={qrDataUrl} alt="QR Code" className="h-40 w-40 rounded-lg" />
              ) : (
                <div className="h-40 w-40 rounded-lg" style={{ backgroundColor: 'var(--input-bg)' }} />
              )}
              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>Scan to track this shipment</p>
              <Button variant="outline" size="sm" onClick={copyLink} className="w-full"
                style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                {copied ? <Check size={14} className="mr-1 text-green-400" /> : <Copy size={14} className="mr-1" />}
                {copied ? "Copied" : "Copy Tracking Link"}
              </Button>
            </CardContent>
          </Card>

          <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
            <CardHeader><CardTitle className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Package size={16} /> Progress</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-1">
                {PROGRESS_STATUSES.map((s) => {
                  const statusIdx = ALL_STATUSES.indexOf(s)
                  const isComplete = currentIdx >= statusIdx && shipment.status !== "cancelled"
                  const isCurrent = s === shipment.status
                  const dot = shipment.status === "cancelled" ? "bg-gray-700" : isComplete ? "bg-green-500" : isCurrent ? "bg-[#FF3E41] animate-pulse" : "bg-[#1a1725]"
                  const textClr = shipment.status === "cancelled" ? "text-[var(--text-muted)]" : isComplete ? "text-green-400" : isCurrent ? "text-white font-medium" : "text-[var(--text-muted)]"
                  return (
                    <div key={s} className="flex items-center gap-2 py-0.5">
                      <div className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <span className={`text-xs ${textClr}`} style={isCurrent && shipment.status !== "cancelled" ? { color: 'var(--text-primary)' } : {}}>
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

      <Card style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
        <CardHeader><CardTitle className="flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><Clock size={16} /> Tracking Timeline</CardTitle></CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No tracking events yet.</p>
          ) : (
            <div className="space-y-4">
              {events.map((e, i) => (
                <div key={e.id} className="relative flex gap-4 pb-4">
                  {i < events.length - 1 && <div className="absolute left-2 top-4 h-full w-px" style={{ backgroundColor: 'var(--card-border)' }} />}
                  <div className={`mt-1.5 h-4 w-4 shrink-0 rounded-full border-2 ${i === 0 ? "border-[#FF3E41] bg-[#FF3E41]/20" : ""}`} style={i !== 0 ? { borderColor: 'var(--card-border)' } : {}} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{e.title}</p>
                    {e.description && <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{e.description}</p>}
                    {e.location && <p className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}><MapPin size={10} />{e.location}</p>}
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date(e.event_time || e.created_at).toLocaleString()}</p>
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
