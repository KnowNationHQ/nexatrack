"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import QRCode from "qrcode"
import { useToast } from "@/components/hooks/use-toast"
import { DetailSkeleton, TableSkeleton } from "@/components/ui/skeleton-table"
import {
  ArrowLeft, Package, MapPin, User, Phone, Map, Weight, CreditCard,
  Clock, Share2, Copy, Check, QrCode, FileText, PenSquare, Loader2,
} from "lucide-react"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

import { ALL_STATUSES, STATUS_LABELS, STATUS_COLORS_3, PROGRESS_STATUSES } from "@/lib/statuses"
const statusStyles = STATUS_COLORS_3 as unknown as Record<string, React.CSSProperties>

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
  const [showSuccess, setShowSuccess] = useState(false)
  const [successStatus, setSuccessStatus] = useState("")
  const [sending, setSending] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)
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

  const shareAsPdf = async () => {
    if (!receiptRef.current) return
    setSending(true)
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
      })

      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ format: "a5", unit: "px", orientation: "portrait" })
      const pdfW = pdf.internal.pageSize.getWidth()
      const pdfH = (canvas.height * pdfW) / canvas.width
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH)

      const blob = pdf.output("blob")
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `nexatrack-${shipment.tracking_number}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setTimeout(() => URL.revokeObjectURL(url), 5000)
    } catch (e) {
      toast({ title: "PDF Error", description: String(e), variant: "destructive" })
    }
    setSending(false)
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
      setSuccessStatus(newStatus)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2500)
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

  if (!shipment) return <DetailSkeleton />

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Button variant="ghost" onClick={() => router.push("/admin/shipments")}
          className="self-start sm:self-auto"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shipments
        </Button>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/shipments/${id}/edit`}>
            <Button size="sm" className="bg-[#FF3E41] hover:bg-[#d92e31] text-white">
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
              <div ref={receiptRef} className="relative overflow-hidden rounded-xl border text-sm" style={{ borderColor: 'var(--card-border)', background: '#fff' }}>
                <div className="relative z-10 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold tracking-wider" style={{ color: 'var(--text-primary)' }}>NEXATRACK</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Florida&apos;s Fastest Courier</p>
                    </div>
                    <div className="hidden sm:block text-right">
                      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{shipment.tracking_number}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg p-3" style={{ backgroundColor: 'rgba(128,128,128,0.08)' }}>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{new Date(shipment.created_at).toLocaleDateString()}</span></span>
                      <span>{shipment.origin_city || "—"} <span className="mx-1">→</span> {shipment.destination_city || "—"}</span>
                      <span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{shipment.weight}</span> kg</span>
                    </div>
                    <p className="font-mono text-xs sm:hidden" style={{ color: 'var(--text-muted)' }}>{shipment.tracking_number}</p>
                  </div>

                  <div className="mb-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <User size={12} /> {shipment.receiver_name || "—"}
                    </div>
                    {chargeItems.filter(c => Number(c.value)).length > 0 && (
                      <>
                        <div className="my-3 border-t" style={{ borderColor: 'var(--card-border)', opacity: 0.4 }} />
                        {chargeItems.filter(c => Number(c.value)).map(c => (
                          <div key={c.label} className="flex justify-between text-xs">
                            <span style={{ color: 'var(--text-muted)' }}>{c.label}</span>
                            <span style={{ color: 'var(--text-primary)' }}>${Number(c.value).toFixed(2)}</span>
                          </div>
                        ))}
                      </>
                    )}
                    <div className="border-t pt-2" style={{ borderColor: 'var(--card-border)', opacity: 0.4 }}>
                      <div className="flex justify-between text-sm font-bold">
                        <span style={{ color: 'var(--text-primary)' }}>TOTAL</span>
                        <span style={{ color: '#FF3E41' }}>${Number(shipment.total_charge || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t pt-3" style={{ borderColor: 'var(--card-border)', opacity: 0.4 }}>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Thank you for choosing Nexatrack</p>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button size="sm" variant="outline" onClick={shareAsPdf} disabled={sending} className="flex-1 sm:flex-none text-xs h-7"
                        style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                        {sending ? <Loader2 size={12} className="mr-1 animate-spin" /> : <Share2 size={12} className="mr-1" />}
                        {sending ? "PDF..." : "PDF"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={copyLink} className="flex-1 sm:flex-none text-xs h-7"
                        style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}>
                        {copied ? <Check size={12} className="mr-1 text-green-400" /> : <Copy size={12} className="mr-1" />}
                        {copied ? "Copied" : "Copy"}
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-1" style={{ background: 'linear-gradient(to bottom, #FF3E41, #FF8A8A)' }} />
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
                  const isComplete = currentIdx >= statusIdx && shipment.status !== "on_hold"
                  const isCurrent = s === shipment.status
                  const dot = shipment.status === "on_hold" ? "bg-gray-700" : isComplete ? "bg-green-500" : isCurrent ? "bg-[#FF3E41] animate-pulse" : "bg-[#1a1725]"
                  const textClr = shipment.status === "on_hold" ? "text-[var(--text-muted)]" : isComplete ? "text-green-400" : isCurrent ? "text-white font-medium" : "text-[var(--text-muted)]"
                  return (
                    <div key={s} className="flex items-center gap-2 py-0.5">
                      <div className={`h-2 w-2 shrink-0 rounded-full ${dot}`} />
                      <span className={`text-xs ${textClr}`} style={isCurrent && shipment.status !== "on_hold" ? { color: 'var(--text-primary)' } : {}}>
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

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowSuccess(false)}>
          <div className="mx-4 w-full max-w-sm animate-in zoom-in-95 fade-in rounded-2xl p-6 text-center shadow-2xl duration-200"
            style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
            onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>
              <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Status Updated</p>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Changed to {STATUS_LABELS[successStatus] || successStatus?.replace(/_/g, " ")}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
